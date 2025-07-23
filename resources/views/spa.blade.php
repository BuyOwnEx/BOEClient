@extends('layouts.spa')
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
    @vite('resources/js/app.js')
@endsection
