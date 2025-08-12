<?php

namespace App\Library;

use App\Exceptions\ExceptionBuyOwnExAPI;
use Illuminate\Support\Facades\Http;

class BuyOwnExOtcAPI
{
    const VERSION = 'v1';
    const PREFIX = 'X-';
    protected $base = 'http://127.0.0.1:18886/';

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
                $this->base = config('app.otc_server','http://127.0.0.1:18886').'/';
                break;
            default:
                throw new ExceptionBuyOwnExAPI(self::BadConstruction);
        }
    }
    public function all_exchanges(int $user_id, $page, $itemsPerPage, $sortBy, $sortDesc, $mustSort, $multiSort, $filters)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/exchanges',[
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
    public function exchange_dirs()
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/exchange_dirs');
        return response()->json($response->json(),$response->status());
    }
    public function exchange_depth(string $currency_out, string $currency_in)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/depth',[
            'currency_out' => $currency_out,
            'currency_in' => $currency_in
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function otc_replenish(int $user_id, string $currency, $amount)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'amount' => $amount
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/wallet/replenish',$params);
        return response()->json($response->json(),$response->status());
    }
    public function otc_withdraw(int $user_id, string $currency, $amount)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'amount' => $amount
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/wallet/withdraw',$params);
        return response()->json($response->json(),$response->status());
    }
    public function add_exchange_request(int $user_id, string $currency_out, string $currency_in, $amount, string $rate_type, $rate)
    {
        $params = [
            'trader' => $user_id,
            'currency_out' => $currency_out,
            'currency_in' => $currency_in,
            'amount' => $amount,
            'rate_type' => $rate_type,
            'rate' => $rate
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/exchange/add',$params);
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
        $signature = strtoupper(hash_hmac('sha256', $postFields, $this->api_secret));
        $auth[$prefix . 'signature'] = $signature;
        return $auth;
    }
}