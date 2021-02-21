@extends('layouts.main')
@section('title')
    {{trans('titles.main')}}
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
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
    </script>
    <script src="{{ mix('dist/js/app.js') }}"></script>
@endsection

{{--

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="/favicon.ico">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Lux Laravel Starter</title>

        <!-- Quicksand Font -->
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">

        <link href="{{ mix('dist/css/app.css') }}" rel="stylesheet">
        <link href="{{ mix('dist/css/highcharts.css') }}" rel="stylesheet">
    </head>
    <body>
        <div id="app"></div>
        <script src="{{ mix('dist/js/app.js') }}"></script>
        <script>
            window.user = {!! json_encode($user); !!};
        </script>
    </body>
</html>
--}}
