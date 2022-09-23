<?php

namespace App\Http\Controllers;

use App\Events\ApiRegistered;
use App\Http\Requests\Validate2FARequest;
use App\Library\BuyOwnExClientAPI;
use App\Notifications\APIResetPassword;
use App\Notifications\ApiVerifyEmail;
use App\Rules\ActiveTraderExists;
use App\Rules\TraderExists;
use App\User;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use ParagonIE\ConstantTime\Base32;
use PragmaRX\Google2FAQRCode\Google2FA;
//use Illuminate\Validation\ValidationException;

class AppAPIController extends Controller
{
    /**
     * Minimum number of seconds before re-redefining the token.
     *
     * @var int
     */
    protected $throttle;
    protected $pass_reset_table;
    public function __construct()
    {
        $this->middleware('CheckMobileSign');
        $this->pass_reset_table = 'password_resets';
        $this->throttle = 60;
    }
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::whereEmail($request->email)->first();
        if (is_null($user)) {
            return response()->json([
                'success' => false,
                'message' => trans('passwords.user'),
            ],404);
        }
        $record = (array) $this->getPassResetTable()->where(
            'email', $request->email
        )->first();
        if ($record && $this->tokenRecentlyCreated($record['created_at']))
        {
            return response()->json([
                'success' => false,
                'message' => trans('passwords.throttled'),
            ],404);
        }

        $token = $this->create($request->email);

