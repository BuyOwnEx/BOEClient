<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;

class Localization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!$request->user())
        {
            $locale = session()->get('locale');
            if(!$locale)
            {
                $locale = substr($request->server('HTTP_ACCEPT_LANGUAGE'), 0, 2);
                if (!in_array($locale, config('app.locales'))) {
                    $locale = config('app.locale');
                }
                session(['locale' =>$locale]);
            }
            App::setLocale($locale);
        }
        else {
            App::setLocale($request->user()->language);
        }
        return $next($request);
    }
}
