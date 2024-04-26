<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('mobile')->middleware(['check_mobile_sign'])->group(function () {
    Route::post('register', 'MobileController@register_trader');
    Route::post('verify', 'MobileController@verify_trader');
    Route::post('resend_verify_email', 'MobileController@resend_verify_email');
    Route::post('reset_password_request', 'MobileController@reset_password_request');
    Route::post('reset_password_confirm', 'MobileController@reset_password_confirm');
    Route::post('get_token', 'MobileController@get_trader_token');

    Route::get('tickers', 'APIController@getTicker');
    Route::get('trades', 'APIController@getLastDeals');
    Route::get('market', 'APIController@getMarket');
    Route::get('crypto_currencies', 'APIController@getCryptoCurrencies');
    Route::get('fiat_currencies', 'APIController@getFiatCurrencies');
    Route::get('all_currencies', 'APIController@getAllCurrencies');
    Route::get('depth', 'APIController@getDepth');
    Route::get('graph', 'APIController@getChart');
    Route::get('all_fiat_platforms', 'APIController@getAllFiatPlatforms');
    Route::get('all_fiat_fees', 'APIController@getAllFiatFees');
    Route::get('health', 'APIController@getHealth');

    Route::middleware(['auth:sanctum','throttle:rate_limit,1'])->group(function () {
        Route::get('user', function (Request $request) {
            return $request->user();
        });
        Route::get('balance', 'APIController@getBalance');
        Route::get('fees', 'APIController@getOwnFees');
        Route::get('all_deals', 'APIController@getDeals');
        Route::get('active_orders', 'APIController@getOrders');
        Route::get('active_crypto_withdrawals', 'APIController@getActiveWithdrawals');
        Route::get('active_fiat_withdrawals', 'APIController@getActiveFiatWithdrawals');
        Route::get('status', 'APIController@getStatus');
        Route::get('block_status', 'APIController@getBlockStatus');
        Route::get('verify_status', 'APIController@getVerifyStatus');
        Route::get('notification_status', 'APIController@getNotificationStatus');
        Route::get('all_notifications', 'APIController@getAllNotifications');
        Route::get('get_address', 'APIController@getAddress');
        Route::get('api_keys', 'APIController@getAPITokens');


        Route::get('deals', 'APIController@getOwnDeals');
        Route::get('orders', 'APIController@getOwnOrders');
        Route::get('transactions', 'APIController@getTransactions');
        Route::get('fiat_transactions', 'APIController@getFiatTransactions');
        Route::get('transfers', 'APIController@getTransfers');
        Route::get('ref_payments', 'APIController@getRefPayments');
        Route::middleware(['check_api_signature','check_block_status'])->group(function () {
            Route::post('enable_2fa', 'Google2FAController@enableTwoFactorReady')->middleware('throttle:5');
            Route::post('disable_2fa', 'Google2FAController@disableTwoFactorReady')->middleware('throttle:5');
            Route::post('generate_2fa', 'Google2FAController@generateTwoFactor');
            Route::post('make_order', 'APIController@makeOrder');
            Route::post('cancel_order', 'APIController@cancelOrder');
            Route::post('withdraw_crypto', 'APIController@withdrawCrypto');
        });
    });
});

Route::prefix('v1')->middleware(['throttle:60,1'])->group(function () {
    Route::get('tickers', 'APIController@getTicker');
    Route::get('trades', 'APIController@getLastDeals');
    Route::get('market', 'APIController@getMarket');
    Route::get('crypto_currencies', 'APIController@getCryptoCurrencies');
    Route::get('fiat_currencies', 'APIController@getFiatCurrencies');
    Route::get('all_currencies', 'APIController@getAllCurrencies');
    Route::get('depth', 'APIController@getDepth');

    Route::middleware(['auth:sanctum','throttle:rate_limit,1'])->group(function () {
        Route::get('user', function (Request $request) {
            return $request->user();
        });
        Route::get('deals', 'APIController@getOwnDeals');
        Route::get('orders', 'APIController@getOwnOrders');
        Route::get('balance', 'APIController@getBalance');
        Route::get('transactions', 'APIController@getTransactions');
        Route::get('fiat_transactions', 'APIController@getFiatTransactions');
        Route::get('transfers', 'APIController@getTransfers');
        Route::middleware(['check_api_signature','check_block_status'])->group(function () {
            Route::post('make_order', 'APIController@makeOrder');
            Route::post('cancel_order', 'APIController@cancelOrder');
            Route::post('withdraw_crypto', 'APIController@withdrawCrypto');
        });
    });
});
