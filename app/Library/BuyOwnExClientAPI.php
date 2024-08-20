<?php

namespace App\Library;

use App\Exceptions\ExceptionBuyOwnExAPI;
use App\Models\User;
use Illuminate\Support\Facades\Http;

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

    public function all_fiat_platforms()
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_fiat_platforms');
        return response()->json($response->json(),$response->status());
    }

    public function all_fiat_fees()
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_fiat_fees');
        return response()->json($response->json(),$response->status());
    }

    public function all_banks()
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_banks');
        return response()->json($response->json(),$response->status());
    }

    public function health()
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/health');
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

    public function own_fees(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/own_fees',[
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

    public function activeFiatWithdrawals($user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/active_fiat_withdrawals',[
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
    public function getOffers(string $currency, $market, $amount, int $side, string $type)
    {
        $params = [
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
    public function emailChangeRequest(int $user_id, string $email)
    {
        $params = [
            'trader' => $user_id,
            'email' => $email
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/email_change_request',$params);
        if($response->json()['success'])
        {
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Unknown error'],500);
        }
    }
    public function emailChangeConfirm(int $user_id, string $code_old_email, string $code_new_email)
    {
        $params = [
            'trader' => $user_id,
            'code_old_email' => $code_old_email,
            'code_new_email' => $code_new_email
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/email_change_confirm',$params);
        if($response->json()['success'])
        {
            $user = User::find($user_id);
            $user->email = $response->json()['email'];
            $user->save();
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Unknown error'],500);
        }
    }
    public function getBlockStatus(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/block_status',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function getVerifyStatus(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/verify_status',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function getStatus(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/status',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function getNotificationStatus(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/notification_status',[
            'trader' => $user_id
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function newLoginNotification(int $user_id, string $ip)
    {
        $params = [
            'trader' => $user_id,
            'ip' => $ip
        ];
        Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/notification_login',$params);

    }
    public function setNotificationStatus(int $user_id, int $status)
    {
        $params = [
            'trader' => $user_id,
            'status' => $status
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/notification_status',$params);
        if($response->json()['success'])
        {
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Unknown error'],500);
        }
    }
    public function setNotificationRead(int $user_id, int $notification_id)
    {
        $params = [
            'trader' => $user_id,
            'notification_id' => $notification_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/read_notification',$params);
        if($response->json()['success'])
        {
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Unknown error'],500);
        }
    }
    public function deleteNotification(int $user_id, int $notification_id)
    {
        $params = [
            'trader' => $user_id,
            'notification_id' => $notification_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/delete_notification',$params);
        if($response->json()['success'])
        {
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Unknown error'],500);
        }
    }
    public function setNotificationsReadAll(int $user_id)
    {
        $params = [
            'trader' => $user_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/read_all_notifications',$params);
        if($response->json()['success'])
        {
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Unknown error'],500);
        }
    }
    public function deleteAllNotifications(int $user_id)
    {
        $params = [
            'trader' => $user_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/delete_all_notifications',$params);
        if($response->json()['success'])
        {
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Unknown error'],500);
        }
    }
    public function withdrawCryptoRequest(int $user_id, string $currency, $amount, string $address, int $platform_id, $reason_id)
    {
        if($reason_id !== null)
        {
            $params = [
                'trader' => $user_id,
                'currency' => $currency,
                'amount' => $amount,
                'address' => $address,
                'platform_id' => $platform_id,
                'reason_id' => $reason_id
            ];
            $response = Http::asForm()->withToken($this->api_key)
                ->withHeaders($this->sign($params))
                ->post($this->base.'v1/withdraw_legal_crypto_request',$params);
            if($response->json()['success'])
            {
                return response()->json(['success' => true],$response->status());
            }
            else {
                return response()->json(['success' => false, 'message'=> $response->json()['message'] ? $response->json()['message'] : 'Unknown error'],500);
            }
        }
        else
        {
            $params = [
                'trader' => $user_id,
                'currency' => $currency,
                'amount' => $amount,
                'address' => $address,
                'platform_id' => $platform_id
            ];
            $response = Http::asForm()->withToken($this->api_key)
                ->withHeaders($this->sign($params))
                ->post($this->base.'v1/withdraw_crypto_request',$params);
            if($response->json()['success'])
            {
                return response()->json(['success' => true],$response->status());
            }
            else {
                return response()->json(['success' => false, 'message'=> $response->json()['message'] ? $response->json()['message'] : 'Unknown error'],500);
            }
        }

    }
    public function withdrawCrypto(int $user_id, string $email, string $currency, $amount, string $address)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'amount' => $amount,
            'address' => $address
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/withdraw_crypto_api',$params);
        return response()->json($response->json(),$response->status());
    }
    public function withdrawCryptoConfirm(int $user_id, string $code)
    {
        $params = [
            'trader' => $user_id,
            'code' => $code
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/withdraw_crypto_confirm',$params);
        if($response->json()['success'])
        {
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Confirmation code is not correct'],500);
        }
    }
    public function withdrawFiatConfirm(int $user_id, string $code)
    {
        $params = [
            'trader' => $user_id,
            'code' => $code
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/withdraw_fiat_confirm',$params);
        if($response->json()['success'])
        {
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Confirmation code is not correct'],500);
        }
    }
    public function withdrawCryptoCancel(int $user_id, int $withdraw_id)
    {
        $params = [
            'trader' => $user_id,
            'id' => $withdraw_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/cancel_withdraw_crypto_request',$params);
        if($response->json()['success'])
        {
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Unknown error'],500);
        }
    }
    public function withdrawFiatCancel(int $user_id, int $withdraw_id)
    {
        $params = [
            'trader' => $user_id,
            'id' => $withdraw_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/cancel_withdraw_fiat_request',$params);
        if($response->json()['success'])
        {
            return response()->json(['success' => true],$response->status());
        }
        else {
            return response()->json(['success' => false, 'message'=> 'Unknown error'],500);
        }
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
    public function all_notifications(int $user_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/all_notifications',[
            'trader' => $user_id
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
    public function get_address(int $user_id, string $currency, int $platform_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/get_address',[
            'trader' => $user_id,
            'currency' => $currency,
            'platform_id' => $platform_id
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function validate_address(int $user_id, string $currency, string $address, int $platform_id)
    {
        $params = [
            'trader' => $user_id,
            'currency' => $currency,
            'address' => $address,
            'platform_id' => $platform_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/validate_address',$params);
        return response()->json($response->json(),$response->status());
    }

    public function registerTrader($trader)
    {
        $params = [
            'trader' => $trader->id,
            'name' => $trader->name,
            'email' => $trader->email,
            'ref' => $trader->invite_code,
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/register_trader',$params);
        return response()->json($response->json(),$response->status());
    }

    public function kycKonturIndRequest($trader_id, $fio, $birthday, $passport_number, $inn, $file_ps, $file_ws, $file_ts)
    {
        $params = [
            'trader' => $trader_id,
            'fio' => $fio,
            'birthday' => $birthday,
            'passport_number' => $passport_number,
            'inn' => $inn,
            'file_ps' => $file_ps,
            'file_ws' => $file_ws,
            'file_ts' => $file_ts
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/kyc_kontur_ind_request',$params);
        return response()->json($response->json(),$response->status());
    }

    public function kycKonturCompRequest($trader_id, $inn, $edo_id, $file_doc)
    {
        $params = [
            'trader' => $trader_id,
            'inn' => $inn,
            'edo_id' => $edo_id,
            'file_doc' => $file_doc
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/kyc_kontur_comp_request',$params);
        return response()->json($response->json(),$response->status());
    }

    public function verificationRequest($trader_id, $first_name, $second_name, $surname, $sex, $birthday, $birthday_place, $passport_no, $passport_place, $passport_date, $address, $file_ps, $file_ws, $file_ts)
    {
        $params = [
            'trader' => $trader_id,
            'first_name' => $first_name,
            'second_name' => $second_name,
            'surname' => $surname,
            'sex' => $sex,
            'birthday' => $birthday,
            'birthday_place' => $birthday_place,
            'passport_no' => $passport_no,
            'passport_place' => $passport_place,
            'passport_date' => $passport_date,
            'address' => $address,
            'file_ps' => $file_ps,
            'file_ws' => $file_ws,
            'file_ts' => $file_ts,
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/verification_request',$params);
        return response()->json($response->json(),$response->status());
    }

    public function verificationPayment($trader_id)
    {
        $params = [
            'trader' => $trader_id
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/verification_payment',$params);
        return response()->json($response->json(),$response->status());
    }

    public function notifyFiatQRReplenish($trader_id, $currency, $bank_id, $amount, $gateway_id)
    {
        $params = [
            'trader' => $trader_id,
            'currency' => $currency,
            'bank_id' => $bank_id,
            'amount' => $amount,
            'gateway_id' => $gateway_id,
            'kyc_driver' => config('app.kyc_driver')
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/notify_fiat_qr_replenish',$params);
        return response()->json($response->json(),$response->status());
    }

    public function notifyFiatInvoiceReplenish($trader_id, $currency, $amount, $bank_id, $inn, $bic, $acc, $gateway_id)
    {
        $params = [
            'trader' => $trader_id,
            'currency' => $currency,
            'amount' => $amount,
            'bank_id' => $bank_id,
            'inn' => $inn,
            'bic' => $bic,
            'acc' => $acc,
            'gateway_id' => $gateway_id,
            'kyc_driver' => config('app.kyc_driver')
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/notify_fiat_invoice_replenish',$params);
        return response()->json($response->json(),$response->status());
    }

    public function notifyFiatInvoiceWithdraw($trader_id, $currency, $amount, $inn, $bic, $acc, $gateway_id)
    {
        $params = [
            'trader' => $trader_id,
            'currency' => $currency,
            'amount' => $amount,
            'inn' => $inn,
            'bic' => $bic,
            'acc' => $acc,
            'gateway_id' => $gateway_id,
            'kyc_driver' => config('app.kyc_driver')
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/notify_fiat_invoice_withdraw',$params);
        return response()->json($response->json(),$response->status());
    }

    public function getKYCKonturData($trader_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/kyc_kontur_data',[
            'trader' => $trader_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function getVerification($trader_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/verification_request',[
            'trader' => $trader_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function getVerificationBankDetails($trader_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/get_verification_bank_details',[
            'trader' => $trader_id
        ]);
        return response()->json($response->json(),$response->status());
    }
    public function getReplenishBankDetails($trader_id)
    {
        $response = Http::withToken($this->api_key)->get($this->base.'v1/get_replenish_bank_details',[
            'trader' => $trader_id
        ]);
        return response()->json($response->json(),$response->status());
    }

    public function checkTraderName($name)
    {
        $params = [
            'name' => $name
        ];
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params))
            ->post($this->base.'v1/check_trader_name',$params);
        return response()->json($response->json(),$response->status());
    }
}
