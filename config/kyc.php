<?php

return [
    'server'              => env('SUMSUB_SERVER'),
    'api-public-key'      => env('SUMSUB_PUBLIC_KEY'),
    'api-secret-key'      => env('SUMSUB_SECRET_KEY'),
    'kyc-level-name'          => env('SUMSUB_KYC_LEVEL_NAME', 'basic-kyc-level'),
    'kyb-level-name'          => env('SUMSUB_KYB_LEVEL_NAME', 'basic-kyb-level')
];
