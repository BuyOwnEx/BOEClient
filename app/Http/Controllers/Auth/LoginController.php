<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * The user has been authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function authenticated(Request $request, $user)
    {
        if ($request->ajax())
        {
            if(!$user->hasVerifiedEmail()) {
                $this->guard()->logout();
                $request->session()->flash('activation', $user);
                return response()->json([
                    'auth' => true,
                    'intended' => '/email/verify',
                ]);
            }
            elseif($user->g2fa)
            {
                $this->guard()->logout();
                $request->session()->put('2fa:user:id', $user->id);
                return response()->json([
                    'auth' => true,
                    'intended' => '/2fa/validate',
                ]);
            }
            return response()->json([
                'auth' => auth()->check(),
                'intended' => $this->redirectPath(),
            ]);
        }
        return true;
    }
}
