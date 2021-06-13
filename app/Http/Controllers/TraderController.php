<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConfirmWithdrawRequest;
use App\Library\APIToken;
use App\Library\BuyOwnExClientAPI;
use App\Library\SumSubAPI;
use App\PersonalAccessToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Arr;

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
        $find_pair = Arr::where(app('all-pairs'), function ($value, $key) use ($currency, $market){
            return $value['currency'] === mb_strtoupper($currency) && $value['market'] === mb_strtoupper($market);
        });
        if(!$find_pair)
        {
            return response(view('errors.404'), 404);
        }
        return view('trading', [
            'currency'=>$currency,
            'market'=>$market,
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getBalanceView(Request $request)
    {
        return view('balance', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getOverviewView(Request $request)
    {
        return view('overview', [
            'user' => $request->user(),
            'currency' => env('DEFAULT_CURRENCY', 'BTC'),
            'market' => env('DEFAULT_MARKET', 'USDT'),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getTransactionsView(Request $request)
    {
        return view('transactions', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getFiatTransactionsView(Request $request)
    {
        return view('fiat_transactions', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getTransfersView(Request $request)
    {
        return view('transfers', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getOrdersView(Request $request)
    {
        return view('orders', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getDealsView(Request $request)
    {
        return view('deals', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getRefPaymentsView(Request $request)
    {
        return view('ref_payments', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getSupportView(Request $request)
    {
        return view('support', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getProfileView(Request $request)
    {
        return view('profile', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getNotificationsView(Request $request)
    {
        return view('notifications', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getPolicyView(Request $request)
    {
        return view('policy', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getTermsView(Request $request)
    {
        return view('terms', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getApiView(Request $request)
    {
        return view('api', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getFeesView(Request $request)
    {
        return view('fees', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getStatusView(Request $request)
    {
        return view('status', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
    }
    public function getContactsView(Request $request)
    {
        return view('contacts', [
            'user' => $request->user(),
            'config' => [
                'fiat' => true,
                'leverageLevel' => 5
            ]
        ]);
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
    public function getHealth()
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->health();
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
    public function withdrawCryptoRequest(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->withdrawCryptoRequest(
                Auth::id(),
                $request->user()->email,
                $request->currency,
                $request->amount,
                $request->address
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function withdrawCryptoConfirm(ConfirmWithdrawRequest $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->withdrawCryptoConfirm(
                Auth::id(),
                $request->code
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function withdrawCryptoCancel(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->withdrawCryptoCancel(
                Auth::id(),
                $request->id
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function withdrawFiatCancel(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->withdrawFiatCancel(
                Auth::id(),
                $request->id
            );
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function sendMessage(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->sendMessage(
                Auth::id(),
                $request->message
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
    public function setReferralType(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->set_referral_type(Auth::id(),$request->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAddress(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->get_address(Auth::id(),$request->currency);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function validateAddress(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->validate_address(Auth::id(), $request->currency, $request->address);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getSumSubToken(Request $request)
    {
        try {
            $api = new SumSubAPI(config('kyc.api-public-key'), config('kyc.api-secret-key'));
            return $api->getAccessToken($request->user()->name);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function newAPIToken(Request $request)
    {
        try {
            Sanctum::usePersonalAccessTokenModel('App\PersonalAccessToken');
            $token = $request->user()->createToken($request->name, $request->abilities);
            return ['success'=>true, 'data'=>$token];
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function editAPIToken(Request $request)
    {
        try {
            $token = PersonalAccessToken::findOrFail($request->id);
            $token->abilities = $request->abilities;
            $token->save();
            return ['success'=>true, 'data'=>$token];
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAPITokens(Request $request)
    {
        try {
            Sanctum::usePersonalAccessTokenModel('App\PersonalAccessToken');
            $tokens = $request->user()->tokens;
            return ['success'=>true, 'abilities'=>APIToken::$abilities, 'data'=>$tokens];
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function deleteAPIToken(Request $request)
    {
        try {
            Sanctum::usePersonalAccessTokenModel('App\PersonalAccessToken');
            $request->user()->tokens()->where('id', $request->id)->delete();
            return ['success'=>true];
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function deleteAllAPITokens(Request $request)
    {
        try {
            Sanctum::usePersonalAccessTokenModel('App\PersonalAccessToken');
            $request->user()->tokens()->delete();
            return ['success'=>true];
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function setLocale(Request $request)
    {
        if (in_array($request->lang, config('app.locales'))) {   # Проверяем, что у пользователя выбран доступный язык
            App::setLocale($request->lang);
            session(['locale' =>$request->lang]);
            if($request->user())
            {
                $request->user()->language = $request->lang;
                $request->user()->save();
            }
            return ['success'=>true];
        }
        else {
            return ['success'=>false, 'message'=>'Language is not supported'];
        }
    }
}
