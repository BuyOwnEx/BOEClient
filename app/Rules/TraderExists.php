<?php

namespace App\Rules;

use App\Library\BuyOwnExClientAPI;
use Illuminate\Contracts\Validation\Rule;

class TraderExists implements Rule
{
    public $api;
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->api = new BuyOwnExClientAPI(config('app.api-public-key'), config('app.api-secret-key'));
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $res = $this->api->checkTraderName($value);
        if($res->status() !== 200) return false;
        else {
            $result = json_decode($res->content(), true);
            return $result['success'];
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The validation error message.';
    }
}
