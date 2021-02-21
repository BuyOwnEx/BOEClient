<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('trading/'.env('DEFAULT_MARKET', 'USDT').'/'.env('DEFAULT_CURRENCY', 'BTC'));
});
Auth::routes(['verify' => true]);
Route::get('trading/{market}/{currency}', 'TraderController@getTradingView')->name('trading_view');
Route::get('balance', 'TraderController@getBalanceView')->name('balance_view');
Route::get('overview', 'TraderController@getOverviewView')->name('overview_view');
Route::get('transactions', 'TraderController@getTransactionsView')->name('transactions_view');
Route::get('fiat_transactions', 'TraderController@getFiatTransactionsView')->name('fiat_transactions_view');
Route::get('transfers', 'TraderController@getTransfersView')->name('transfers_view');
Route::get('orders', 'TraderController@getOrdersView')->name('orders_view');
Route::get('deals', 'TraderController@getDealsView')->name('deals_view');
Route::get('ref_payments', 'TraderController@getRefPaymentsView')->name('referrals_view');
Route::get('support', 'TraderController@getSupportView')->name('support_view');
Route::get('settings', 'TraderController@getSettingsView')->name('settings_view');
Route::get('notifications', 'TraderController@getNotificationsView')->name('notifications_view');

Route::group(['prefix' => 'trader'], function () {
    Route::group(['prefix' => 'ext'], function () {
        Route::get('token', 'JWTController@getOwnToken')->name('token');
        Route::post('private', 'JWTController@getPrivateToken')->name('private');
        Route::post('refresh', 'JWTController@refreshOwnToken')->name('refresh');


        Route::get('tickers', 'TraderController@getTickers')->name('tickers');
        Route::get('market_data', 'TraderController@getMarketData')->name('market_data');
        Route::get('depth', 'TraderController@getDepth')->name('depth');
        Route::get('history/deals', 'TraderController@HistoryDealList')->name('history_deal_list');
        Route::get('graph', 'TraderController@getChart')->name('chart');

        Route::get('crypto_currencies', 'TraderController@getCryptoCurrencies')->name('crypto_currencies');
        Route::get('fiat_currencies', 'TraderController@getFiatCurrencies')->name('fiat_currencies');
        Route::get('all_currencies', 'TraderController@getAllCurrencies')->name('all_currencies');

        Route::get('balances', 'TraderController@getBalances')->name('balances');
        Route::get('orders', 'TraderController@getOrders')->name('orders');
        Route::get('deals', 'TraderController@getDeals')->name('deals');
        Route::get('positions', 'TraderController@getPositions')->name('positions');

        Route::post('order/limit', 'TraderController@makeOrder')->name('limit_order');
        Route::post('order/market', 'TraderController@makeOrder')->name('market_order');
        Route::post('order/cancel', 'TraderController@cancelOrder')->name('cancel_order');
        Route::post('order/cancel_all', 'TraderController@cancelAllOrders')->name('cancel_all_orders');
        Route::post('order/cancel_all_sl', 'TraderController@cancelAllSLOrders')->name('cancel_all_sl_orders');
        Route::post('order/cancel_all_tp', 'TraderController@cancelAllTPOrders')->name('cancel_all_tp_orders');
        Route::post('order/cancel_all_ts', 'TraderController@cancelAllTSOrders')->name('cancel_all_ts_orders');

        Route::get('get_offer_list', 'TraderController@getOfferList')->name('offer_list');
        Route::post('position/close', 'TraderController@closePosition')->name('close_position');
        Route::post('position/close_all', 'TraderController@closeAllPositions')->name('close_all_positions');
        Route::post('position/close_all_long', 'TraderController@closeAllLongPositions')->name('close_all_long_positions');
        Route::post('position/close_all_short', 'TraderController@closeAllShortPositions')->name('close_all_short_positions');
        Route::post('position/deposit', 'TraderController@depositPosition')->name('deposit_position');

        Route::get('balance/all-withdrawals', 'TraderController@getWithdrawalList')->name('withdrawal_list');
        Route::post('transfer/trade', 'TraderController@transferToTradeWallet')->name('transfer_to_trade');
        Route::post('transfer/safe', 'TraderController@transferToSafeWallet')->name('transfer_to_safe');

        Route::get('all_orders', 'TraderController@getAllOrders')->name('all_orders');
        Route::get('all_deals', 'TraderController@getAllDeals')->name('all_deals');
        Route::get('all_transactions', 'TraderController@getAllTransactions')->name('all_transactions');
        Route::get('all_fiat_transactions', 'TraderController@getAllFiatTransactions')->name('all_fiat_transactions');
        Route::get('all_transfers', 'TraderController@getAllTransfers')->name('all_transfers');
        Route::get('all_ref_payments', 'TraderController@getAllRefPayments')->name('all_ref_payments');
        Route::get('all_followers', 'TraderController@getAllFollowers')->name('all_followers');


        Route::get('all_referral_types', 'TraderController@getAllReferralTypes')->name('all_referral_types');
        Route::post('set_referral_type', 'TraderController@setReferralType')->name('set_referral_type');

    });
});

//Route::get('/', 'SpaController@index')->where('any', '.*');
