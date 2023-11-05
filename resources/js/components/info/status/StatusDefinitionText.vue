<template>
	<div>
		<p>
			{{ $t('status.description') }}
		</p>
		<p>
			{{ $t('status.see_state_of_market') }}
            <Link class="text-decoration-none" path="/overview">{{ $t('menu.overview') }}</Link>
		</p>
	</div>
</template>

<script>
import Link from "@/components/common/Link.vue";
export default {
	name: 'StatusDefinitionText',
    components: {
        Link
    },
};
</script>
