@extends('layouts.auth')
@section('title')
    {{ __('titles.reset') }}
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
        window.component = 'Reset';
        window.reset = {!! json_encode(json_decode('{"email":"'.$email.'","token":"'.$token.'"}')) !!} ;
        window.captcha_enabled = {{ config('app.captcha_enabled') ? 'true' : 'false' }};
        window.verified = {!! \Illuminate\Support\Facades\Session::has('verified') ? 'true' : 'false' !!};
        window.v_error = {!! \Illuminate\Support\Facades\Session::has('error') ? \Illuminate\Support\Facades\Session::get('error') : 'false' !!};
        window.activation = {!! \Illuminate\Support\Facades\Session::has('activation') ? \Illuminate\Support\Facades\Session::get('activation') : 'false' !!};
    </script>
    @if (config('app.spa_enabled'))
        @vite('resources/js/app.js')
    @else
        @vite('resources/js/auth.js')
    @endif
    @vite('resources/js/plugins/hero-canvas.js')
@endsection
