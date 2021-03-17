<template>
	<v-card class="docs-page terms-page">
		<CommonPageTitle> {{ $t('docs.terms.title') }} </CommonPageTitle>

		<v-card-text>
			<v-row>
				<DocsNavigation :data-array="terms" />
				<DocsContent :data-array="terms" />
			</v-row>

			<DocsFooter />
		</v-card-text>
	</v-card>
</template>

<script>
import CommonPageTitle from '../../components/common/CommonPageTitle';

import DocsNavigation from '../../components/docs/DocsNavigation';
import DocsContent from '../../components/docs/DocsContent';
import DocsFooter from '../../components/docs/DocsFooter';

export default {
	name: 'Terms',

	components: { CommonPageTitle, DocsNavigation, DocsContent, DocsFooter },

	data() {
		return {
			terms: [
				{
					id: 'general',
					title: this.$t('docs.terms.general.title'),
					content: this.$t('docs.terms.general.content'),
				},
				{
					id: 'definition',
					title: this.$t('docs.terms.definition.title'),
					content: this.$t('docs.terms.definition.content'),
				},
				{
					id: 'account',
					title: this.$t('docs.terms.account.title'),
					content: this.$t('docs.terms.account.content'),
				},
				{
					id: 'platform',
					title: this.$t('docs.terms.platform.title'),
					content: this.$t('docs.terms.platform.content'),
				},
				{
					id: 'service_duty',
					title: this.$t('docs.terms.service_duty.title'),
					content: this.$t('docs.terms.service_duty.content'),
				},
				{
					id: 'user_duty',
					title: this.$t('docs.terms.user_duty.title'),
					content: this.$t('docs.terms.user_duty.content'),
				},
				{
					id: 'ip',
					title: this.$t('docs.terms.ip.title'),
					content: this.$t('docs.terms.ip.content'),
				},
				{
					id: 'responsibility',
					title: this.$t('docs.terms.responsibility.title'),
					content: this.$t('docs.terms.responsibility.content'),
				},
				{
					id: 'stop',
					title: this.$t('docs.terms.stop.title'),
					content: this.$t('docs.terms.stop.content'),
				},
				{
					id: 'additional',
					title: this.$t('docs.terms.additional.title'),
					content: this.$t('docs.terms.additional.content'),
				},
				{
					id: 'contacts',
					title: this.$t('docs.terms.contacts.title'),
					content: this.$t('docs.terms.contacts.content'),
				},
			],
		};
	},
};
</script>

<style scoped lang="sass">
.terms-page
	display: flex
	flex-flow: column
	flex-grow: 1
</style>
