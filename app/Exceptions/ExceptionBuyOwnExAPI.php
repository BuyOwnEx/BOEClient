<?php

namespace App\Exceptions;

use App\Library\BuyOwnExClientAPI;
use Exception;

class ExceptionBuyOwnExAPI extends Exception
{
    protected $code = 2000;
    protected $message = 'Unknown error';

    public function __construct($code) {
        $this->code=$code;
        switch($code) {
            case BuyOwnExClientAPI::BadConstruction:
                $this->message = trans('errors.api.BadConstruction');
                break;
            case BuyOwnExClientAPI::CurlNotInstalled:
                $this->message = trans('errors.api.CurlNotInstalled');
                break;
            case BuyOwnExClientAPI::ApiKeyNotSet:
                $this->message = trans('errors.api.ApiKeyNotSet');
                break;
            case BuyOwnExClientAPI::ApiSecretKeyNotSet:
                $this->message = trans('errors.api.ApiSecretKeyNotSet');
                break;
        }
    }
    public function report()
    {
        return response()->json([
            'code' => $this->code,
            'message' => $this->message,
        ]);
    }
}
