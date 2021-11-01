<?php

namespace GuzzleHttp\Psr7;

/**
 *
 * @param string $resource
 * @param array  $options
 *
 * @return PumpStream|Stream|\Psr\Http\Message\StreamInterface
 */
function stream_for($resource = '', array $options = [])
{
    return Utils::streamFor($resource, $options);
}