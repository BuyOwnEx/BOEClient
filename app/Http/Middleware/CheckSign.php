<?php

namespace App\Http\Middleware;

use App\PersonalAccessToken;
use Closure;
use Illuminate\Support\Facades\Log;

class CheckSign
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
        $access = PersonalAccessToken::findToken($request->bearerToken());
        Log::info($request->header('X-Signature'));
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
        Log::info($signature);
        return $signature;
    }
}
