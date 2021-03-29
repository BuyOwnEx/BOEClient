<?php

namespace App\Rules;

use App\User;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Crypt;
use PragmaRX\Google2FA\Google2FA;

class ValidGoogleToken implements Rule
{
    private $user;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
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
        try {
            $secret = Crypt::decrypt($this->user->google2fa_secret);
            $tmp = new Google2FA();
            return $tmp->verifyKey($secret, $value);
        }
        catch(\Exception $e)
        {
            return false;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.2fa');
    }
}
