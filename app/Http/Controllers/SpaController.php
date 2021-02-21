<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SpaController extends Controller
{
    public function index()
    {
        return view('spa', ['user' => Auth::user()]);
    }
}
