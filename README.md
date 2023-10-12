[main_screenshot]: https://buyownex.com/main.jpg "Trading sreenshot"

# BOEClient

[![Build Status](https://img.shields.io/travis/buyownex/boeclient/master.svg)](https://travis-ci.org/buyownex/boeclient) 
[![GitHub stars](https://img.shields.io/github/stars/buyownex/boeclient)](https://github.com/buyownex/boeclient/stargazers) 
[![GitHub license](https://img.shields.io/github/license/buyownex/boeclient.svg)](https://raw.githubusercontent.com/buyownex/boeclient/master/LICENSE)

BoeClient - b2b cryptocurrency exchange made on Laravel Framework. It`s allows you to deploy your own crypto exchange in few minutes, but with some limitations (see below) 

![Trading sreenshot][main_screenshot]

# Limitations

This project not allow you to have full control on exchange, cause it is only web part of complex architecture. That is why you will have some limitations:
1. You can`t perform listing on your exchange
2. You have no control on currency deposit and withdrawal statuses
3. You have no direct access to crypto gateway

In other parts this exchange do not differ from others and you will have all functionality of normal exchange

# Getting started

## Installation

Please check the official laravel 7.x installation guide for server requirements before you start. [Official Documentation](https://laravel.com/docs/7.x/installation#installation)

Alternative installation is possible without local dependencies relying on [Docker](#docker). 

Clone the repository

    git clone git@github.com:buyownex/boeclient.git

Switch to the repo folder

    cd boeclient

Install all the dependencies using composer v2 for PHP 7

    composer install
    
Install all the dependencies using composer v2 for PHP 8 with ignore flag of compatibility (due to incompatible of phpunit: phpunit/phpunit 8.5.9 requires php ^7.2)

    composer install --ignore-platform-reqs

Copy the example env file and make the required configuration changes in the .env file

    cp .env.example .env

Generate a new application key

    php artisan key:generate

Run the database migrations (**Set the database connection in .env before migrating**)

    php artisan migrate

Create the symbolic link to the public storage

    php artisan storage:link

Make front-end build

    npm install
    npm run dev

Start the local development server

    php artisan serve

You can now access the server at http://localhost:8000

**TL;DR command list**

    git clone git@github.com:buyownex/boeclient.git
    cd boeclient
    composer install
    cp .env.example .env
    php artisan key:generate
    
**Make sure you set the correct database connection information before running the migrations** [Environment variables](#environment-variables)

    php artisan migrate
    php artisan serve
    
## Docker

To install with [Docker](https://www.docker.com), run following commands:

```
git clone git@github.com:buyownex/boeclient.git
cd boeclient
cp .env.example .env
docker run -v $(pwd):/app composer install
cd ./docker
docker-compose up -d
docker-compose exec php php artisan key:generate
docker-compose exec php php artisan migrate
docker-compose exec php php artisan storage:link
docker-compose exec php php artisan serve --host=0.0.0.0
```

----------

# Code overview

## Dependencies

- [zendesk-laravel](https://github.com/huddledigital/zendesk-laravel) - For ticket system integration
- [sanctum](https://github.com/laravel/sanctum) - For handling incoming API requests
- [bacon-qr-code](https://github.com/bacon/bacon-qr-code) - For generating QR codes

## Environment variables

`.env` - Environment variables can be set in this file

Specific variables to this project:

    # API Server, that handles incoming requests. Use this demo server for test purposes.
    SERVER=http://65.108.71.47:18888
    MIX_WS_SERVER=wss://demo.buyownex.com/connection/websocket
    API_PUBLIC_KEY=F8qErvMf5LLoZcMKhucDYnByuxeSx94lnHMIwTWItpPJ9c4Y6wxRdUbtZATmCFfyyUd2M1fhEcBo0b9y // demo public key for SERVER
    API_SECRET_KEY=K8rx23vVSJKvZhywro4KAO4OaTmGRRGiDlESCx3XZsWKJs8e71MxcLntj4OxhQKF8xjDkLIQnJfB3N3K // demo secret key for SERVER
    
    # Moble API keys
    API_MOBILE_PUBLIC_KEY= // public key for mobile app (optional)
    API_MOBILE_SECRET_KEY= // secret key for mobile app (optional)
    
    # When you navigate to the main page, redirection occurs to the http://localhost/trading/{DEFAULT_MARKET}/{DEFAULT_CURRENCY} link
    DEFAULT_MARKET=USDT
    DEFAULT_CURRENCY=BTC
    
    # Test server and credentials of KYC provider Sum&Substance. You can get own test account at https://sumsub.com/contact-us/
    SUMSUB_SERVER=https://test-api.sumsub.com
    SUMSUB_PUBLIC_KEY=
    SUMSUB_SECRET_KEY=
    
    # Zendesk credentials for ticket system. Get your own account at https://www.zendesk.com/register
    ZENDESK_SUBDOMAIN=
    ZENDESK_USERNAME=
    ZENDESK_TOKEN=
    
    # Is to use Geetest Captcha or not. It is recommended to use it. Disable it only if Geetest don`t work
    CAPTCHA_ENABLED=true

    # geetest ID and Key. Get your own account at https://www.geetest.com/en/
    GEETEST_ID=
    GEETEST_KEY=
    
    # verification driver choice. Possible values: local or sumsub
    MIX_KYC_DRIVER=local
    # payment for verification option: false - payment excluded, true - payment included
    MIX_VERIFICATION_PAYMENT_REQUIRED=false
    
***Note*** : You can quickly set the database information and other variables in this file and have the application fully working.

