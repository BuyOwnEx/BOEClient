<?php

namespace App\Http\Middleware;

use App\Models\PersonalAccessToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSign
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $access = PersonalAccessToken::findToken($request->bearerToken());
        if($request->header('X-Signature')!==$this->signature($request->all(),$access->secret))
        {
            return response()->json([
                'code' => '101',
                'message' => 'Bad Signature',
            ],403);
        }
        return $next($request);
    }

    private function signature($params, $secret)
    {
        ksort($params);
        $postFields = http_build_query($params, '', '&');
        $signature = strtoupper(hash_hmac('sha256', $postFields, $secret));
        return $signature;
    }
}
