<?php

namespace App\Http\Requests;

use App\Rules\UsedGoogleToken;
use App\Rules\ValidGoogleToken;
use App\User;
use Exception;
use Illuminate\Foundation\Http\FormRequest;

class ValidateSecretRequest extends FormRequest
{
    private $user;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        try {
            $this->user = User::findOrFail(
                session('2fa:user:id')
            );
        } catch (Exception $exc) {
            return false;
        }
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
            'totp' => ['bail','required','digits:6',new ValidGoogleToken(User::findOrFail(session('2fa:user:id'))),new UsedGoogleToken(User::findOrFail(session('2fa:user:id')))],
        ];
    }
}
