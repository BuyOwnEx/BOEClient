<?php

namespace App\Rules;

use App\Library\BuyOwnExClientAPI;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class TraderExists implements ValidationRule
{
    public $api;

    public function __construct()
    {
        $this->api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
    }
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $res = $this->api->checkTraderName($value);
        if($res->status() !== 200)
            $fail('app.validation.check_trader_name_error')->translate();
        else {
            $result = json_decode($res->content(), true);
            if (!$result['success'])
                $fail('app.validation.check_trader_name')->translate();
        }
    }
}
