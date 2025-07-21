@extends('layouts.landing')
@section('title')
    {{ __('titles.landing') }}
@endsection
@section('keywords')
    {{ __('keywords.landing') }}
@endsection
@section('description')
    {{ __('descriptions.landing') }}
@endsection
@section('styles')
    @vite('resources/css/app.css')
@endsection
@section('scripts')
    <script>
			window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
			window.component = 'Landing';
    </script>
    @if (config('app.spa_enabled'))
        @vite('resources/js/app.js')
    @else
        @vite('resources/js/main.js')
    @endif
@endsection
