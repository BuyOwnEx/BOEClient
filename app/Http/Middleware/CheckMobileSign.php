<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMobileSign
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(config('app.mobile-api-enabled'))
        {
            $api_public = $request->header('X-Mobile-Public-Key');
            if(!$api_public)
                return response()->json([
                    'code' => '100',
                    'message' => 'Unauthorized',
                ],401);
            if($api_public !== config('app.api-mobile-public-key'))
                return response()->json([
                    'code' => '101',
                    'message' => 'Forbidden',
                ],403);
            if($request->header('X-Mobile-Signature') !== $this->signature($request->all(),config('app.api-mobile-secret-key')))
            {
                return response()->json([
                    'code' => '102',
                    'message' => 'Bad Signature',
                ],403);
            }
            return $next($request);
        }
        else
        {
            return response()->json([
                'code' => '103',
                'message' => 'Mobile API disabled',
            ],403);
        }
    }

    private function signature($params, $secret)
    {
        ksort($params);
        $postFields = http_build_query($params, '', '&');
        $signature = strtoupper(hash_hmac('sha256', $postFields, $secret));
        return $signature;
    }
}
