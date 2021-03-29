<?php

namespace App\Rules;

use App\User;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Cache;

class UsedGoogleToken implements Rule
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
        $key = $this->user->id . ':' . $value;
        return !Cache::has($key);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.2fa_reuse');
    }
}
