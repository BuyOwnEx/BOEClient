<template>
	<v-card class="docs-page api-page">
		<CommonPageTitle>API</CommonPageTitle>

		<v-card-text>
			<v-row>
				<DocsNavigation :data-array="api" />

				<DocsContent :data-array="api" nested />
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
	name: 'Api',

	components: { CommonPageTitle, DocsNavigation, DocsContent, DocsFooter },

	computed: {
		api() {
			return [
				{
					id: 'general',
					title: this.$t('docs.api.general.title'),
					content: this.$t('docs.api.general.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'auth',
					title: this.$t('docs.api.auth.title'),
					content: this.$t('docs.api.auth.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'limits',
					title: this.$t('docs.api.limits.title'),
					content: this.$t('docs.api.limits.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'codes',
					title: this.$t('docs.api.codes.title'),
					content: this.$t('docs.api.codes.content', { url: this.url, productName: this.productName }),
				},
				{
					id: 'public',
					title: this.$t('docs.api.public.title'),
					items: [
						{
							id: 'public_market',
							title: this.$t('docs.api.public.market.title'),
							content: this.$t('docs.api.public.market.content', { url: this.url, productName: this.productName }),
						},
						{
							id: 'public_currency',
							title: this.$t('docs.api.public.currency.title'),
							content: this.$t('docs.api.public.currency.content', { url: this.url, productName: this.productName }),
						},
						{
							id: 'public_get_ticker',
							title: this.$t('docs.api.public.get_ticker.title'),
							content: this.$t('docs.api.public.get_ticker.content', { url: this.url, productName: this.productName }),
						},
						{
							id: 'public_get_depth',
							title: this.$t('docs.api.public.get_depth.title'),
							content: this.$t('docs.api.public.get_depth.content', { url: this.url, productName: this.productName }),
						},
						{
							id: 'public_get_deal',
							title: this.$t('docs.api.public.get_deal.title'),
							content: this.$t('docs.api.public.get_deal.content', { url: this.url, productName: this.productName }),
						},
					],
				},
				{
					id: 'private',
					title: this.$t('docs.api.private.title'),
					items: [
						{
							id: 'private_deal_list',
							title: this.$t('docs.api.private.deal_list.title'),
							content: this.$t('docs.api.private.deal_list.content', { url: this.url, productName: this.productName }),
						},
						{
							id: 'private_orders_list',
							title: this.$t('docs.api.private.orders_list.title'),
							content: this.$t('docs.api.private.orders_list.content', {
								url: this.url,
								productName: this.productName,
							}),
						},
						{
							id: 'private_orders_info',
							title: this.$t('docs.api.private.orders_info.title'),
							content: this.$t('docs.api.private.orders_info.content', {
								url: this.url,
								productName: this.productName,
							}),
						},
						{
							id: 'private_balance',
							title: this.$t('docs.api.private.balance.title'),
							content: this.$t('docs.api.private.balance.content', { url: this.url, productName: this.productName }),
						},
						{
							id: 'private_transaction_list',
							title: this.$t('docs.api.private.transaction_list.title'),
							content: this.$t('docs.api.private.transaction_list.content', {
								url: this.url,
								productName: this.productName,
							}),
						},
						{
							id: 'private_transfer_list',
							title: this.$t('docs.api.private.transfer_list.title'),
							content: this.$t('docs.api.private.transfer_list.content', {
								url: this.url,
								productName: this.productName,
							}),
						},
						{
							id: 'private_commission',
							title: this.$t('docs.api.private.commission.title'),
							content: this.$t('docs.api.private.commission.content', { url: this.url, productName: this.productName }),
						},
						{
							id: 'private_place_order',
							title: this.$t('docs.api.private.place_order.title'),
							content: this.$t('docs.api.private.place_order.content', {
								url: this.url,
								productName: this.productName,
							}),
						},
						{
							id: 'private_cancel_order',
							title: this.$t('docs.api.private.cancel_order.title'),
							content: this.$t('docs.api.private.cancel_order.content', {
								url: this.url,
								productName: this.productName,
							}),
						},
					],
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
.api-page
	display: flex
	flex-flow: column
	flex-grow: 1
</style>
