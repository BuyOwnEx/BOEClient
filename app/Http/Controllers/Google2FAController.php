<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateSecretRequest;
use App\User;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use ParagonIE\ConstantTime\Base32;
use PragmaRX\Google2FA\Google2FA;

class Google2FAController extends Controller
{
    use ValidatesRequests;
    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('web');
    }
    public function enableTwoFactorReady(ValidateSecretRequest $request)
    {
        $user = $request->user();
        $secret = $request->secret;

        $userId = $request->session()->pull('2fa:user:id');
        $key    = $userId . ':' . $request->totp;

        //use cache to store token to blacklist
        Cache::add($key, true, 4);

        //encrypt and then save secret
        $user->google2fa_enabled = true;
        $user->save();
        return ['success'=> true];
    }
    public function disableTwoFactorReady(ValidateSecretRequest $request)
    {
        $userId = $request->session()->pull('2fa:user:id');
        $key    = $userId . ':' . $request->totp;

        //use cache to store token to blacklist
        Cache::add($key, true, 4);
        $user = User::findOrFail($userId);
        $user->google2fa_enabled = false;
        $user->save();
        return ['success'=> true];
    }

    public function forgetTwoFactor()
    {
        return view('2fa_forget');
    }

    public function generateTwoFactor(Request $request)
    {
        if(Auth::user() && !Auth::user()->g2fa)
        {
            $secret = $this->generateSecret();
            Auth::user()->g2fa_secret = Crypt::encrypt($secret);
            Auth::user()->save();

            $google2fa = (new \PragmaRX\Google2FAQRCode\Google2FA());

            $imageDataUri = $google2fa->getQRCodeInline(
                $request->getHttpHost(),
                Auth::user()->email,
                $secret,
                200
            );
            $request->session()->put('2fa:user:id', Auth::id());
            return ['success' => true, 'secret' => $secret, 'image' => $imageDataUri];
        }
    }

    private function generateSecret()
    {
        $randomBytes = random_bytes(10);
        return Base32::encodeUpper($randomBytes);
    }
}
