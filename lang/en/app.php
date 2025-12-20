<?php

declare(strict_types=1);

return [
    'auth' => [
        'no_such_user' => 'The searchable user not found',
        'already_verified' => 'The user has already been confirmed',
        'verification_error' => 'Verification error',
        'un_authed' => 'The authorization session has expired'
    ],
    'validation'              => [
        '2fa' => 'Not a valid 2FA code',
        '2fa_reuse' => 'Cannot reuse 2FA code',
        'check_trader_name' => 'The name is already taken, choose another one',
        'check_trader_name_error' => 'Error checking the user name',
        'captcha' => 'Captcha validation error',
        'limit_per_minute' => 'The limit has been exceeded. Try again after :limit min.'
    ],
    'api' => [
        'errors' => [
            'BadConstruction' => 'API bad construction'
        ]
    ],
    'attributes' => [
        'kyc' => [
            'first_name' => 'First name',
            'second_name' => 'Second name',
            'surname' => 'Surname',
            'sex' => 'Sex',
            'birthday' => 'Birthday',
            'birthday_place' => 'Birthday location',
            'passport_no' => 'Document ID',
            'passport_place' => 'Document issuer',
            'passport_date' => 'Document date',
            'address' => 'Address',
            'file_ps' => 'Document scan (photo)',
            'file_ws' => 'Document scan (address)',
            'file_ts' => 'Selfie with document'
        ]
    ]
];
