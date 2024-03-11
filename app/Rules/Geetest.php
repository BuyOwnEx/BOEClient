<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Config;

class Geetest implements ValidationRule
{
    protected $lot_number;
    protected $captcha_output;
    protected $pass_token;
    protected $gen_time;

    public function __construct()
    {
        list($this->lot_number,
            $this->captcha_output,
            $this->pass_token,
            $this->gen_time) = array_values(request()->only(
                'lot_number',
                'captcha_output',
                'pass_token',
                'gen_time'
        ));
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $sign_token = hash_hmac('sha256', $this->lot_number, Config::get('captcha.secret'));
        $api_server = Config::get('captcha.geetest_api_server');
        $data = [
            "lot_number" => $this->lot_number,
            "captcha_output" => $this->captcha_output,
            "pass_token" => $this->pass_token,
            "gen_time" => $this->gen_time,
            "sign_token" => $sign_token
        ];
        $url = sprintf($api_server . "/validate" . "?captcha_id=%s", Config::get('captcha.id'));
        $res = $this->post_request_v4($url,$data);
        $obj = json_decode($res,true);
        if ($obj['status'] !== 'success' || $obj['result'] !== 'success') {
            $fail('app.validation.captcha')->translate();
        }
    }
    protected function post_request_v4($url, $postdata)
    {
        $data = http_build_query($postdata);
        $options    = array(
            'http' => array(
                'method'  => 'POST',
                'header'  => "Content-type: application/x-www-form-urlencoded",
                'content' => $data,
                'timeout' => 5
            )
        );
        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        preg_match('/([0-9])\d+/',$http_response_header[0],$matches);
        $responsecode = intval($matches[0]);
        if($responsecode != 200) {
            $result = array(
                "result" => "success",
                "reason" => "request geetest api fail"
            );
            return json_encode($result);
        }
        else
        {
            return $result;
        }
    }
}
