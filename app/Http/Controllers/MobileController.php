<?php

namespace App\Http\Controllers;

use App\Events\ApiRegistered;
use App\Library\BuyOwnExClientAPI;
use App\Models\User;
use App\Notifications\APIResetPassword;
use App\Notifications\ApiVerifyEmail;
use App\Rules\TraderExists;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MobileController extends Controller
{
    public function register_trader(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'min:5' ,'max:128', 'regex:/^([a-zA-Z0-9-_])+$/', 'unique:users', new TraderExists],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed']
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        try
        {
            $referrer = User::find(intval(session()->pull('ref'))); // intval(null) = 0
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'invite_code' => $referrer?->id
            ]);
            event(new ApiRegistered($user));
            return response()->json([
                'success' => true,
            ],200);
        }
        catch (Exception $exception)
        {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ],500);
        }
    }
    public function resend_verify_email(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255', 'exists:users,email'],
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        $user = User::whereEmail($request->email)->first();
        if(!$user)
        {
            return response()->json([
                'success' => false,
                'message' => trans('auth.no_such_user')
            ],400);
        }
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => trans('auth.already_verified')
            ],400);
        }
        $user->notify(new ApiVerifyEmail);
        return response()->json([
            'success' => true,
            'message' => trans('auth.successfully_resend')
        ],200);
    }
    public function reset_password_request(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255', 'exists:users,email'],
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        $user = User::whereEmail($request->email)->first();
        $record = DB::table('password_resets')->where(
            'email', '=', $request->email
        )->first();
        if ($record && Carbon::parse($record->created_at)->addSeconds(60)->isFuture())
        {
            return response()->json([
                'success' => false,
                'message' => trans('passwords.throttled'),
            ],404);
        }
        DB::table('password_resets')->where('email', '=', $request->email)->delete();
        $token = substr(hash_hmac('sha256', Str::random(40), $this->getHashKey()), 0, 6);
        $hash_token = Hash::make($token);
        DB::table('password_resets')->insert(['email' => $request->email, 'token' => $hash_token, 'created_at' => new Carbon]);

        $user->notify(new APIResetPassword(crc32($hash_token)));
        return response()->json([
            'success' => true,
            'message' => trans('passwords.sent'),
        ],200);
    }
    public function reset_password_confirm(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'token' => ['required', 'string', 'max:10'],
            'email' => ['required', 'string', 'email', 'max:255', 'exists:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed']
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        $user = User::where('email', '=', $request->email)->first();
        if(!$user)
        {
            return response()->json([
                'success' => false,
                'message' => trans('auth.no_such_user')
            ],400);
        }
        if ($user && ! $user instanceof CanResetPasswordContract) {
            return response()->json([
                'success' => false,
                'message' => trans('User must implement CanResetPassword interface.'),
            ],400);
        }
        $record = DB::table('password_resets')
            ->where('email', '=', $request->email)
            ->first();
        if(!$record)
        {
            return response()->json([
                'success' => false,
                'message' => trans('Invalid token'),
            ],400);
        }
        else
        {
            if(strval(crc32($record->token)) !== $request->token)
            {
                return response()->json([
                    'success' => false,
                    'message' => trans('Invalid token'),
                ],400);
            }
        }
        try
        {
            DB::table('password_resets')->where('email', '=', $request->email)->delete();
            $user->password = Hash::make($request->password);
            $user->setRememberToken(Str::random(60));
            event(new PasswordReset($user));
            return response()->json([
                'success' => true,
            ],200);
        }
        catch (Exception $exception)
        {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ],500);
        }
    }
    public function verify_trader(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255', 'exists:users,email'],
            'code' => ['required', 'string', 'size:6']
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        $user = User::whereEmail($request->email)->first();
        if (! hash_equals((string) $request->code, substr(sha1($user->email),0,6))) {
            throw new AuthorizationException;
        }
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => trans('auth.already_verified'),
            ],400);
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
                    return response()->json([
                        'success' => true,
                    ],200);
                }
            }
        }
        catch (Exception $exception)
        {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ],500);
        }
    }
    public function get_trader_token(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255', 'exists:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'device_name' => [ 'required', 'string']
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        try
        {
            $user = User::where('email', $request->email)->first();
            if(!$user)
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ],400);
            if(!Hash::check($request->password, $user->password))
                return response()->json([
                    'success' => false,
                    'message' => 'The provided credentials are incorrect',
                ],400);
            $token = $user->createTokenWithDelete($request->device_name);
            return response()->json([
                'success' => true,
                'token' => $token->plainTextToken,
                'secret' => $token->plainTextSecretToken
            ],200);
        }
        catch (Exception $exception)
        {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ],500);
        }
    }

    protected function getHashKey()
    {
        $key = config('app.key');
        if (Str::startsWith($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }
        return $key;
    }
}
