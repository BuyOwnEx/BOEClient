<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Library\BuyOwnExClientAPI;
use App\Providers\RouteServiceProvider;
use App\User;
use Exception;
use Illuminate\Foundation\Auth\VerifiesEmails;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Date;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VerificationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Email Verification Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling email verification for any
    | user that recently registered with the application. Emails may also
    | be re-sent if the user didn't receive the original email message.
    |
    */

    use VerifiesEmails {
        verify as public traitVerify;
        show as public traitShow;
    }

    /**
     * Where to redirect users after verification.
     *
     * @var string
     */
    protected $redirectTo = '/login';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth')->only('show', 'resend');
        $this->middleware('signed')->only('verify');
        $this->middleware('throttle:3,1')->only('verify', 'resend');
    }

    /**
     * Show the email verification notice.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function show(Request $request)
    {
        return $request->session()->has('activation')
            ? view('auth.verify')
            : redirect($this->redirectPath());
    }

    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function verify(Request $request)
    {
        if(!$request->route('id')) {
            throw new AuthorizationException;
        }
        $user = User::findOrFail($request->route('id'));

        if (! hash_equals((string) $request->route('hash'), sha1($user->email))) {
            throw new AuthorizationException;
        }

        if ($user->email_verified_at) {
            return $request->wantsJson()
                ? new JsonResponse([], 204)
                : redirect($this->redirectPath())->with('error', trans('auth.already_verified'));
        }
        try
        {
            DB::beginTransaction();
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            $res = $api->registerTrader($user);
            Log::info($res->status());
            Log::info($res->content());
            if($res->status() !== 200)
            {
                DB::rollBack();
                return $request->wantsJson()
                    ? new JsonResponse([], 204)
                    : redirect($this->redirectPath())->with('error', trans('auth.verification_error'));
            }
            else
            {
                $result = json_decode($res->content(), true);
                Log::info($result);
                if(!$result['success'])
                {
                    DB::rollBack();
                    return $request->wantsJson()
                        ? new JsonResponse([], 204)
                        : redirect($this->redirectPath())->with('error', trans('auth.verification_error'));
                }
                else
                {
                    $user->email_verified_at = Date::now();
                    $user->save();
                    event(new Verified($user));
                    if ($response = $this->verified($request)) {
                        DB::commit();
                        return $response;
                    }
                    DB::commit();
                    return $request->wantsJson()
                        ? new JsonResponse([], 204)
                        : redirect($this->redirectPath())->with('verified', true);
                }
            }
        }
        catch (Exception $exception)
        {
            DB::rollBack();
            return $request->wantsJson()
                ? new JsonResponse([], 204)
                : redirect($this->redirectPath())->with('verified', false);
        }
    }

    /**
     * Resend the email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function resend(Request $request)
    {
        if ($request->ajax())
        {
            $user = User::whereEmail($request->email)->first();
            if(!$user)
            {
                return response()->json([
                    'resend' => false,
                    'message' => trans('auth.no_such_user')
                ]);
            }
            if ($user->email_verified_at) {
                return response()->json([
                    'resend' => false,
                    'message' => trans('auth.already_verified')
                ]);
            }
            $user->notify(new VerifyEmail);

            return response()->json([
                'resend' => true,
                'message' => trans('auth.already_verified')
            ]);
        }
        return $request->wantsJson()
            ? new JsonResponse([], 202)
            : back()->with('resent', true);
    }

    /**
     * The user has been verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    protected function verified(Request $request)
    {
        $request->session()->flash('verified', true);
        return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect($this->redirectPath())->with('verified', true);
    }
}
