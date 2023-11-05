@extends('layouts.main')
@section('title')
    {{ __('titles.main') }}
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
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
    </script>
    @vite('resources/js/app.js')
@endsection
