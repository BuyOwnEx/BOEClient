<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Auth::routes(['verify' => true]);

Route::get('/', function () {
    return redirect('trading/'.env('VITE_DEFAULT_MARKET', 'USDT').'/'.env('VITE_DEFAULT_CURRENCY', 'BTC'));
});

Route::get('trading/{market}/{currency}', 'TraderController@getTradingView')->name('trading_view');
Route::get('overview', 'TraderController@getOverviewView')->name('overview_view');
Route::get('policy', 'TraderController@getPolicyView')->name('policy_view');
Route::get('terms', 'TraderController@getTermsView')->name('terms_view');
Route::get('api', 'TraderController@getApiView')->name('api_view');
Route::get('fees', 'TraderController@getFeesView')->name('fees_view');
Route::get('status', 'TraderController@getStatusView')->name('status_view');
Route::get('contacts', 'TraderController@getContactsView')->name('contacts_view');
Route::get('2fa', 'Auth\LoginController@getValidateToken');
Route::get('captcha', 'Auth\LoginController@getCaptchaConfig');
Route::post('2fa_validate', ['middleware' => 'throttle:5', 'uses' => 'Auth\LoginController@postValidateToken']);
Route::get('forget_2fa','Google2FAController@forgetTwoFactor');
Route::post('set_locale', 'TraderController@setLocale');

Route::middleware('auth')->group(function () {
    Route::get('balance', 'TraderController@getBalanceView')->name('balance_view');
    Route::get('transactions', 'TraderController@getTransactionsView')->name('transactions_view');
    Route::get('fiat_transactions', 'TraderController@getFiatTransactionsView')->name('fiat_transactions_view');
    Route::get('transfers', 'TraderController@getTransfersView')->name('transfers_view');
    Route::get('orders', 'TraderController@getOrdersView')->name('orders_view');
    Route::get('deals', 'TraderController@getDealsView')->name('deals_view');
    Route::get('ref_payments', 'TraderController@getRefPaymentsView')->name('referrals_view');
    Route::get('support', 'TraderController@getSupportView')->name('support_view');
    Route::get('profile', 'TraderController@getProfileView')->name('profile_view');
    Route::get('notifications', 'TraderController@getNotificationsView')->name('notifications_view');
    Route::get('get_verification_settings', 'TraderController@getVerificationSettings')->name('get_verification_settings');
});

