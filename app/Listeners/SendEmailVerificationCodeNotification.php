<?php

namespace App\Listeners;

use App\Events\ApiRegistered;
use App\Notifications\ApiVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendEmailVerificationCodeNotification
{
    /**
     * Handle the event.
     *
     * @param ApiRegistered $event
     * @return void
     */
    public function handle(ApiRegistered $event)
    {
        if ($event->user instanceof MustVerifyEmail && !$event->user->hasVerifiedEmail()) {
            $event->user->notify(new ApiVerifyEmail);
        }
    }
}
