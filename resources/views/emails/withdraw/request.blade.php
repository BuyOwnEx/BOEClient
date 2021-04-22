@component('mail::message')
# Request of withdrawal

Your code of withdrawal is: {{$code}}.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
