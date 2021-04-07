<?php

namespace App\Http\Controllers;

use App\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function getAllNotifications(Request $request)
    {
        return ['success'=>true, 'notifications'=>Notification::all()];
    }
}
