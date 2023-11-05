@extends('layouts.error')
@section('title')
    {{ __('titles.503') }}
@endsection
@section('keywords')
    {{ __('keywords.main') }}
@endsection
@section('description')
    {{ __('descriptions.main') }}
@endsection
@section('styles')

@endsection
@section('scripts')
    <script>
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
        window.component = 'MaintenancePage';
    </script>
    @vite('resources/js/error.js')
@endsection
