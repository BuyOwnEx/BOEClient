<?php

namespace App\Library;


use Illuminate\Support\Facades\Facade;

class Geetest extends Facade
{
    /**
     * Get the binding in the IoC container
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'geetest';
    }

}