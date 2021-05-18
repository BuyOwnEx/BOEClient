@extends('layouts.main')
@section('title')
    {{trans('titles.overview')}}
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
        window.config = {!! json_encode($config); !!};
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
        window.component = 'overview';
        window.trading_currency = {!! json_encode($currency); !!};
        window.trading_market = {!! json_encode($market); !!};
    </script>
    <script src="{{mix('dist/js/overview.js')}}"></script>
@endsection