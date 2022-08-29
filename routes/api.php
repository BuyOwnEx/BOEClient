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

Route::middleware('CheckMobileSign')->post('/sanctum/token', function (Request $request) {
    $data = $request->all();
    $validator = Validator::make($data, [
        'email' => ['required', 'string', 'email', 'max:255', 'exists:users,email'],
        'password' => ['required', 'string', 'min:8'],
        'device_name' => [ 'required', 'string']
    ]);
    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()->getMessages(),
        ],422);
    }
    try {
        $user = User::where('email', $request->email)->first();
        if(!$user)
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ],404);
        if(!Hash::check($request->password, $user->password))
            return response()->json([
                'success' => false,
                'message' => 'The provided credentials are incorrect',
            ],404);
        $token = $user->createToken($request->device_name);
        return response()->json([
            'success' => true,
            'token' => $token->plainTextToken,
            'secret' => $token->plainTextSecretToken
        ],200);
    }
    catch (Exception $exception)
    {
        return response()->json([
            'success' => false,
            'message' => $exception->getMessage(),
        ],500);
    }
});

Route::middleware('CheckMobileSign')->post('/sanctum/register', function (Request $request) {
    $data = $request->all();
    $validator = Validator::make($data, [
        'name' => ['required', 'string', 'min:5' ,'max:128', 'regex:/^([a-zA-Z0-9-_])+$/', 'unique:users', new TraderExists],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        'password' => ['required', 'string', 'min:8', 'confirmed'],
        'ref' => [
            'string',
            'max:100',
            new ActiveTraderExists
        ]
    ]);
    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()->getMessages(),
        ],422);
    }
    try {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'inviteCode' => $data['ref'] ?? null
        ]);
        event(new Registered($user));
        return response()->json([
            'success' => true,
        ],200);
    }
    catch (Exception $exception)
    {
        return response()->json([
            'success' => false,
            'message' => $exception->getMessage(),
        ],500);
    }
});
Route::middleware('CheckMobileSign')->get('/sanctum/get_image', function (Request $request) {
    try {
        $file = Storage::get(explode(env('APP_URL'), $request->path)[1]);
        return response($file);
    }
    catch (Exception $exception)
    {
        return response()->json([
            'success' => false,
            'message' => $exception->getMessage(),
        ],500);
    }
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


