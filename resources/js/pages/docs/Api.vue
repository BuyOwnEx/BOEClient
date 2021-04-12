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
import CommonPageTitle from '../../components/common/CommonPageTitle';

import DocsNavigation from '../../components/docs/DocsNavigation';
import DocsContent from '../../components/docs/content/DocsContent';
import DocsFooter from '../../components/docs/DocsFooter';

export default {
	name: 'Api',

	components: { CommonPageTitle, DocsNavigation, DocsContent, DocsFooter },

	data() {
		return {
			api: [
				{
					id: 'general',
					title: this.$t('docs.api.general.title'),
					content: this.$t('docs.api.general.content'),
				},
				{
					id: 'auth',
					title: this.$t('docs.api.auth.title'),
					content: this.$t('docs.api.auth.content'),
				},
				{
					id: 'limits',
					title: this.$t('docs.api.limits.title'),
					content: this.$t('docs.api.limits.content'),
				},
				{
					id: 'codes',
					title: this.$t('docs.api.codes.title'),
					content: this.$t('docs.api.codes.content'),
				},
				{
					id: 'public',
					title: this.$t('docs.api.public.title'),
					items: [
						{
							id: 'public_market',
							title: this.$t('docs.api.public.market.title'),
							content: this.$t('docs.api.public.market.content'),
						},
						{
							id: 'public_currency',
							title: this.$t('docs.api.public.currency.title'),
							content: this.$t('docs.api.public.currency.content'),
						},
						{
							id: 'public_get_ticker',
							title: this.$t('docs.api.public.get_ticker.title'),
							content: this.$t('docs.api.public.get_ticker.content'),
						},
						{
							id: 'public_get_depth',
							title: this.$t('docs.api.public.get_depth.title'),
							content: this.$t('docs.api.public.get_depth.content'),
						},
						{
							id: 'public_get_deal',
							title: this.$t('docs.api.public.get_deal.title'),
							content: this.$t('docs.api.public.get_deal.content'),
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
							content: this.$t('docs.api.private.deal_list.content'),
						},
						{
							id: 'private_orders_list',
							title: this.$t('docs.api.private.orders_list.title'),
							content: this.$t('docs.api.private.orders_list.content'),
						},
						{
							id: 'private_orders_info',
							title: this.$t('docs.api.private.orders_info.title'),
							content: this.$t('docs.api.private.orders_info.content'),
						},
						{
							id: 'private_balance',
							title: this.$t('docs.api.private.balance.title'),
							content: this.$t('docs.api.private.balance.content'),
						},
						{
							id: 'private_transaction_list',
							title: this.$t('docs.api.private.transaction_list.title'),
							content: this.$t('docs.api.private.transaction_list.content'),
						},
						{
							id: 'private_transfer_list',
							title: this.$t('docs.api.private.transfer_list.title'),
							content: this.$t('docs.api.private.transfer_list.content'),
						},
						{
							id: 'private_commission',
							title: this.$t('docs.api.private.commission.title'),
							content: this.$t('docs.api.private.commission.content'),
						},
						{
							id: 'private_place_order',
							title: this.$t('docs.api.private.place_order.title'),
							content: this.$t('docs.api.private.place_order.content'),
						},
						{
							id: 'private_cancel_order',
							title: this.$t('docs.api.private.cancel_order.title'),
							content: this.$t('docs.api.private.cancel_order.content'),
						},
					],
				},
			],
		};
	},
};
</script>

<style scoped lang="sass">
.api-page
	display: flex
	flex-flow: column
	flex-grow: 1
</style>
