<?php

namespace App\Listeners;

use App\Library\BuyOwnExClientAPI;
use Carbon\Carbon;
use Browser;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;
use Illuminate\Queue\InteractsWithQueue;


class UserLoggined
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        $event->user->lastLoginAt=Carbon::now();
        $event->user->lastIP=$this->request->getClientIp();
        $event->user->lastBrowser=Browser::browserName();
        $event->user->lastOS=Browser::platformName();
        $event->user->lastDevice=Browser::deviceFamily().' '.Browser::deviceModel().' '.Browser::mobileGrade();
        $event->user->save();
        $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
        $api->newLoginNotification($event->user->id, $this->request->getClientIp());
    }
}
