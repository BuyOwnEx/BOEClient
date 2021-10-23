<?php
return [

    /*
    |--------------------------------------------------------------------------
    | Config Language
    |--------------------------------------------------------------------------
    |
    | Here you can config your lang.
    |
    | Options: ['zh-cn', 'zh-tw', 'en', 'ja', 'ko']
    |
    */
    'lang' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Config Geetest Id
    |--------------------------------------------------------------------------
    |
    | Here you can config your geetest ID.
    |
    */
    'id' => env('GEETEST_ID'),

    /*
    |--------------------------------------------------------------------------
    | Config Geetest Key
    |--------------------------------------------------------------------------
    |
    | Here you can config your geetest api key.
    |
    */
    'key' => env('GEETEST_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Config Geetest URL
    |--------------------------------------------------------------------------
    |
    | Here you can config your geetest url for validation.
    |
    */
    'url' => '/geetest',

    /*
    |--------------------------------------------------------------------------
    | Config Geetest Protocol
    |--------------------------------------------------------------------------
    |
    | Here you can config your geetest url for validation.
    |
    | Options: http or https
    |
    */
    'protocol' => 'http',

    /*
    |--------------------------------------------------------------------------
    | Config Geetest Product
    |--------------------------------------------------------------------------
    |
    | Here you can config your geetest url for validation.
    |
    | Options: float, popup, custom, bind
    |
    */
    'product' => 'float',

    /*
    |--------------------------------------------------------------------------
    | Config Client Fail Alert Text
    |--------------------------------------------------------------------------
    |
    | Here you can config the alert text when it failed in client.
    |
    */
    'client_fail_alert' => 'client_fail_alert!!!',

    /*
    |--------------------------------------------------------------------------
    | Config Server Fail Alert
    |--------------------------------------------------------------------------
    |
    | Here you can config the alert text when it failed in server (two factor validation).
    |
    */
    'server_fail_alert' => 'server_fail_alert!!!',


];