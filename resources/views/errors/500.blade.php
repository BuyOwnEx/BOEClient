@extends('layouts.error')
@section('title')
    {{ __('titles.500') }}
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
			window.component = 'UnexpectedPage';
    </script>
    @if (config('app.spa_enabled'))
        @vite('resources/js/app.js')
    @else
        @vite('resources/js/error.js')
    @endif
@endsection
