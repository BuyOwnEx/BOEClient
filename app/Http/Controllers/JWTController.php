<?php

namespace App\Http\Controllers;

use App\Library\BuyOwnExClientAPI;
use Illuminate\Http\Request;

class JWTController extends Controller
{
    public function getOwnToken(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->get_own_jwt_token($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function getPrivateToken(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->get_private_jwt_token($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
    public function refreshOwnToken(Request $request)
    {
        try {
            $api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
            return $api->refresh_own_jwt_token($request->user()->id);
        } catch (\Exception $e) {
            return ['success'=>false, 'message'=>$e->getMessage()];
        }
    }
}
