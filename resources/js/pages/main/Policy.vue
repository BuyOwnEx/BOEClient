<template>
	<v-card class="docs-page policy-page">
		<CommonPageTitle>
			{{ $t('docs.policy.title') }}
		</CommonPageTitle>

		<v-card-text>
			<v-row>
				<DocsNavigation :data-array="policy" />
				<DocsContent :data-array="policy" />
			</v-row>

			<DocsFooter />
		</v-card-text>
	</v-card>
</template>

<script>
import config from '@/configs';

import CommonPageTitle from '@/components/common/CommonPageTitle.vue';

import DocsNavigation from '@/components/docs/DocsNavigation.vue';
import DocsContent from '@/components/docs/content/DocsContent.vue';
import DocsFooter from '@/components/docs/DocsFooter.vue';

export default {
	name: 'Policy',

	components: { CommonPageTitle, DocsNavigation, DocsContent, DocsFooter },

	computed: {
		policy() {
			return [
				{
					id: 'general',
					title: this.$t('docs.policy.general.title'),
					content: this.$t('docs.policy.general.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'collecting_data',
					title: this.$t('docs.policy.collecting_data.title'),
					content: this.$t('docs.policy.collecting_data.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'event_data',
					title: this.$t('docs.policy.event_data.title'),
					content: this.$t('docs.policy.event_data.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'cookie',
					title: this.$t('docs.policy.cookie.title'),
					content: this.$t('docs.policy.cookie.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'security',
					title: this.$t('docs.policy.security.title'),
					content: this.$t('docs.policy.security.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'links',
					title: this.$t('docs.policy.links.title'),
					content: this.$t('docs.policy.links.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'changes',
					title: this.$t('docs.policy.changes.title'),
					content: this.$t('docs.policy.changes.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'contact',
					title: this.$t('docs.policy.contact.title'),
					content: this.$t('docs.policy.contact.content', { url: this.url, productName: this.productName }),
				},
			];
		},

		productName() {
			return config.product.name;
		},
		url() {
			return window.location.hostname;
		},
	},
};
</script>

<style scoped lang="sass">
.policy-page
	display: flex
	flex-flow: column
	flex-grow: 1
</style>
