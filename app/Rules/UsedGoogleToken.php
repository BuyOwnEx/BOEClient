<?php

namespace App\Rules;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Cache;

class UsedGoogleToken implements ValidationRule
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
        $key = $this->user->id . ':' . $value;
        if(Cache::has($key))
            $fail('app.validation.2fa_reuse')->translate();
    }
}
