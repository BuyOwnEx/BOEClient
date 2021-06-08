[main_screenshot]: https://demo.buyownex.com/main.jpg "Trading sreenshot"

# BOEClient
BoeClient - b2b cryptocurrency exchange made on Laravel Framework. It`s allows you to deploy your own crypto exchange in few minutes, but with some limitations (see below) 

![Trading sreenshot][main_screenshot]

# Limitations

This project not allow you to have full control on exchange, cause it is only web part of complex architecture. That is why you will have some limitations:
1. You can`t perform listing on your exchange
2. You have no control on currency status (deposit and withdrawal statuses)
3. You have no direct access to crypto gateway

In other parts this exchange do not differ from others and you will have all functionality of normal exchange

# Installation

## Minimum server specifications

> 2.0 GHz 64-bit processor

> 2Gb RAM

> 32Gb SSD

> 200Mb Internet Channel

## Server requirements

> PHP >= 7.2.5

> BCMath PHP Extension

> Ctype PHP Extension

> Fileinfo PHP extension

> JSON PHP Extension

> Mbstring PHP Extension

> OpenSSL PHP Extension

> PDO PHP Extension

> Tokenizer PHP Extension

> XML PHP Extension

> MySQL 5.6+ || PostgreSQL 9.4+ || SQLite 3.8.8+ || SQL Server 2017+ 

Do not forget to make storage link
```php artisan storage:link```
