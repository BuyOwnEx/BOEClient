[main_screenshot]: https://demo.buyownex.com/main_en.jpg "Trading sreenshot"

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

Install all the dependencies using composer

    composer install

Copy the example env file and make the required configuration changes in the .env file

    cp .env.example .env

Generate a new application key

    php artisan key:generate

Run the database migrations (**Set the database connection in .env before migrating**)

    php artisan migrate

Create the symbolic link to the public storage

    php artisan storage:link

Start the local development server

    php artisan serve

You can now access the server at http://localhost

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
    SERVER=http://188.127.235.78:18888
    API_PUBLIC_KEY=5lG72waSPWg6APJr21BONXVeevkwNgwD3PANulKhX8v9p7TTYqBlnbYM6X3nqRub7lvTHJzH6kKMjid8 // demo public key for SERVER
    API_SECRET_KEY=z2YH6R7lYzYCsE1Ecl1HKsWIWIdK9YQ73d6ZRU7ZXfFKXIOaUxVw4ny57xeUbIg1apkRKjX83Fc8CHDA // demo secret key for SERVER
    
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
    
    # Redis Server for subscribtion purposes. Use this demo server and credentials for tests.
    SUBSCRIPTION_REDIS_HOST=188.127.235.78
    SUBSCRIPTION_REDIS_USERNAME=client
    SUBSCRIPTION_REDIS_PASSWORD=5bslc1coee4cssgq4tfixudw3ql4u4wpmho4aqs2vnfmly3km46m2gszemu8mu4i
    SUBSCRIPTION_REDIS_PORT=16379

***Note*** : You can quickly set the database information and other variables in this file and have the application fully working.

