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

Please check the official laravel 10.x installation guide for server requirements before you start. [Official Documentation](https://laravel.com/docs/10.x/releases#support-policy)

Alternative installation is possible without local dependencies relying on [Docker](#docker). 

Clone the repository

    git clone git@github.com:buyownex/boeclient.git

Switch to the repo folder

    cd boeclient

Install all the dependencies using composer v2 for PHP 8

    composer install

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
    npm run build

Start the local development server

    php artisan serve

You can now access the server at http://localhost:8000

**TL;DR command list**

    git clone git@github.com:buyownex/boeclient.git
    cd boeclient
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan storage:link
    npm install
    
**Make sure you set the correct database connection information before running the migrations** [Environment variables](#environment-variables)

    php artisan migrate
    php artisan serve

**Make sure you set the correct VITE_WS_SERVER before running front end build** [Environment variables](#environment-variables)

    npm run build
    
## Docker

To install with [Docker](https://www.docker.com), you can use laradock infrastructure [Official Laradock Documentation](https://laradock.io/getting-started/)

----------

# Code overview

## Dependencies

- [zendesk-laravel](https://github.com/huddledigital/zendesk-laravel) - For ticket system integration
- [sanctum](https://github.com/laravel/sanctum) - For handling incoming API requests
- [bacon-qr-code](https://github.com/bacon/bacon-qr-code) - For generating QR codes

## Environment variables

`.env` - Environment variables can be set in this file

Specific variables to this project:

    # Web socket server. Use this demo server for test purposes
    VITE_WS_SERVER=wss://ws.buyownex.com/ws
    # verification driver choice. Possible values: local or sumsub
    VITE_KYC_DRIVER=local
    # payment for verification option: false - payment excluded, true - payment included
    VITE_VERIFICATION_PAYMENT_REQUIRED=false

    # API Server, that handles incoming requests. Use this demo server and API keys for test purposes
    SERVER=https://api.buyownex.com
    API_PUBLIC_KEY=9ayqB8BIUTyhDkEFxoNzyAVCQv523Fx9ynUhlHvOka7PUCOn91PMbh560wROb66Gu8rgm3gqoJkrbCgv // demo public key for SERVER
    API_SECRET_KEY=q2e78LdPopmKPVCaAwxrrNmXb1qWMD3WoY77F7glTzByWD4d8zQHcyPLunBJ5I2szzzrbbsQGG141yeO // demo secret key for SERVER
    
    # Choice between SPA application and common application
    SPA_ENABLED=true
 
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
    
***Note*** : You can quickly set the database information and other variables in this file and have the application fully working.

