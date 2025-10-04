<?php

namespace App\Listeners;

use App\Library\BuyOwnExClientAPI;
use Carbon\Carbon;
use hisorange\BrowserDetect\Facade as Browser;
use Illuminate\Http\Request;

class UserLoggined
{
    /**
     * Create the event listener.
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        $event->user->last_login_at=Carbon::now();
        $event->user->last_ip=$this->request->getClientIp();
        $event->user->last_browser=Browser::browserName();
        $event->user->last_os=Browser::platformName();
        $event->user->last_device=Browser::deviceFamily().' '.Browser::deviceModel();
        $event->user->save();
        $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
        $api->newLoginNotification($event->user->id, $this->request->getClientIp());
    }
}
