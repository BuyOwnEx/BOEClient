<?php

use App\Rules\ActiveTraderExists;
use App\Rules\TraderExists;
use App\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

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

Route::post('/sanctum/token', 'AppAPIController@GetTraderToken');
Route::post('/sanctum/register', 'AppAPIController@RegisterTrader');
Route::post('/sanctum/register/resend', 'AppAPIController@ResendTrader');
Route::post('/sanctum/register/verify', 'AppAPIController@VerifyTrader');
Route::post('/sanctum/password/email', 'AppAPIController@sendResetLinkEmail'); // на вход получаем email, на выходе должны получить success или не success + token
Route::middleware(['CheckMobileSign'])->group(function () {
    Route::post('/sanctum/password/reset', 'Auth\ResetPasswordController@reset'); // на вход получаем token, email, password и password_confirmation
});

Route::get('/sanctum/get_image', 'AppAPIController@GetImage');
Route::post('/sanctum/upload_images', 'AppAPIController@UploadImages');
Route::post('/sanctum/email_change_confirm', 'AppAPIController@EmailChangeConfirm');
Route::middleware(['throttle:5'])->group(function () {
    Route::post('/sanctum/check_2fa', 'AppAPIController@Check2FA');
    Route::post('/sanctum/enable_2fa', 'AppAPIController@Enable2FA');
    Route::post('/sanctum/disable_2fa', 'AppAPIController@Disable2FA');
    Route::post('/sanctum/image_2fa', 'AppAPIController@Image2FA');
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
        Route::middleware('CheckSign')->group(function () {
            Route::post('make_order', 'APIController@makeOrder')->middleware('CheckSign');
            Route::post('cancel_order', 'APIController@cancelOrder')->middleware('CheckSign');
            Route::post('withdraw_crypto', 'APIController@withdrawCrypto')->middleware('CheckSign');
        });
    });
});


