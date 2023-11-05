<?php

declare(strict_types=1);

return [
    'auth' => [
        'no_such_user' => 'Искомый пользователь отсутствует',
        'already_verified' => 'Пользователь уже подтвержден',
        'verification_error' => 'Ошибка верификации',
        'un_authed' => 'Сессия авторизации истекла'
    ],
    'validation'              => [
        '2fa' => 'Неверный код 2FA',
        '2fa_reuse' => 'Нельзя использовать повторно код 2FA',
        'check_trader_name' => 'Имя уже занято, выберите другое',
        'check_trader_name_error' => 'Ошибка при проверке имени пользователя',
        'captcha' => 'Ошибка валидации Captcha'
    ],
    'api' => [
        'errors' => [
            'BadConstruction' => 'Неверный конструктор API'
        ]
    ],
    'attributes' => [
        'kyc' => [
            'first_name' => 'Имя',
            'second_name' => 'Отчество',
            'surname' => 'Фамилия',
            'sex' => 'Пол',
            'birthday' => 'Дата рождения',
            'birthday_place' => 'Место рождения',
            'passport_no' => 'Серия и номер паспорта',
            'passport_place' => 'Паспорт выдан',
            'passport_date' => 'Дата выдачи',
            'address' => 'Адрес регистрации',
            'file_ps' => 'Скан паспорта (фото)',
            'file_ws' => 'Скан паспорта (регистрация)',
            'file_ts' => 'Селфи с паспортом'
        ]
    ]
];
