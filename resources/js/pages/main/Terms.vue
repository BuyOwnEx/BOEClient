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
import CommonPageTitle from '@/components/common/CommonPageTitle.vue';

import DocsNavigation from '@/components/docs/DocsNavigation.vue';
import DocsContent from '@/components/docs/content/DocsContent.vue';
import DocsFooter from '@/components/docs/DocsFooter.vue';
import config from '@/configs';

export default {
	name: 'Terms',

	components: { CommonPageTitle, DocsNavigation, DocsContent, DocsFooter },

	computed: {
		terms() {
			return [
				{
					id: 'general',
					title: this.$t('docs.terms.general.title'),
					content: this.$t('docs.terms.general.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'definition',
					title: this.$t('docs.terms.definition.title'),
					content: this.$t('docs.terms.definition.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'account',
					title: this.$t('docs.terms.account.title'),
					content: this.$t('docs.terms.account.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'platform',
					title: this.$t('docs.terms.platform.title'),
					content: this.$t('docs.terms.platform.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'service_duty',
					title: this.$t('docs.terms.service_duty.title'),
					content: this.$t('docs.terms.service_duty.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'user_duty',
					title: this.$t('docs.terms.user_duty.title'),
					content: this.$t('docs.terms.user_duty.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'ip',
					title: this.$t('docs.terms.ip.title'),
					content: this.$t('docs.terms.ip.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'responsibility',
					title: this.$t('docs.terms.responsibility.title'),
					content: this.$t('docs.terms.responsibility.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'stop',
					title: this.$t('docs.terms.stop.title'),
					content: this.$t('docs.terms.stop.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'additional',
					title: this.$t('docs.terms.additional.title'),
					content: this.$t('docs.terms.additional.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'contacts',
					title: this.$t('docs.terms.contacts.title'),
					content: this.$t('docs.terms.contacts.content', { url: this.url, productName: this.productName }),
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
.terms-page
	display: flex
	flex-flow: column
	flex-grow: 1
</style>
