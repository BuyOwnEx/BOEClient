<?php

namespace App\Exceptions;

use App\Library\BuyOwnExClientAPI;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExceptionBuyOwnExAPI extends Exception
{
    protected $code = 2000;
    protected $message = 'Unknown error';

    public function __construct($code) {
        parent::__construct();
        $this->code=$code;
        if ($code == BuyOwnExClientAPI::BadConstruction) {
            $this->message = __('app.api.errors.BadConstruction');
        }
    }
    public function report() : void
    {

    }
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'code' => $this->code,
            'message' => $this->message,
        ]);
    }
}
