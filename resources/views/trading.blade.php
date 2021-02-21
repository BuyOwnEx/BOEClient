@extends('layouts.main')
@section('title')
    {{strtoupper($currency)}}/{{strtoupper($market)}}
@endsection
@section('keywords')
    keywords
@endsection
@section('description')
    description
@endsection
@section('styles')
    <link href="{{ mix('dist/css/app.css') }}" rel="stylesheet">
    <link href="{{ mix('dist/css/highcharts.css') }}" rel="stylesheet">
@endsection
@section('scripts')
    <script>
        window.user = {!! json_encode($user); !!};
        window.trading_currency = {!! json_encode($currency); !!};
        window.trading_market = {!! json_encode($market); !!};
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
    </script>
    <script src="{{mix('dist/js/trading.js')}}"></script>
@endsection