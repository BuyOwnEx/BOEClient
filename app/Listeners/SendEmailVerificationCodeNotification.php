<?php

namespace App\Listeners;

use App\Events\ApiRegistered;
use App\Notifications\ApiVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class SendEmailVerificationCodeNotification
{
    /**
     * Handle the event.
     */
    public function handle(ApiRegistered $event): void
    {
        if ($event->user instanceof MustVerifyEmail && !$event->user->hasVerifiedEmail()) {
            $event->user->notify(new ApiVerifyEmail);
        }
    }
}
