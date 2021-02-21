<?php

namespace App\Http\Controllers;

use App\Library\BuyOwnExClientAPI;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TraderController extends Controller
{
    public function getTradingView(Request $request, $market = null, $currency = null)
    {
        if (!isset($market)) {
            return response(view('errors.404'), 404);
        }
        if (!isset($currency)) {
            return response(view('errors.404'), 404);
        }
        return view('trading', ['currency'=>$currency, 'market'=>$market, 'user' => Auth::user()]);
    }
    public function getBalanceView(Request $request)
    {
        return view('balance', ['user' => Auth::user()]);
    }
    public function getOverviewView(Request $request)
    {
        return view('overview', ['user' => Auth::user(), 'currency' => env('DEFAULT_CURRENCY', 'BTC'), 'market' => env('DEFAULT_MARKET', 'USDT')]);
    }
    public function getTransactionsView(Request $request)
    {
        return view('transactions', ['user' => Auth::user()]);
    }
    public function getFiatTransactionsView(Request $request)
    {
        return view('fiat_transactions', ['user' => Auth::user()]);
    }
    public function getTransfersView(Request $request)
    {
        return view('transfers', ['user' => Auth::user()]);
    }
    public function getOrdersView(Request $request)
    {
        return view('orders', ['user' => Auth::user()]);
    }
    public function getDealsView(Request $request)
    {
        return view('deals', ['user' => Auth::user()]);
    }
    public function getRefPaymentsView(Request $request)
    {
        return view('ref_payments', ['user' => Auth::user()]);
    }
    public function getSupportView(Request $request)
    {
        return view('support', ['user' => Auth::user()]);
    }
    public function getSettingsView(Request $request)
    {
        return view('settings', ['user' => Auth::user()]);
    }
    public function getNotificationsView(Request $request)
    {
        return view('notifications', ['user' => Auth::user()]);
    }



    public function getTickers()
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->tickers();
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getMarketData()
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->market_data();
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getDepth(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->depth($request->currency, $request->market);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function HistoryDealList(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->history_deals($request->currency, $request->market);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getChart(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->candlesticks($request->currency, $request->market, $request->range);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getCryptoCurrencies()
    {
        try {
            return Cache::remember('crypto_currencies', 60, function (){
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->crypto_currencies();
            });
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getFiatCurrencies()
    {
        try {
            return Cache::remember('fiat_currencies', 60, function (){
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->fiat_currencies();
            });
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getAllCurrencies()
    {
        try {
            return Cache::remember('all_currencies', 60, function (){
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->all_currencies();
            });
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getBalances()
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->balances(Auth::id());
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getOrders()
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->orders(Auth::id());
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getDeals()
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->deals(Auth::id());
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getPositions()
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->positions(Auth::id());
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function makeOrder(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->makeOrder(
                Auth::id(),
                $request->type,
                $request->currency,
                $request->market,
                $request->side,
                $request->amount,
                isset($request->rate) ? $request->rate : null,
                isset($request->base) ? $request->base : null,
                isset($request->sl_rate) ? $request->sl_rate : null,
                isset($request->tp_rate) ? $request->tp_rate : null,
                isset($request->ts_offset) ? $request->ts_offset : null,
                isset($request->margin) ? $request->margin : 0,
                isset($request->offer) ? $request->offer : 0
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function cancelOrder(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->cancelOrder(
                Auth::id(),
                $request->order
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function cancelAllOrders(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->cancelAllOrders(
                Auth::id(),
                $request->currency,
                $request->market,
                $request->all_pairs
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function cancelAllSLOrders(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->cancelAllSLOrders(
                Auth::id(),
                $request->currency,
                $request->market,
                $request->all_pairs
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function cancelAllTPOrders(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->cancelAllTPOrders(
                Auth::id(),
                $request->currency,
                $request->market,
                $request->all_pairs
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function cancelAllTSOrders(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->cancelAllTSOrders(
                Auth::id(),
                $request->currency,
                $request->market,
                $request->all_pairs
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getOfferList(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->getOffers(
                Auth::id(),
                $request->currency,
                isset($request->market) ? $request->market : null,
                $request->amount,
                $request->side,
                $request->type
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function closePosition(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->closePosition(
                Auth::id(),
                $request->position
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function closeAllPositions(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->closeAllPositions(
                Auth::id(),
                $request->currency,
                $request->market,
                $request->all_pairs
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function closeAllLongPositions(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->closeAllLongPositions(
                Auth::id(),
                $request->currency,
                $request->market,
                $request->all_pairs
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function closeAllShortPositions(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->closeAllShortPositions(
                Auth::id(),
                $request->currency,
                $request->market,
                $request->all_pairs
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function depositPosition(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->depositPosition(
                Auth::id(),
                $request->position,
                $request->currency,
                $request->market,
                $request->amount
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getWithdrawalList(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->activeWithdrawals(
                Auth::id()
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function transferToTradeWallet(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->transferToTradeWallet(
                Auth::id(),
                $request->currency,
                $request->amount
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function transferToSafeWallet(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->transferToSafeWallet(
                Auth::id(),
                $request->currency,
                $request->amount
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getAllOrders(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_orders(Auth::id(), $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, $request->mustSort, $request->multiSort, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllDeals(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_deals(Auth::id(), $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, $request->mustSort, $request->multiSort, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllTransactions(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_transactions(Auth::id(), $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, $request->mustSort, $request->multiSort, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllFiatTransactions(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_fiat_transactions(Auth::id(), $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, $request->mustSort, $request->multiSort, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllTransfers(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_transfers(Auth::id(), $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, $request->mustSort, $request->multiSort, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllRefPayments(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_ref_payments(Auth::id(), $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, $request->mustSort, $request->multiSort, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllFollowers(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_followers(Auth::id(), $request->name);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllReferralTypes(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_referral_types(Auth::id());
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
}
