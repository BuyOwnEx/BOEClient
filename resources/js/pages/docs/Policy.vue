<template>
	<v-card class="docs policy pa-3">
		<DocsTitle> {{ $t('docs.policy.title') }} </DocsTitle>

		<v-row>
			<DocsNavigation :data-array="policy" />
			<DocsContent :data-array="policy" />
		</v-row>

		<DocsFooter />
	</v-card>
</template>

<script>
import DocsTitle from '../../components/docs/DocsTitle';
import DocsNavigation from '../../components/docs/DocsNavigation';
import DocsContent from '../../components/docs/DocsContent';
import DocsFooter from '../../components/docs/DocsFooter';

export default {
	name: 'Policy',

	components: { DocsTitle, DocsNavigation, DocsContent, DocsFooter },

	data() {
		return {
			policy: [
				{
					id: 'general',
					title: this.$t('docs.policy.general.title'),
					content: this.$t('docs.policy.general.content'),
				},
				{
					id: 'collecting_data',
					title: this.$t('docs.policy.collecting_data.title'),
					content: this.$t('docs.policy.collecting_data.content'),
				},
				{
					id: 'event_data',
					title: this.$t('docs.policy.event_data.title'),
					content: this.$t('docs.policy.event_data.content'),
				},
				{
					id: 'cookie',
					title: this.$t('docs.policy.cookie.title'),
					content: this.$t('docs.policy.cookie.content'),
				},
				{
					id: 'security',
					title: this.$t('docs.policy.security.title'),
					content: this.$t('docs.policy.security.content'),
				},
				{
					id: 'links',
					title: this.$t('docs.policy.links.title'),
					content: this.$t('docs.policy.links.content'),
				},
				{
					id: 'changes',
					title: this.$t('docs.policy.changes.title'),
					content: this.$t('docs.policy.changes.content'),
				},
				{
					id: 'contact',
					title: this.$t('docs.policy.contact.title'),
					content: this.$t('docs.policy.contact.content'),
				},
			],
		};
	},
};
</script>

<style scoped lang="sass">
.policy
	display: flex
	flex-flow: column
	flex-grow: 1
</style>