<?php

namespace App\Http\Requests;

use Exception;
use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UsedGoogleToken;
use App\Rules\ValidGoogleToken;

class Confirm2FARequest extends FormRequest
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
            if($this->user() && $this->user()->g2fa)
            {
                $this->user = $this->user();
                return true;
            }
            else if($this->user() && !$this->user()->g2fa)
                return true;
            else return false;

        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if($this->user)
        {
            return [
                'totp' => [
                    'bail',
                    'required',
                    'digits:6',
                    new ValidGoogleToken($this->user),
                    new UsedGoogleToken($this->user)
                ],
            ];
        }
        else {
            return [];
        }
    }
}