Route::group(['prefix' => 'trader'], function () {
    Route::post('2fa_enable', ['middleware' => ['throttle:5','check_block_status'], 'uses' => 'Google2FAController@enableTwoFactorReady']);
    Route::post('2fa_disable', ['middleware' => ['throttle:5','check_block_status'], 'uses' => 'Google2FAController@disableTwoFactorReady']);
    Route::get('2fa_generate', 'Google2FAController@generateTwoFactor');

    Route::get('tickets', 'TicketController@getAllTickets');
    Route::get('ticket/comments', 'TicketController@getAllTicketComments');
    Route::get('ticket/priorities', 'TicketController@getPriorities');
    Route::get('ticket/statuses', 'TicketController@getStatuses');
    Route::get('ticket/tags', 'TicketController@getTags');
    Route::post('ticket/create', 'TicketController@createTicket')->middleware('check_block_status');
    Route::post('ticket/comment/add', 'TicketController@addComment')->middleware('check_block_status');
    Route::post('ticket/close', 'TicketController@closeTicket')->middleware('check_block_status');

    Route::group(['prefix' => 'ext'], function () {
        Route::get('tickers', 'TraderController@getTickers')->name('tickers');
        Route::get('market_data', 'TraderController@getMarketData')->name('market_data');
        Route::get('depth', 'TraderController@getDepth')->name('depth');
        Route::get('history/deals', 'TraderController@HistoryDealList')->name('history_deal_list');
        Route::get('graph', 'TraderController@getChart')->name('chart');
        Route::get('crypto_currencies', 'TraderController@getCryptoCurrencies')->name('crypto_currencies');
        Route::get('fiat_currencies', 'TraderController@getFiatCurrencies')->name('fiat_currencies');
        Route::get('all_currencies', 'TraderController@getAllCurrencies')->name('all_currencies');
        Route::get('all_fiat_platforms', 'TraderController@getAllFiatPlatforms')->name('all_fiat_platforms');
        Route::get('all_fiat_fees', 'TraderController@getAllFiatFees')->name('all_fiat_fees');
        Route::get('all_banks', 'TraderController@getAllBanks')->name('all_banks');
        Route::get('all_countries', 'TraderController@getAllCountries')->name('all_countries');
        Route::get('health', 'TraderController@getHealth')->name('health');
        Route::get('get_offer_list', 'TraderController@getOfferList')->name('offer_list');

        Route::middleware('auth')->group(function () {
            Route::get('token', 'JWTController@getOwnToken')->name('token');
            Route::post('private', 'JWTController@getPrivateToken')->name('private');
            Route::post('refresh', 'JWTController@refreshOwnToken')->name('refresh');

            Route::get('balances', 'TraderController@getBalances')->name('balances');
            Route::get('orders', 'TraderController@getOrders')->name('orders');
            Route::get('deals', 'TraderController@getDeals')->name('deals');
            Route::get('fees', 'TraderController@getOwnFees')->name('own_fees');
            Route::get('positions', 'TraderController@getPositions')->name('positions');

            Route::get('balance/all-withdrawals', 'TraderController@getWithdrawalList')->name('withdrawal_list');
            Route::get('balance/all-fiat-withdrawals', 'TraderController@getFiatWithdrawalList')->name('fiat_withdrawal_list');
            Route::get('block/status', 'TraderController@getBlockStatus')->name('get_block_status');
            Route::get('verify/status', 'TraderController@getVerifyStatus')->name('get_verify_status');
            Route::get('doc_requests/status', 'TraderController@getDocRequestsStatus')->name('get_doc_requests_status');
            Route::get('status', 'TraderController@getStatus')->name('get_status');
            Route::get('notification/status', 'TraderController@getNotificationStatus')->name('get_notification_status');
            Route::get('all_orders', 'TraderController@getAllOrders')->name('all_orders');
            Route::get('all_deals', 'TraderController@getAllDeals')->name('all_deals');
            Route::get('all_transactions', 'TraderController@getAllTransactions')->name('all_transactions');
            Route::get('all_fiat_transactions', 'TraderController@getAllFiatTransactions')->name('all_fiat_transactions');
            Route::get('all_transfers', 'TraderController@getAllTransfers')->name('all_transfers');
            Route::get('all_ref_payments', 'TraderController@getAllRefPayments')->name('all_ref_payments');
            Route::get('all_followers', 'TraderController@getAllFollowers')->name('all_followers');
            Route::get('all_notifications', 'TraderController@getAllNotifications')->name('all_notifications');

            Route::get('all_referral_types', 'TraderController@getAllReferralTypes')->name('all_referral_types');
            Route::get('get_address', 'TraderController@getAddress')->name('get_address');
            Route::get('get_verification_status', 'TraderController@getVerificationStatus')->name('get_verification_status');
            Route::get('kyc_sumsub_token', 'TraderController@getKYCSumSubToken')->name('kyc_sumsub_token');
            Route::get('kyb_sumsub_token', 'TraderController@getKYBSumSubToken')->name('kyb_sumsub_token');
            Route::get('api_tokens', 'TraderController@getAPITokens')->name('api_tokens');
            Route::get('kyc_request', 'TraderController@getKYCRequest')->name('kyc_request');
            Route::get('kyc_kontur_data', 'TraderController@getKYCKonturData')->name('kyc_kontur_data');
            Route::get('kyc_local_ind_data', 'TraderController@getKYCLocalIndData')->name('kyc_local_ind_data');
            Route::get('kyc_local_comp_data', 'TraderController@getKYCLocalCompData')->name('kyc_local_comp_data');
            Route::get('verification_bank_details', 'TraderController@getVerificationBankDetails')->name('verification_bank_details');
            Route::get('replenish_bank_details', 'TraderController@getReplenishBankDetails')->name('replenish_bank_details');
            Route::get('withdraw_bank_details', 'TraderController@getWithdrawBankDetails')->name('withdraw_bank_details');
            Route::get('replenish_pay_templates', 'TraderController@getReplenishPayTemplates')->name('replenish_pay_templates');
            Route::get('withdraw_pay_templates', 'TraderController@getWithdrawPayTemplates')->name('withdraw_pay_templates');
            Route::get('offices', 'TraderController@getOfficeList')->name('offices');
            Route::get('office_slots', 'TraderController@getOfficeSlots')->name('office_slots');


            Route::get('rub_props','TraderController@getRubProps')->name('rub_props');
            Route::get('kgs_props','TraderController@getKgsProps')->name('kgs_props');
            Route::get('swift_props','TraderController@getSwiftProps')->name('swift_props');
            Route::get('qr_bank_details','TraderController@getQRBankDetails')->name('qr_bank_details');

            Route::get('get_image', 'TraderController@getKYCImage')->name('kyc_image');

            Route::middleware('check_block_status')->group(function () {
                Route::post('order/limit', 'TraderController@makeOrder')->name('limit_order');
                Route::post('order/market', 'TraderController@makeOrder')->name('market_order');
                Route::post('order/cancel', 'TraderController@cancelOrder')->name('cancel_order');
                Route::post('order/cancel_all', 'TraderController@cancelAllOrders')->name('cancel_all_orders');
                Route::post('order/cancel_all_sl', 'TraderController@cancelAllSLOrders')->name('cancel_all_sl_orders');
                Route::post('order/cancel_all_tp', 'TraderController@cancelAllTPOrders')->name('cancel_all_tp_orders');
                Route::post('order/cancel_all_ts', 'TraderController@cancelAllTSOrders')->name('cancel_all_ts_orders');

                Route::post('position/close', 'TraderController@closePosition')->name('close_position');
                Route::post('position/close_all', 'TraderController@closeAllPositions')->name('close_all_positions');
                Route::post('position/close_all_long', 'TraderController@closeAllLongPositions')->name('close_all_long_positions');
                Route::post('position/close_all_short', 'TraderController@closeAllShortPositions')->name('close_all_short_positions');
                Route::post('position/deposit', 'TraderController@depositPosition')->name('deposit_position');

                Route::post('transfer/trade', 'TraderController@transferToTradeWallet')->name('transfer_to_trade');
                Route::post('transfer/safe', 'TraderController@transferToSafeWallet')->name('transfer_to_safe');

                Route::post('withdraw/crypto/request', 'TraderController@withdrawCryptoRequest')->name('withdraw_crypto_request');
                Route::post('withdraw/fiat/request', 'TraderController@withdrawFiatRequest')->name('withdraw_fiat_request');
                Route::post('withdraw/crypto/confirm', 'TraderController@withdrawCryptoConfirm')->name('withdraw_crypto_confirm');
                Route::post('withdraw/fiat/confirm', 'TraderController@withdrawFiatConfirm')->name('withdraw_fiat_confirm');
                Route::post('withdraw/crypto/cancel', 'TraderController@withdrawCryptoCancel')->name('withdraw_crypto_cancel');
                Route::post('withdraw/fiat/cancel', 'TraderController@withdrawFiatCancel')->name('withdraw_fiat_cancel');

                Route::post('email/change/request', 'TraderController@emailChangeRequest')->name('email_change_request');
                Route::post('email/change/confirm', 'TraderController@emailChangeConfirm')->name('email_change_confirm');

                Route::post('notification/status', 'TraderController@setNotificationStatus')->name('set_notification_status');

                Route::post('set_verification_status', 'TraderController@setVerificationStatus')->name('set_verification_status');

                Route::post('notification/read', 'TraderController@setNotificationRead')->name('set_notification_read');
                Route::post('notification/delete', 'TraderController@deleteNotification')->name('delete_notification');
                Route::post('notifications/read_all', 'TraderController@setNotificationsReadAll')->name('set_notifications_read_all');
                Route::post('notifications/delete_all', 'TraderController@deleteAllNotifications')->name('delete_all_notifications');

                Route::post('message/send', 'TraderController@sendMessage')->name('send_message');

                Route::post('set_referral_type', 'TraderController@setReferralType')->name('set_referral_type');

                Route::post('validate_address', 'TraderController@validateAddress')->name('validate_address');

                Route::post('new_api_token', 'TraderController@newAPIToken')->name('new_api_token');
                Route::post('edit_api_token', 'TraderController@editAPIToken')->name('edit_api_token');
                Route::post('delete_api_token', 'TraderController@deleteAPIToken')->name('delete_api_token');
                Route::post('delete_all_api_tokens', 'TraderController@deleteAllAPITokens')->name('delete_all_api_tokens');

                Route::post('kyc_kontur_ind_request', 'TraderController@sendKYCKonturIndRequest')->name('send_kyc_kontur_ind_request');
                Route::post('kyc_kontur_comp_request', 'TraderController@sendKYCKonturCompRequest')->name('send_kyc_kontur_comp_request');
                Route::post('kyc_local_ind_request', 'TraderController@sendKYCLocalIndRequest')->name('send_kyc_local_ind_request');
                Route::post('kyc_local_comp_request', 'TraderController@sendKYCLocalCompRequest')->name('send_kyc_local_comp_request');
                Route::post('kyc_request', 'TraderController@sendKYCRequest')->name('send_kyc_request');
                Route::post('kyc_fix', 'TraderController@sendKYCFix')->name('send_kyc_fix');
                Route::post('kyc_payment', 'TraderController@setKYCPayment')->name('set_kyc_payment');

                Route::post('notify_fiat_qr_replenish', 'TraderController@NotifyFiatQRReplenish')->name('notify_fiat_qr_replenish');
                Route::post('notify_fiat_invoice_replenish', 'TraderController@NotifyFiatInvoiceReplenish')->name('notify_fiat_invoice_replenish');
                Route::post('notify_fiat_office_replenish', 'TraderController@NotifyFiatOfficeReplenish')->name('notify_fiat_office_replenish');
                Route::post('notify_fiat_office_withdraw', 'TraderController@NotifyFiatOfficeWithdraw')->name('notify_fiat_office_withdraw');


                Route::post('account_info_request', 'TraderController@AccountInfoRequest')->name('account_info_request');
                Route::post('statement_request', 'TraderController@StatementRequest')->name('statement_request');
                Route::post('contract_request', 'TraderController@ContractRequest')->name('contract_request');
                Route::post('account/delete/request', 'TraderController@AccountDeleteRequest')->name('account_delete_request');
                Route::post('account/delete/confirm', 'TraderController@AccountDeleteConfirm')->name('account_delete_confirm');

                Route::post('rub_props/add/request', 'TraderController@RubPropsAddRequest')->name('rub_props_add_request');
                Route::post('rub_props/add/confirm', 'TraderController@RubPropsAddConfirm')->name('rub_props_add_confirm');
                Route::post('rub_props/edit_name', 'TraderController@RubPropsEditName')->name('rub_props_edit_name');
                Route::post('rub_props/delete/request', 'TraderController@RubPropsDeleteRequest')->name('rub_props_delete_request');
                Route::post('rub_props/delete/confirm', 'TraderController@RubPropsDeleteConfirm')->name('rub_props_delete_confirm');

                Route::post('kgs_props/add/request', 'TraderController@KgsPropsAddRequest')->name('kgs_props_add_request');
                Route::post('kgs_props/add/confirm', 'TraderController@KgsPropsAddConfirm')->name('kgs_props_add_confirm');
                Route::post('kgs_props/edit_name', 'TraderController@KgsPropsEditName')->name('kgs_props_edit_name');
                Route::post('kgs_props/delete/request', 'TraderController@KgsPropsDeleteRequest')->name('kgs_props_delete_request');
                Route::post('kgs_props/delete/confirm', 'TraderController@KgsPropsDeleteConfirm')->name('kgs_props_delete_confirm');

                Route::post('swift_props/add/request', 'TraderController@SwiftPropsAddRequest')->name('swift_props_add_request');
                Route::post('swift_props/add/confirm', 'TraderController@SwiftPropsAddConfirm')->name('swift_props_add_confirm');
                Route::post('swift_props/edit_name', 'TraderController@SwiftPropsEditName')->name('swift_props_edit_name');
                Route::post('swift_props/delete/request', 'TraderController@SwiftPropsDeleteRequest')->name('swift_props_delete_request');
                Route::post('swift_props/delete/confirm', 'TraderController@SwiftPropsDeleteConfirm')->name('swift_props_delete_confirm');
            });


        });

    });
});
