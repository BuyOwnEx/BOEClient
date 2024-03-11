<?php

return [
    'enabled' => env('CAPTCHA_ENABLED'),
    'type' => env('CAPTCHA_TYPE'),
    'id' => env('CAPTCHA_ID'),
    'secret' => env('CAPTCHA_SECRET'),
    'cloudflare_api_server' => 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    'geetest_api_server' => 'http://gcaptcha4.geetest.com',
    'product' => 'bind'
];