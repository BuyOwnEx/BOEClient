<?php

namespace App\Http\Controllers;

use App\Library\APIToken;
use App\Library\BuyOwnExClientAPI;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;

class APIController extends Controller
{
    public function getTicker(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->tickers();
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getLastDeals(Request $request)
    {
        $request->validate([
            'currency' => 'required|alpha_num|min:3|max:10',
            'market' => 'required|alpha_num|min:3|max:10',
        ], [
            'currency.required' => 'Параметр currency обязателен',
            'currency.alpha_num' => 'Код базовой валюты должен содержать только буквы и цифры',
            'currency.min' => 'Код базовой валюты должен содержать минимум 3 символа',
            'currency.max' => 'Код базовой валюты не может содержать более 10 символов',

            'market.required' => 'Параметр market обязателен',
            'market.alpha_num' => 'Код котируемой валюты должен содержать только буквы и цифры',
            'market.min' => 'Код котируемой валюты должен содержать минимум 3 символа',
            'market.max' => 'Код котируемой валюты не может содержать более 10 символов',
        ]);

        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->history_deals($request->currency, $request->market);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getMarket(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->market_data();
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getCryptoCurrencies(Request $request)
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
    public function getFiatCurrencies(Request $request)
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
    public function getAllCurrencies(Request $request)
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
    public function getDepth(Request $request)
    {
        $request->validate([
            'currency' => 'required|alpha_num|min:3|max:10',
            'market' => 'required|alpha_num|min:3|max:10',
        ], [
            'currency.required' => 'Параметр currency обязателен',
            'currency.alpha_num' => 'Код базовой валюты должен содержать только буквы и цифры',
            'currency.min' => 'Код базовой валюты должен содержать минимум 3 символа',
            'currency.max' => 'Код базовой валюты не может содержать более 10 символов',

            'market.required' => 'Параметр market обязателен',
            'market.alpha_num' => 'Код котируемой валюты должен содержать только буквы и цифры',
            'market.min' => 'Код котируемой валюты должен содержать минимум 3 символа',
            'market.max' => 'Код котируемой валюты не может содержать более 10 символов',
        ]);

        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->depth($request->currency, $request->market);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }

    public function getOwnDeals(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_deals($request->user()->id, $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, false, false, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getOwnOrders(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_orders($request->user()->id, $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, false, false, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getBalance(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->balances($request->user()->id);
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
    public function getAllFiatPlatforms()
    {
        try {
            return Cache::remember('all_fiat_platforms', 60, function (){
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->all_fiat_platforms();
            });
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllFiatFees()
    {
        try {
            return Cache::remember('all_fiat_fees', 60, function (){
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->all_fiat_fees();
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
    public function getOrders(Request $request)
    {
        $request->validate([
            'page' => 'required|integer|min:1',
            'itemsPerPage' => 'required|integer|in:30,50,100,500',
            'filters.start' => 'nullable|date_format:Y-m-d H:i:s',
            'filters.end' => 'nullable|date_format:Y-m-d H:i:s|after_or_equal:filters.start',
            'filters.id' => 'nullable|integer|gt:0',
            'filters.pair' => 'nullable|integer|gt:0',
            'filters.side' => 'nullable|in:true,false',
            'filters.type' => 'nullable|in:LIMIT,MARKET,STOPLOSS,TAKEPROFIT,TRAILINGSTOP',
            'filters.status' => 'nullable|in:filled,partiallyFilled,accepted,cancelled',
        ], [
            'page.required' => 'Параметр page обязателен',
            'page.integer' => 'Параметр page должен быть целым числом',
            'page.min' => 'Номер страницы должен быть не меньше 1',

            'itemsPerPage.required' => 'Параметр itemsPerPage обязателен',
            'itemsPerPage.integer' => 'Параметр itemsPerPage должен быть целым числом',
            'itemsPerPage.in' => 'Количество записей на странице должно быть одно из: 30, 50, 100, 500',

            'filters.start.date_format' => 'Неверный формат даты для filters[start]. Ожидаемый формат: ГГГГ‑ММ‑ДД ЧЧ:ММ:СС',
            'filters.end.date_format' => 'Неверный формат даты для filters[end]. Ожидаемый формат: ГГГГ‑ММ‑ДД ЧЧ:ММ:СС',
            'filters.end.after_or_equal' => 'Дата окончания должна быть позже или равна дате начала',

            'filters.id.integer' => 'ID ордера должен быть целым числом',
            'filters.id.gt' => 'ID ордера должен быть больше 0',

            'filters.pair.integer' => 'ID торговой пары должен быть целым числом',
            'filters.pair.gt' => 'ID торговой пары должен быть больше 0',

            'filters.side.in' => 'Значение filters[side] должно быть одно из (true/false)',

            'filters.type.in' => 'Недопустимый тип ордера. Допустимые значения: LIMIT, MARKET, STOPLOSS, TAKEPROFIT, TRAILINGSTOP',

            'filters.status.in' => 'Недопустимый статус ордера. Допустимые значения: filled, partiallyFilled, accepted, cancelled',
        ]);
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->orders($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getDeals(Request $request)
    {
        $request->validate([
            'page' => 'required|integer|min:1',
            'itemsPerPage' => 'required|integer|in:30,50,100,500',
            'filters.start' => 'nullable|date_format:Y-m-d H:i:s',
            'filters.end' => 'nullable|date_format:Y-m-d H:i:s|after_or_equal:filters.start',
            'filters.id' => 'nullable|integer|gt:0',
            'filters.pair' => 'nullable|integer|gt:0',
            'filters.side' => 'nullable|in:true,false',
        ], [
            'page.required' => 'Параметр page обязателен',
            'page.integer' => 'Параметр page должен быть целым числом',
            'page.min' => 'Номер страницы должен быть не меньше 1',

            'itemsPerPage.required' => 'Параметр itemsPerPage обязателен',
            'itemsPerPage.integer' => 'Параметр itemsPerPage должен быть целым числом',
            'itemsPerPage.in' => 'Количество записей на странице должно быть одно из: 30,50,100,500',

            'filters.start.date_format' => 'Неверный формат даты для filters[start]. Ожидаемый формат: ГГГГ‑ММ‑ДД ЧЧ:ММ:СС',
            'filters.end.date_format' => 'Неверный формат даты для filters[end]. Ожидаемый формат: ГГГГ‑ММ‑ДД ЧЧ:ММ:СС',
            'filters.end.after_or_equal' => 'Дата окончания должна быть позже или равна дате начала',

            'filters.id.integer' => 'ID сделки должен быть целым числом',
            'filters.id.gt' => 'ID сделки должен быть больше 0',

            'filters.pair.integer' => 'ID торговой пары должен быть целым числом',
            'filters.pair.gt' => 'ID торговой пары должен быть больше 0',

            'filters.side.in' => 'Значение filters[side] должно быть одно из (true/false)',
        ]);

        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->deals($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getOwnFees(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->own_fees($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getActiveWithdrawals(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->activeWithdrawals($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getActiveFiatWithdrawals(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->activeFiatWithdrawals($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getStatus(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->getStatus($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getBlockStatus(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->getBlockStatus($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getVerifyStatus(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->getVerifyStatus($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getNotificationStatus(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->getNotificationStatus($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getTransactions(Request $request)
    {
        $request->validate([
            'page' => 'required|integer|min:1',
            'itemsPerPage' => 'required|integer|in:30,50,100,500',
            'filters.start' => 'nullable|date_format:Y-m-d H:i:s',
            'filters.end' => 'nullable|date_format:Y-m-d H:i:s|after_or_equal:filters.start',
            'filters.id' => 'nullable|integer|gt:0',
            'filters.txid' => 'nullable|string|max:255',
            'filters.address' => 'nullable|string|max:255',
            'filters.currency' => 'nullable|alpha_num|min:3|max:10',
            'filters.type' => 'nullable|in:true,false',
            'filters.status' => 'nullable|in:done,wait,accepted,blocked,aml_refunded',
        ], [
            'page.required' => 'Параметр page обязателен',
            'page.integer' => 'Параметр page должен быть целым числом',
            'page.min' => 'Номер страницы должен быть не меньше 1',

            'itemsPerPage.required' => 'Параметр itemsPerPage обязателен',
            'itemsPerPage.integer' => 'Параметр itemsPerPage должен быть целым числом',
            'itemsPerPage.in' => 'Количество записей на странице должно быть одно из: 30, 50, 100, 500',

            'filters.start.date_format' => 'Неверный формат даты для filters[start]. Ожидаемый формат: ГГГГ‑ММ‑ДД ЧЧ:ММ:СС',
            'filters.end.date_format' => 'Неверный формат даты для filters[end]. Ожидаемый формат: ГГГГ‑ММ‑ДД ЧЧ:ММ:СС',
            'filters.end.after_or_equal' => 'Дата окончания должна быть позже или равна дате начала',

            'filters.id.integer' => 'ID транзакции должен быть целым числом',
            'filters.id.gt' => 'ID транзакции должен быть больше 0',

            'filters.txid.string' => 'TXID должен быть строкой',
            'filters.txid.max' => 'Длина TXID не может превышать 255 символов',

            'filters.address.string' => 'Адрес должен быть строкой',
            'filters.address.max' => 'Длина адреса не может превышать 255 символов',

            'filters.currency.alpha_num' => 'Код валюты должен содержать только буквы и цифры',
            'filters.currency.min' => 'Код валюты должен содержать минимум 3 символа',
            'filters.currency.max' => 'Код валюты не может содержать более 10 символов',

            'filters.type.in' => 'Недопустимый тип транзакции. Допустимые значения: (true/false)',

            'filters.status.in' => 'Недопустимый статус транзакции. Допустимые значения: done, wait, accepted, blocked, aml_refunded',
        ]);
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_transactions($request->user()->id, $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, false, false, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getFiatTransactions(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_fiat_transactions($request->user()->id, $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, false, false, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getTransfers(Request $request)
    {
        $request->validate([
            'page' => 'required|integer|min:1',
            'itemsPerPage' => 'required|integer|in:30,50,100,500',
            'filters.start' => 'nullable|date_format:Y-m-d H:i:s',
            'filters.end' => 'nullable|date_format:Y-m-d H:i:s|after_or_equal:filters.start',
            'filters.id' => 'nullable|integer|gt:0',
            'filters.currency' => 'nullable|alpha_num|min:3|max:10',
            'filters.type' => 'nullable|in:transfer,otc_transfer',
            'filters.side' => 'nullable|in:true,false',
        ], [
            'page.required' => 'Параметр page обязателен',
            'page.integer' => 'Параметр page должен быть целым числом',
            'page.min' => 'Номер страницы должен быть не меньше 1',

            'itemsPerPage.required' => 'Параметр itemsPerPage обязателен',
            'itemsPerPage.integer' => 'Параметр itemsPerPage должен быть целым числом',
            'itemsPerPage.in' => 'Количество записей на странице должно быть одно из: 30,50,100,500',

            'filters.start.date_format' => 'Неверный формат даты для filters[start]. Ожидаемый формат: ГГГГ‑ММ‑ДД ЧЧ:ММ:СС',
            'filters.end.date_format' => 'Неверный формат даты для filters[end]. Ожидаемый формат: ГГГГ‑ММ‑ДД ЧЧ:ММ:СС',
            'filters.end.after_or_equal' => 'Дата окончания должна быть позже или равна дате начала',

            'filters.id.integer' => 'ID перевода должен быть целым числом',
            'filters.id.gt' => 'ID перевода должен быть больше 0',

            'filters.currency.alpha_num' => 'Код валюты должен содержать только буквы и цифры',
            'filters.currency.min' => 'Код валюты должен содержать минимум 1 символ',
            'filters.currency.max' => 'Код валюты не может содержать более 10 символов',

            'filters.type.in' => 'Недопустимый тип перевода. Допустимые значения: transfer, otc_transfer',

            'filters.side.in' => 'Значение filters[side] должно быть одно из (true/false)',
        ]);
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_transfers($request->user()->id, $request->page, $request->itemsPerPage, null, null, false, false, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getRefPayments(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_ref_payments($request->user()->id, $request->page, $request->itemsPerPage, $request->sortBy, $request->sortDesc, $request->mustSort, $request->multiSort, $request->filters);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAllNotifications(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->all_notifications($request->user()->id);
        } catch (\Exception $e) {
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
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getAddress(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->get_address($request->user()->id, $request->currency, $request->platform_id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function makeOrder(Request $request)
    {
        $request->validate([
            'type' => 'required|alpha|in:LIMIT,MARKET',
            'currency' => 'required|alpha_num|min:3|max:10',
            'market' => 'required|alpha_num|min:3|max:10',
            'side' => 'required|integer|in:0,1',
            'amount' => 'required|numeric|gt:0',
            'rate' => 'required_if:type,LIMIT|nullable|numeric|gt:0',
            'base' => 'required_if:type,MARKET|nullable|integer|in:0,1',
            'sl_rate' => 'nullable|numeric|gt:0',
            'tp_rate' => 'nullable|numeric|gt:0',
            'ts_offset' => 'nullable|numeric|gt:0',
            'margin' => 'nullable|integer|in:0,1',
            'offer' => 'required_if:margin,1|nullable|integer|gte:0',
        ], [
            'type.required' => 'Параметр type обязателен',
            'type.alpha' => 'Тип ордера должен содержать только буквы',
            'type.in' => 'Недопустимый тип ордера. Допустимые значения: LIMIT, MARKET',

            'currency.required' => 'Параметр currency обязателен',
            'currency.alpha_num' => 'Код базовой валюты должен содержать только буквы и цифры',
            'currency.min' => 'Код базовой валюты должен содержать минимум 3 символа',
            'currency.max' => 'Код базовой валюты не может содержать более 10 символов',

            'market.required' => 'Параметр market обязателен',
            'market.alpha_num' => 'Код котируемой валюты должен содержать только буквы и цифры',
            'market.min' => 'Код котируемой валюты должен содержать минимум 3 символа',
            'market.max' => 'Код котируемой валюты не может содержать более 10 символов',

            'side.required' => 'Параметр side обязателен',
            'side.integer' => 'Направленность ордера должно быть целым числом',
            'side.in' => 'Направленность ордера может быть только 0 (покупка) или 1 (продажа)',

            'amount.required' => 'Параметр amount обязателен',
            'amount.numeric' => 'Количество должно быть числом',
            'amount.gt' => 'Количество должно быть больше 0',

            'rate.required_if' => 'Параметр rate обязателен для LIMIT‑ордеров',
            'rate.numeric' => 'Цена должна быть числом',
            'rate.gt' => 'Цена должна быть больше 0',

            'base.required_if' => 'Параметр base обязателен для MARKET‑ордеров',
            'base.integer' => 'Базовый параметр должен быть целым числом',
            'base.in' => 'Base может быть только 0 или 1',

            'sl_rate.numeric' => 'Уровень stop‑loss должен быть числом',
            'sl_rate.gt' => 'Уровень stop‑loss должен быть больше 0',

            'tp_rate.numeric' => 'Уровень take‑profit должен быть числом',
            'tp_rate.gt' => 'Уровень take‑profit должен быть больше 0',

            'ts_offset.numeric' => 'Смещение trailing stop должно быть числом',
            'ts_offset.gt' => 'Смещение trailing stop должно быть больше 0',

            'margin.integer' => 'Маржинальная торговля должна быть целым числом',
            'margin.in' => 'Margin может быть только 0 или 1',

            'offer.required_if' => 'Параметр offer обязателен при включённой маржинальной торговле (margin=1)',
            'offer.integer' => 'ID предложения должен быть целым числом',
            'offer.gte' => 'ID предложения должно быть неотрицательным числом',
        ]);

        try {
            if ($request->user()->tokenCan('trading')) {
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->makeOrder(
                    $request->user()->id,
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
            }
            else {
                return ['success'=>false, 'message'=>'Permission denied'];
            }
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function cancelOrder(Request $request)
    {
        $request->validate([
            'order' => 'required|integer|gt:0',
        ], [
            'order.required' => 'Параметр order обязателен',
            'order.integer' => 'ID ордера должен быть целым числом',
            'order.gt' => 'ID ордера должен быть больше 0',
        ]);

        try {
            if ($request->user()->tokenCan('trading')) {
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->cancelOrder(
                    $request->user()->id,
                    $request->order
                );
            }
            else {
                return ['success'=>false, 'message'=>'Permission denied'];
            }

        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getOrderInfo(Request $request)
    {
        $request->validate([
            'order' => 'required|integer|gt:0',
        ], [
            'order.required' => 'Параметр order обязателен',
            'order.integer' => 'ID ордера должен быть целым числом',
            'order.gt' => 'ID ордера должен быть больше 0',
        ]);

        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->orderInfo($request->user()->id,
                $request->order);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function withdrawCrypto(Request $request)
    {
        try {
            if ($request->user()->tokenCan('withdraw')) {
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->withdrawCrypto(
                    $request->user()->id,
                    $request->user()->email,
                    $request->currency,
                    $request->amount,
                    $request->address,
                    $request->platform_id
                );
            }
            else {
                return response()->json([
                    'success' => false,
                    'message' => 'Permission denied'
                ], 403);
            }

        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
}