        $user->notify(new APIResetPassword($token));
        return response()->json([
            'success' => true,
            'message' => trans('passwords.sent'),
        ],404);
    }
    public function GetTraderToken(Request $request)
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
        try {
            $user = User::where('email', $request->email)->first();
            if(!$user)
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ],404);
            if(!Hash::check($request->password, $user->password))
                return response()->json([
                    'success' => false,
                    'message' => 'The provided credentials are incorrect',
                ],404);
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
    public function RegisterTrader(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'min:5' ,'max:128', 'regex:/^([a-zA-Z0-9-_])+$/', 'unique:users', new TraderExists],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'ref' => [
                'string',
                'max:100',
                new ActiveTraderExists
            ]
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        try {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'inviteCode' => $data['ref'] ?? null
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
    public function ResendTrader(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255'],
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
            ],204);
        }
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => trans('auth.already_verified')
            ],204);
        }
        $user->notify(new ApiVerifyEmail);
        return response()->json([
            'success' => true,
            'message' => trans('auth.successfully_resend')
        ],200);
    }
    public function VerifyTrader(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255'],
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
            ],204);
        }
        try
        {
            DB::beginTransaction();
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            $res = $api->registerTrader($user);
            if($res->status() !== 200)
            {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => trans('auth.verification_error'),
                ],204);
            }
            else
            {
                $result = json_decode($res->content(), true);
                if(!$result['success'])
                {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => trans('auth.verification_error'),
                    ],204);
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
    public function GetImage(Request $request)
    {
        try {
            $file = Storage::get(explode(env('APP_URL'), $request->path)[1]);
            return response($file);
        }
        catch (Exception $exception)
        {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ],500);
        }
    }
    public function UploadImages(Request $request)
    {
        $validator=Validator::make($request->all(), [
            'trader_id' => 'required|integer|exists:users,id',
            'file_ps' => 'required|file|image|mimes:jpeg,png|max:2048|dimensions:min_width=500,min_height=500,max_width=4160,max_height=4160',
            'file_ws' => 'required|file|image|mimes:jpeg,png|max:2048|dimensions:min_width=500,min_height=500,max_width=4160,max_height=4160',
            'file_ts' => 'required|file|image|mimes:jpeg,png|max:2048|dimensions:min_width=500,min_height=500,max_width=4160,max_height=4160',
        ], [], [
            'file_ps' => trans('kyc.file_ps'),
            'file_ws' => trans('kyc.file_ws'),
            'file_ts' => trans('kyc.file_ts'),
        ]);
        if ($validator->fails())
        {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        else
        {
            try{
                $path_ps = Storage::putFile('verifications/'.$request->trader_id, $request->file('file_ps'));
                $path_ws = Storage::putFile('verifications/'.$request->trader_id, $request->file('file_ws'));
                $path_ts = Storage::putFile('verifications/'.$request->trader_id, $request->file('file_ts'));
                return response()->json([
                    'success' => true,
                    'file_ps' => env('APP_URL').'/'.$path_ps,
                    'file_ws' => env('APP_URL').'/'.$path_ws,
                    'file_ts' => env('APP_URL').'/'.$path_ts
                ],200);
            }
            catch (Exception $e)
            {
                return ['success'=>false, 'message'=>$e->getMessage()];
            }
        }
    }
    public function Check2FA(Validate2FARequest $request)
    {
        try
        {
            $user = User::find($request->trader_id);
            if(!$user->g2fa)
            {
                return response()->json([
                    'success' => false,
                    'message' => '2FA disabled',
                ],500);
            }
            Cache::add($request->trader_id . ':' . $request->totp, true, 4);
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
    public function Enable2FA(Validate2FARequest $request)
    {
        try {
            $user = User::find($request->trader_id);
            if($user->g2fa)
            {
                return response()->json([
                    'success' => false,
                    'message' => '2FA already enabled',
                ],500);
            }
            Cache::add($request->trader_id . ':' . $request->totp, true, 4);
            $user = User::find($request->trader_id);
            $user->g2fa = true;
            $user->save();
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
    public function Disable2FA(Validate2FARequest $request)
    {
        try {
            $user = User::find($request->trader_id);
            if(!$user->g2fa)
            {
                return response()->json([
                    'success' => false,
                    'message' => '2FA already disabled',
                ],500);
            }
            Cache::add($request->trader_id . ':' . $request->totp, true, 4);
            $user = User::find($request->trader_id);
            $user->g2fa = false;
            $user->save();
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
    public function Image2FA(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'trader_id' => ['required', 'integer', 'exists:users,id']
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        try
        {
            $user = User::find($request->trader_id);
            if(!$user->email_verified_at)
            {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ],500);
            }
            if (!$user->g2fa)
            {
                $secret = $this->generateSecret();
                $user->g2fa_secret = Crypt::encrypt($secret);
                $user->save();

                $google2fa = new Google2FA();

                $imageDataUri = $google2fa->getQRCodeInline(
                    $request->getHttpHost(),
                    $user->email,
                    $secret,
                    200
                );
                return response()->json([
                    'success' => true,
                    'secret' => $secret,
                    'image' => $imageDataUri
                ],200);
            }
            else
            {
                return response()->json([
                    'success' => false,
                    'message' => 'User has already enabled 2FA',
                ],500);
            }
        }
        catch (Exception $exception)
        {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ],500);
        }
    }
    public function EmailChangeConfirm(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'trader_id' => ['required', 'integer', 'exists:users,id'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users']
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()->getMessages(),
            ],422);
        }
        try
        {
            $user = User::find($request->trader_id);
            $user->email = $request->email;
            $user->save();
            return response()->json([
                'success' => true
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

    private function generateSecret()
    {
        $randomBytes = random_bytes(10);
        return Base32::encodeUpper($randomBytes);
    }
    protected function getPassResetTable()
    {
        return DB::connection()->table($this->pass_reset_table);
    }
    /**
     * Determine if the token was recently created.
     *
     * @param  string  $createdAt
     * @return bool
     */
    protected function tokenRecentlyCreated($createdAt)
    {
        if ($this->throttle <= 0) {
            return false;
        }

        return Carbon::parse($createdAt)->addSeconds(
            $this->throttle
        )->isFuture();
    }
    /**
     * Create a new token record.
     *
     * @param  string  $email
     * @return string
     */
    public function create(string $email)
    {
        $this->deleteExistingPassResets($email);
        $token = $this->createNewToken();
        $this->getPassResetTable()->insert($this->getPayload($email, $token));
        return $token;
    }
    /**
     * Delete all existing reset tokens from the database.
     *
     * @param  \Illuminate\Contracts\Auth\CanResetPassword  $user
     * @return int
     */
    protected function deleteExistingPassResets(string $email)
    {
        return $this->getPassResetTable()->where('email', $email)->delete();
    }
    /**
     * Create a new token for the user.
     *
     * @return string
     */
    public function createNewToken()
    {
        return substr(hash_hmac('sha256', Str::random(40), $this->getHashKey()), 0, 6);
    }
    protected function getHashKey()
    {
        $key = config('app.key');
        if (Str::startsWith($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }
        return $key;
    }
    protected function getPayload($email, $token)
    {
        return ['email' => $email, 'token' => Hash::make($token), 'created_at' => new Carbon];
    }
}
