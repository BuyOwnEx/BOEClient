@extends('layouts.main')
@section('title')
    {{ __('titles.overview') }}
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
        window.user = {!! json_encode($user); !!};
        window.config = {!! json_encode($config); !!};
        window.trading_currency = {!! json_encode($currency); !!};
        window.trading_market = {!! json_encode($market); !!};
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
    </script>
    @if (config('app.spa_enabled'))
        @vite('resources/js/app.js')
    @else
        @vite('resources/js/overview.js')
    @endif
@endsection
