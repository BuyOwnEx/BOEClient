<?php

namespace App\Rules;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Crypt;
use PragmaRX\Google2FA\Google2FA;

class ValidGoogleToken implements ValidationRule
{
    private $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        try {
            $secret = Crypt::decrypt($this->user->g2fa_secret);
            $tmp = new Google2FA();
            if(!$tmp->verifyKey($secret, $value))
                $fail('app.validation.2fa')->translate();
        }
        catch(\Exception $e)
        {
            $fail('app.validation.2fa')->translate();
        }
    }
}
