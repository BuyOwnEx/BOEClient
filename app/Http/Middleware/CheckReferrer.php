<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckReferrer
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
            if ($request->has('ref'))
                if(gettype($request->query('ref')) === 'string' && strlen($request->query('ref')) < 20)
                    session(['ref' => $request->query('ref')]);
        }
        return $next($request);
    }
}
