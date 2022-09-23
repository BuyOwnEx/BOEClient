<?php

namespace App\Http\Requests;

use App\Rules\UsedGoogleToken;
use App\Rules\ValidGoogleToken;
use App\User;
use Illuminate\Foundation\Http\FormRequest;

class Validate2FARequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'trader_id' => [
                'required',
                'integer',
                'exists:users,id'
            ],
            'totp' => [
                'bail',
                'required',
                'digits:6',
                new ValidGoogleToken(User::findOrFail($this->get('trader_id'))),
                new UsedGoogleToken(User::findOrFail($this->get('trader_id')))
            ],
        ];
    }
}
