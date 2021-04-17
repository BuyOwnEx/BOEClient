<template>
	<div>
		<p>
			{{ $t('status.description') }}
		</p>
		<p>
			{{ $t('status.see_state_of_market') }}
			<a class="text-decoration-none" href="/overview">
				{{ $t('menu.overview') }}
			</a>
		</p>
	</div>
</template>

<script>
export default {
	name: 'StatusDefinitionText',
};
</script>
