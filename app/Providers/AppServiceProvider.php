<?php

namespace App\Providers;

use App\Library\BuyOwnExClientAPI;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->initializeSettingsContainer();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
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
    }
}
