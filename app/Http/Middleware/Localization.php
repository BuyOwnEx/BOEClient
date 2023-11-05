<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class Localization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
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
