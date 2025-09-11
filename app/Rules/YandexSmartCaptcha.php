<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class YandexSmartCaptcha implements DataAwareRule, ValidationRule
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
        if (Http::asForm()->post(
            url: config('captcha.yandex_api_server'),
            data: [
                'secret' => config('captcha.secret'),
                'token' => $this->data['captcha_output'],
            ])->json('status') !== 'ok')
        {
            $fail('app.validation.captcha')->translate();
        }
    }
}
