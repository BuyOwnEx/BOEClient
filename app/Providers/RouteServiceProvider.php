<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
        RateLimiter::for('one-per-minute', function ($request) {
            return Limit::perMinutes(1, 1)
                ->response(function () {
                    return response()->json([
                        'message' => trans('app.validation.limit_per_minute',['limit' => 1]),
                        'error' => 'rate_limited'
                    ], 429);
                });
        });
        RateLimiter::for('one-per-five-minutes', function ($request) {
            return Limit::perMinutes(5, 1)
                ->response(function () {
                    return response()->json([
                        'message' => trans('app.validation.limit_per_minute',['limit' => 5]),
                        'error' => 'rate_limited'
                    ], 429);
                });
        });

        $this->routes(function () {
            Route::middleware('api')
                ->namespace($this->namespace)
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));
        });
    }
}
