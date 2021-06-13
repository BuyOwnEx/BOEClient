@extends('layouts.error')
@section('title')
    {{trans('titles.404')}}
@endsection
@section('keywords')
    keywords
@endsection
@section('description')
    description
@endsection
@section('styles')

@endsection
@section('scripts')
    <script>
			window.locale = {!! json_encode(str_replace('_', '-', app()->getLocale())) !!};
			window.component = 'unexpected-page';
    </script>
    <script src="{{mix('dist/js/error.js')}}"></script>
@endsection