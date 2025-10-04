<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class CloudFlare implements DataAwareRule, ValidationRule
{
    protected $data = [];

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!Http::post(
            url: config('captcha.cloudflare_api_server'),
            data: [
                'secret' => config('captcha.secret'),
                'response' => $this->data['captcha_output'],
            ])->json('success'))
        {
            $fail('app.validation.captcha')->translate();
        }
    }
}
