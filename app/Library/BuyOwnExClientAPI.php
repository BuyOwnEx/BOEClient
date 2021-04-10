<?php

namespace App\Library;

use App\Exceptions\ExceptionBuyOwnExAPI;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BuyOwnExClientAPI
{
    const VERSION = 'v1';
    const PREFIX = 'X-';
    protected $base = 'http://127.0.0.1:18888/';

    protected $api_key;
    protected $api_secret;
    protected $info = [
        "timeOffset" => 0,
    ];

    const BadConstruction = 1000;

    public function __construct()
    {
        $param = func_get_args();
        switch (count($param)) {
            case 2:
                $this->api_key = $param[0];
                $this->api_secret = $param[1];
                $this->base = config('app.server','http://127.0.0.1:18888').'/';
                break;
            default:
                throw new ExceptionBuyOwnExAPI(self::BadConstruction);
        }
    }

    public function candlesticks(string $currency, string $market, string $range = NULL)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/graph',[
            'currency' => $currency,
            'market' => $market,
            'range' => $range === NULL ? "1m" : $range
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function crypto_currencies()
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/crypto_currencies');
        return response()->json($response->json(),$response->status());
    }

    public function fiat_currencies()
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/fiat_currencies');
        return response()->json($response->json(),$response->status());
    }

    public function all_currencies()
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_currencies');
        return response()->json($response->json(),$response->status());
    }

    public function history_deals(string $currency, string $market)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/history_deals',[
            'currency' => $currency,
            'market' => $market,
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function tickers()
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/tickers');
        return response()->json($response->json(),$response->status());
    }

    public function market_data()
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/market_data');
        return response()->json($response->json(),$response->status());
    }

    public function depth(string $currency, string $market)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/depth',[
            'currency' => $currency,
            'market' => $market,
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function get_own_jwt_token(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/get_own_jwt_token',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function refresh_own_jwt_token(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/refresh_own_jwt_token',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function get_private_jwt_token(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/get_private_jwt_token',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function balances(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/balances',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function orders(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/orders',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function deals(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/deals',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function positions(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/positions',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function activeWithdrawals(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/active_withdrawals',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function makeOrder(
        int $user_id,
        string $type,
        string $currency,
        string $market,
        int $side,
        $amount,
        $rate = null,
        int $base = null,
        $sl_rate = null,
        $tp_rate = null,
        $ts_offset = null,
        int $margin = null,
        int $offer = null
    )
    {
        $params = [
            'trader' => $user_id,
            'type'  => $type,
            'currency' => $currency,
            'market' => $market,
            'side' => $side,
            'amount' => $amount,
            'rate' => $rate,
            'base' => $base,
            'sl_rate' => $sl_rate,
            'tp_rate' => $tp_rate,
            'ts_offset' => $ts_offset,
            'margin' => $margin === null ? 0 : $margin,
            'offer' => $offer === null ? 0 : $offer
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/make_order',$params);
        return response()->json($response->json(),$response->status());
    }

    public function cancelOrder(int $user_id, int $order_id)
    {
        $params = [
            'trader' => $user_id,
            'order'  => $order_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/cancel_order',$params);
        return response()->json($response->json(),$response->status());
    }
    public function cancelAllOrders(int $user_id, string $currency, string $market, bool $all_pairs = null)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'market' => $market,
            'all_pairs' => $all_pairs === null ? false : $all_pairs
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/cancel_all_orders',$params);
        return response()->json($response->json(),$response->status());
    }
    public function cancelAllSLOrders(int $user_id, string $currency, string $market, bool $all_pairs = null)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'market' => $market,
            'all_pairs' => $all_pairs === null ? false : $all_pairs
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/cancel_all_sl_orders',$params);
        return response()->json($response->json(),$response->status());
    }
    public function cancelAllTPOrders(int $user_id, string $currency, string $market, bool $all_pairs = null)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'market' => $market,
            'all_pairs' => $all_pairs === null ? false : $all_pairs
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/cancel_all_tp_orders',$params);
        return response()->json($response->json(),$response->status());
    }
    public function cancelAllTSOrders(int $user_id, string $currency, string $market, bool $all_pairs = null)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'market' => $market,
            'all_pairs' => $all_pairs === null ? false : $all_pairs
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/cancel_all_ts_orders',$params);
        return response()->json($response->json(),$response->status());
    }
    public function getOffers(int $user_id, string $currency, $market, $amount, int $side, string $type)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'market' => $market,
            'amount' => $amount,
            'side' => $side,
            'type' => $type
        ];
        $response = Http::withToken($this->api_key)
            ->get($this->base.'v1/offers',$params);
        return response()->json($response->json(),$response->status());
    }
    public function closePosition(int $user_id, $position_id)
    {
        $params = [
            'trader' => $user_id,
            'position'  => $position_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/close_position',$params);
        return response()->json($response->json(),$response->status());
    }
    public function closeAllPositions(int $user_id, string $currency, string $market, bool $all_pairs = null)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'market' => $market,
            'all_pairs' => $all_pairs === null ? false : $all_pairs
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/close_all_positions',$params);
        return response()->json($response->json(),$response->status());
    }
    public function closeAllLongPositions(int $user_id, string $currency, string $market, bool $all_pairs = null)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'market' => $market,
            'all_pairs' => $all_pairs === null ? false : $all_pairs
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/close_all_long_positions',$params);
        return response()->json($response->json(),$response->status());
    }
    public function closeAllShortPositions(int $user_id, string $currency, string $market, bool $all_pairs = null)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'market' => $market,
            'all_pairs' => $all_pairs === null ? false : $all_pairs
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/close_all_short_positions',$params);
        return response()->json($response->json(),$response->status());
    }
    public function depositPosition(int $user_id, int $position, string $currency, string $market, $amount)
    {
        $params = [
            'trader' => $user_id,
            'position' => $position,
            'currency' => $currency,
            'market' => $market,
            'amount' => $amount
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/deposit_position',$params);
        return response()->json($response->json(),$response->status());
    }
    public function transferToTradeWallet(int $user_id, string $currency, $amount)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'amount' => $amount
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/transfer_trade',$params);
        return response()->json($response->json(),$response->status());
    }
    public function transferToSafeWallet(int $user_id, string $currency, $amount)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'amount' => $amount
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/transfer_safe',$params);
        return response()->json($response->json(),$response->status());
    }

    public function sendMessage(int $user_id, string $message)
    {
        $params = [
            'trader' => $user_id,
            'message' => $message
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/send_message',$params);
        return response()->json($response->json(),$response->status());
    }

    private function sign($params)
    {
        $prefix = self::PREFIX;
        $auth = [
            'Accept' => 'application/json',
            $prefix . 'version'   => self::VERSION,
            $prefix . 'timestamp' => time(),
        ];
        ksort($params);
        $postFields = http_build_query($params, '', '&');
        Log::info($postFields);
        $signature = strtoupper(hash_hmac('sha256', $postFields, $this->api_secret));
        $auth[$prefix . 'signature'] = $signature;
        return $auth;
    }

    public function all_orders(int $user_id, $page, $itemsPerPage, $sortBy, $sortDesc, $mustSort, $multiSort, $filters)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_orders',[
            'trader' => $user_id,
            'page' => $page,
            'itemsPerPage' => $itemsPerPage,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'mustSort' => $mustSort,
            'multiSort' => $multiSort,
            'filters' => $filters
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function all_deals(int $user_id, $page, $itemsPerPage, $sortBy, $sortDesc, $mustSort, $multiSort, $filters)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_deals',[
            'trader' => $user_id,
            'page' => $page,
            'itemsPerPage' => $itemsPerPage,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'mustSort' => $mustSort,
            'multiSort' => $multiSort,
            'filters' => $filters
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function all_transactions(int $user_id, $page, $itemsPerPage, $sortBy, $sortDesc, $mustSort, $multiSort, $filters)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_transactions',[
            'trader' => $user_id,
            'page' => $page,
            'itemsPerPage' => $itemsPerPage,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'mustSort' => $mustSort,
            'multiSort' => $multiSort,
            'filters' => $filters
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function all_fiat_transactions(int $user_id, $page, $itemsPerPage, $sortBy, $sortDesc, $mustSort, $multiSort, $filters)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_fiat_transactions',[
            'trader' => $user_id,
            'page' => $page,
            'itemsPerPage' => $itemsPerPage,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'mustSort' => $mustSort,
            'multiSort' => $multiSort,
            'filters' => $filters
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function all_transfers(int $user_id, $page, $itemsPerPage, $sortBy, $sortDesc, $mustSort, $multiSort, $filters)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_transfers',[
            'trader' => $user_id,
            'page' => $page,
            'itemsPerPage' => $itemsPerPage,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'mustSort' => $mustSort,
            'multiSort' => $multiSort,
            'filters' => $filters
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function all_ref_payments(int $user_id, $page, $itemsPerPage, $sortBy, $sortDesc, $mustSort, $multiSort, $filters)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_ref_payments',[
            'trader' => $user_id,
            'page' => $page,
            'itemsPerPage' => $itemsPerPage,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'mustSort' => $mustSort,
            'multiSort' => $multiSort,
            'filters' => $filters
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function all_followers(int $user_id, $name)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_followers',[
            'trader' => $user_id,
            'name' => $name
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function all_referral_types(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_referral_types',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function set_referral_type(int $user_id, int $ref_id)
    {
        $params = [
            'trader' => $user_id,
            'ref_id' => $ref_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/set_referral_type',$params);
        return response()->json($response->json(),$response->status());
    }
    public function get_address(int $user_id, string $currency)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/get_address',[
            'trader' => $user_id,
            'currency' => $currency
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function validate_address(int $user_id, string $currency, string $address)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'address' => $address
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/validate_address',$params);
        return response()->json($response->json(),$response->status());
    }

    public function registerTrader($trader)
    {
        Log::info($trader);
        $params = [
            'trader' => $trader->id,
            'name' => $trader->name,
            'email' => $trader->email,
            'ref' => $trader->inviteCode,
        ];
        $response = Http::withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/register_trader',$params);
        return response()->json($response->json(),$response->status());
    }
}