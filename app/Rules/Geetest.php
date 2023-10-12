<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Config;
use App\Library\GeetestLib;

class Geetest implements Rule
{
    protected $lot_number;
    protected $captcha_output;
    protected $pass_token;
    protected $gen_time;

    public function __construct()
    {
        list($this->lot_number, $this->captcha_output, $this->pass_token, $this->gen_time) = array_values(request()->only('lot_number', 'captcha_output', 'pass_token', 'gen_time'));
    }

    public function passes($attribute, $value)
    {
        $sign_token = hash_hmac('sha256', $this->lot_number, Config::get('geetest.key'));
        $api_server = Config::get('geetest.api_server');
        $data = [
            "lot_number" => $this->lot_number,
            "captcha_output" => $this->captcha_output,
            "pass_token" => $this->pass_token,
            "gen_time" => $this->gen_time,
            "sign_token" => $sign_token
        ];
        $url = sprintf($api_server . "/validate" . "?captcha_id=%s", Config::get('geetest.id'));
        $res = $this->post_request_v4($url,$data);
        $obj = json_decode($res,true);
        if ($obj['status'] === 'success' && $obj['result'] === 'success') {
            return true;
        }
        return false;
    }

    public function message()
    {
        return 'The validation error message.';
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
