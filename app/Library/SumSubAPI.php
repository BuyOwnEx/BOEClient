<?php

namespace App\Library;

use Illuminate\Support\Facades\Http;

class SumSubAPI
{
    const PREFIX = 'X-App-';
    protected $base = 'https://test-api.sumsub.com';

    protected $api_key;
    protected $api_secret;
    protected $info = [
        "timeOffset" => 0,
    ];

    public function __construct()
    {
        $param = func_get_args();
        switch (count($param)) {
            case 2:
                $this->api_key = $param[0];
                $this->api_secret = $param[1];
                $this->base = config('app.sumsub_endpoint','https://test-api.sumsub.com');
                break;
            default:
                throw new \Exception(__('app.api.errors.BadConstruction'),1000);
        }
    }

    // https://developers.sumsub.com/api-reference/#creating-an-applicant
    public function createApplicant($externalUserId)
    {
        $params = [
            'externalUserId' => $externalUserId
        ];
        $path = '/resources/applicants?levelName=basic-kyc-level';
        $response = Http::asForm()->withToken($this->api_key)
            ->withHeaders($this->sign($params,'POST', $path))
            ->post($this->base.$path,$params);
        return response()->json($response->json(),$response->status());
    }

    public function getApplicantStatus($applicantId)
        // https://developers.sumsub.com/api-reference/#getting-applicant-status-api
    {
        $params = [];
        $path = "/resources/applicants/" . $applicantId . "/requiredIdDocsStatus";
        $response = Http::withToken($this->api_key)
            ->withHeaders($this->sign($params,'GET', $path))
            ->get($this->base.$path,$params);
        return response()->json($response->json(),$response->status());
    }

    public function getAccessToken($externalUserId)
        // https://developers.sumsub.com/api-reference/#access-tokens-for-sdks
    {
        $params = [
            'userId' => $externalUserId
        ];
        $path = "/resources/accessTokens?userId=" . $externalUserId;
        $response = Http::withHeaders($this->sign($params,'POST', $path))
            ->post($this->base.$path,$params);
        return response()->json($response->json(),$response->status());
    }

    private function sign($params, $method, $path)
    {
        $prefix = self::PREFIX;
        $ts = time();
        $auth = [
            'Content-Type' => 'application/json',
            $prefix . 'Token'   => $this->api_key,
            $prefix . 'Access-Sig'   => hash_hmac('sha256', $ts . strtoupper($method) . $path . json_encode($params), $this->api_secret),
            $prefix . 'Access-Ts' => $ts,
        ];
        return $auth;
    }
}
