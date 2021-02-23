@extends('layouts.main')
@section('title')
    {{trans('titles.ref_payments')}}
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
        window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
        window.component = 'ref-payments';
    </script>
    <script src="{{mix('dist/js/main.js')}}"></script>
@endsection