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
        Route::middleware('CheckSign')->group(function () {
            Route::post('make_order', 'APIController@makeOrder')->middleware('CheckSign');
            Route::post('cancel_order', 'APIController@cancelOrder')->middleware('CheckSign');
            Route::post('withdraw_crypto', 'APIController@withdrawCrypto')->middleware('CheckSign');
        });
    });
});
