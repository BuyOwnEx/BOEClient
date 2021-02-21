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