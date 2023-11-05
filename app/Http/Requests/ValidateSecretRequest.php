<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\UsedGoogleToken;
use App\Rules\ValidGoogleToken;
use Illuminate\Foundation\Http\FormRequest;

class ValidateSecretRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if(!User::findOrFail(session('2fa:user:id')))
            return false;
        else return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'totp' => [
                'bail',
                'required',
                'digits:6',
                new ValidGoogleToken(User::findOrFail(session('2fa:user:id'))),
                new UsedGoogleToken(User::findOrFail(session('2fa:user:id')))
            ],
        ];
    }
}
