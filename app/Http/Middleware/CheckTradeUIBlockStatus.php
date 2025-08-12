<?php

namespace App\Http\Middleware;

use App\Library\BuyOwnExClientAPI;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CheckTradeUIBlockStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(Auth::check())
        {
            $status = Cache::remember('block-status', 5, function (){
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->getBlockStatus(Auth::id())->getOriginalContent();
            });
            if (($status['status'] & 8) === 8) // check for trade ui block
            {
                return redirect('not-found');
            }
        }
        else
        {
            if($request->route()->getName() === 'api_view') {
                if((bool) env('VITE_CONFIG_DISABLED_API_PAGE_SHOW', false) === true) return redirect('not-found');
            }
            elseif ($request->route()->getName() === 'trading_view')
            {
                if((bool) env('VITE_CONFIG_DISABLED_TRADING_SHOW', false) === true) return redirect('not-found');
            }
            elseif ($request->route()->getName() === 'overview_view')
            {
                if((bool) env('VITE_CONFIG_DISABLED_MARKETS_SHOW', false) === true) return redirect('not-found');
            }
        }
        return $next($request);
    }
}
