@extends('layouts.auth')
@section('title')
    {{ __('titles.login') }}
@endsection
@section('keywords')
    {{ __('keywords.main') }}
@endsection
@section('description')
    {{ __('descriptions.main') }}
@endsection
@section('styles')
    @vite('resources/css/app.css')
@endsection
@section('scripts')
    <script>
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
        window.component = 'Login';
        window.verified = {!! \Illuminate\Support\Facades\Session::has('verified') ? 'true' : 'false' !!};
        window.v_error = {!! \Illuminate\Support\Facades\Session::has('error') ? \Illuminate\Support\Facades\Session::get('error') : 'false' !!};
        window.activation = {!! \Illuminate\Support\Facades\Session::has('activation') ? \Illuminate\Support\Facades\Session::get('activation') : 'false' !!};
    </script>
    @if (config('app.spa_enabled'))
        @vite('resources/js/app.js')
    @else
        @vite('resources/js/auth.js')
    @endif

    @if (config('captcha.enabled'))
        @if(mb_strtoupper(config('captcha.type')) === 'GEETEST')
            @vite('resources/js/plugins/gt4.js')
        @elseif(mb_strtoupper(config('captcha.type')) === 'CLOUDFLARE')
            <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
        @endif
    @endif
@endsection
