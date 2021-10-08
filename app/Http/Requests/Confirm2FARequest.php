<?php

namespace App\Http\Requests;

use Exception;
use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UsedGoogleToken;
use App\Rules\ValidGoogleToken;

class Confirm2FARequest extends FormRequest
{
    private $user_id;
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
                $this->user_id = $this->user()->id;
                return $this->user()->id === session('2fa:user:id') ? true : false;
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
        if($this->user_id)
        {
            return [
                'totp' => [
                    'bail',
                    'required',
                    'digits:6',
                    new ValidGoogleToken($this->user_id),
                    new UsedGoogleToken($this->user_id)
                ],
            ];
        }
        else {
            return [];
        }
    }
}
