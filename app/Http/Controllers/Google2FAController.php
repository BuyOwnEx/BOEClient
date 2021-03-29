<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateSecretRequest;
use App\User;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

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
        return redirect(route('settings'))->with('status','2FA was successfully enabled');
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

        return redirect(route('settings'))->with('status','2FA was successfully disabled');
    }

    /**
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */

    public function forgetTwoFactor(Request $request)
    {
        return view('2fa/forgetTwoFactor');
    }
}
