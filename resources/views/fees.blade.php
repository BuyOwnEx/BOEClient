@extends('layouts.main')
@section('title')
    {{ __('titles.fees') }}
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
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
        window.component = 'Fees';
    </script>
    @if (config('app.spa_enabled'))
        @vite('resources/js/app.js')
    @else
        @vite('resources/js/main.js')
    @endif
@endsection
