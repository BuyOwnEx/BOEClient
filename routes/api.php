<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//Route::post('v1/make_order', 'APIController@makeOrder');
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('v1/make_order', function (Request $request) {
    echo $request;
});

Route::prefix('v1')->group(function () {
    Route::get('tickers', 'APIController@getTicker');
    Route::get('trades', 'APIController@getLastDeals');
    Route::get('market', 'APIController@getMarket');
    Route::get('crypto_currencies', 'APIController@getCryptoCurrencies');
    Route::get('fiat_currencies', 'APIController@getFiatCurrencies');
    Route::get('all_currencies', 'APIController@getAllCurrencies');
    Route::get('depth', 'APIController@getDepth');

    // Start CoinMarketCap API
    Route::get('summary', 'APIController@getSummary');
    Route::get('assets', 'APIController@getAssets');
    Route::get('ticker', 'APIController@getTickers');
    Route::get('orderbook/{pair}', 'APIController@getOrderBook'); // optional: depth (0,5,10,20,50,100,500) , level (1 - Only the best bid and ask, 2 - Arranged by best bids and asks), 3 - Complete order book, no aggregation
    Route::get('trades/{pair}', 'APIController@getTrades'); // optional : side
    // End CoinMarketCap API

    Route::middleware(['auth:sanctum','throttle:rate_limit,1'])->group(function () {
        Route::get('deals', 'APIController@getOwnDeals');
        Route::get('orders', 'APIController@getOwnOrders');
        Route::get('balance', 'APIController@getBalance');
        Route::get('transactions', 'APIController@getTransactions');
        Route::get('fiat_transactions', 'APIController@getFiatTransactions');
        Route::get('transfers', 'APIController@getTransfers');
        Route::get('fee', 'APIController@getFeeInfo');
        Route::middleware('CheckSign')->group(function () {
            Route::post('v1/make_order', 'APIController@cancelOrder')->middleware('CheckSign');
            Route::post('cancel_order', 'APIController@cancelOrder')->middleware('CheckSign');
        });
    });
});


