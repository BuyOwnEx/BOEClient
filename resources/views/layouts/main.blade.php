<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="keywords" content="@yield('keywords')">
        <meta name="description" content="@yield('description')">
        <title>{{config('app.name')}} - @yield('title')</title>
        <link rel="dns-prefetch" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        @yield('styles')
    </head>
<body>
<div id="app">

</div>
<script>

</script>
@yield('scripts')
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
</body>
</html>
