<?php

namespace App\Rules;

use App\User;
use Illuminate\Contracts\Validation\Rule;

class ActiveTraderExists implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
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
        $exist = User::where('id','=',$value)->whereNotNull('email_verified_at')->count();
        return $exist > 0;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Trader does not exist';
    }
}
