@extends('layouts.main')
@section('title')
    {{trans('titles.fees')}}
@endsection
@section('keywords')
    keywords
@endsection
@section('description')
    description
@endsection
@section('styles')
    <link href="{{ mix('dist/css/app.css') }}" rel="stylesheet">
@endsection
@section('scripts')
    <script>
			window.user = {!! json_encode($user); !!};
            window.config = {!! json_encode($config); !!};
			window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
			window.component = 'fees';
    </script>
    <script src="{{mix('dist/js/main.js')}}"></script>
@endsection