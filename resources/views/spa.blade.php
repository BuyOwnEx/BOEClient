<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="keywords" content="{{ config('app.use_custom_keywords') ? __('custom/keywords.main') : __('keywords.main') }}">
    <meta name="description" content="{{ config('app.use_custom_descriptions') ? __('custom/descriptions.main') : __('descriptions.main') }}">
    <title>{{config('app.name')}}</title>
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    @vite('resources/css/app.css')
</head>
<body>
<div id="app">
</div>
<script>
    @if(session()->has('error'))
			window.flash = @json(session()->get('error'));
    @endif
            @if(session()->has('verified'))
			window.verified = @json(session()->get('verified'));
    @endif
            @if(isset($user))
			window.user = @json($user);
    @endif
</script>
@vite('resources/js/app.js')
</body>
</html>
