<?php

namespace App\Library;

use App\Models\PersonalAccessToken;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;

class APIToken implements Arrayable, Jsonable
{
    /**
     * The access token instance.
     *
     * @var \Laravel\Sanctum\PersonalAccessToken
     */
    public $accessToken;

    /**
     * The plain text version of the token.
     *
     * @var string
     */
    public $plainTextToken;

    /**
     * The plain text version of the secret part token.
     *
     * @var string
     */
    public $plainTextSecretToken;

    public static $abilities = [
        "trading",
        "withdraw"
    ];

    /**
     * Create a new access token result.
     *
     * @param  \App\Models\PersonalAccessToken  $accessToken
     * @param  string  $plainTextToken
     * @return void
     */
    public function __construct(PersonalAccessToken $accessToken, string $plainTextToken, string $plainTextSecretToken)
    {
        $this->accessToken = $accessToken;
        $this->plainTextToken = $plainTextToken;
        $this->plainTextSecretToken = $plainTextSecretToken;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'accessToken' => $this->accessToken,
            'plainTextToken' => $this->plainTextToken,
            'plainTextSecretToken' => $this->plainTextSecretToken,
        ];
    }

    /**
     * Convert the object to its JSON representation.
     *
     * @param  int  $options
     * @return string
     */
    public function toJson($options = 0)
    {
        return json_encode($this->toArray(), $options);
    }
}
