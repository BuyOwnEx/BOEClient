<?php

namespace App\Providers;

use App\Library\BuyOwnExClientAPI;
use App\Library\Geetest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->initializeSettingsContainer();
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('geetest', function () {
            list($geetest_challenge, $geetest_validate, $geetest_seccode) = array_values(request()->only('geetest_challenge', 'geetest_validate', 'geetest_seccode'));
            $data = [
                'client_type' => 'web',
                'ip_address' => request()->ip()
            ];
            if (session()->get('gtserver') == 1) {
                if (Geetest::successValidate($geetest_challenge, $geetest_validate, $geetest_seccode, $data)) {
                    return true;
                }
                return false;
            } else {
                if (Geetest::failValidate($geetest_challenge, $geetest_validate, $geetest_seccode)) {
                    return true;
                }
                return false;
            }
        });
    }

    private function initializeSettingsContainer()
    {
        $this->app->singleton('all-crypto-currencies', function () {
            return Cache::remember('crypto_currencies', 60, function (){
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->crypto_currencies()->getOriginalContent();
            });
        });

        $this->app->singleton('all-fiat-currencies', function () {
            return Cache::remember('fiat_currencies', 60, function (){
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->fiat_currencies()->getOriginalContent();
            });
        });

        $this->app->singleton('all-currencies', function () {
            return Cache::remember('all_currencies', 60, function (){
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                return $api->all_currencies()->getOriginalContent();
            });
        });

        $this->app->singleton('all-pairs', function () {
            return Cache::remember('all_pairs', 60, function () {
                $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
                $data = $api->market_data()->getOriginalContent();
                return data_get($data, 'data.*.*');
            });
        });

        $this->app->singleton('geetest', function () {
            return $this->app->make('App\Library\GeetestLib');
        });
    }
}
