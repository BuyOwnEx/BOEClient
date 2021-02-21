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
    <link href="{{ mix('/css/main.css') }}" rel="stylesheet">
@endsection
@section('scripts')
    <script>
        window.user = {!! json_encode($user); !!};
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
        window.component = 'overview';
        window.trading_currency = {!! json_encode($currency); !!};
        window.trading_market = {!! json_encode($market); !!};
    </script>
    <script src="{{mix('/js/overview.js')}}"></script>
@endsection