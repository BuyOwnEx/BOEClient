<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Library\BuyOwnExClientAPI;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Auth\VerifiesEmails;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
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

    use VerifiesEmails;

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
        //$this->middleware('auth');
        $this->middleware('signed')->only('verify');
        $this->middleware('throttle:3,1')->only('verify', 'resend');
    }

    public function show(Request $request)
    {
        return $request->session()->has('activation')
            ? view('spa')
            : redirect($this->redirectPath());
    }

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
                : redirect($this->redirectPath())->with('error', __('app.auth.already_verified'));
        }
        try
        {
            DB::beginTransaction();
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            $res = $api->registerTrader($user);
            if($res->status() !== 200)
            {
                DB::rollBack();
                return $request->wantsJson()
                    ? new JsonResponse([], 204)
                    : redirect($this->redirectPath())->with('error', __('app.auth.verification_error'));
            }
            else
            {
                $result = json_decode($res->content(), true);
                if(!$result['success'])
                {
                    DB::rollBack();
                    return $request->wantsJson()
                        ? new JsonResponse([], 204)
                        : redirect($this->redirectPath())->with('error', __('app.auth.verification_error'));
                }
                else
                {
                    $user->email_verified_at = Date::now();
                    $user->save();
                    event(new Verified($user));
                    DB::commit();
                    if ($response = $this->verified($request)) {
                        return $response;
                    }
                    return $request->wantsJson()
                        ? new JsonResponse([], 204)
                        : redirect($this->redirectPath())->with('verified', true);
                }
            }
        }
        catch (Exception $exception)
        {
            Log::error($exception->getMessage());
            DB::rollBack();
            return $request->wantsJson()
                ? new JsonResponse([], 204)
                : redirect($this->redirectPath())->with('verified', false);
        }
    }

    public function resend(Request $request)
    {
        if ($request->ajax())
        {
            $user = User::whereEmail($request->email)->first();
            if(!$user)
            {
                return response()->json([
                    'resend' => false,
                    'message' => __('app.auth.no_such_user')
                ]);
            }
            if ($user->email_verified_at) {
                return response()->json([
                    'resend' => false,
                    'message' => __('app.auth.already_verified')
                ]);
            }
            $user->notify(new VerifyEmail);

            return response()->json([
                'resend' => true,
            ]);
        }
        return $request->wantsJson()
            ? new JsonResponse([], 202)
            : back()->with('resent', true);
    }

    protected function verified(Request $request)
    {
        $request->session()->flash('verified', true);
        return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect($this->redirectPath())->with('verified', true);
    }
}
