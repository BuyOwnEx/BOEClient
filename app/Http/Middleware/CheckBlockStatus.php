<?php

namespace App\Http\Middleware;

use App\Library\BuyOwnExClientAPI;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckBlockStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $status = Cache::remember('block-status', 5, function (){
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->getBlockStatus(Auth::id())->getOriginalContent();
        });
        if (($status['status'] & 4) === 4)
        {
            return response()->json([
                'code' => '102',
                'message' => 'Access denied',
            ],403);
        }
        return $next($request);
    }
}
