<template>
	<v-card class="api pa-3">
		<DocsTitle>API</DocsTitle>

		<v-row>
			<DocsNavigation :data-array="api" nested />

			<DocsContent :data-array="api" nested />
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
	name: 'Api',

	components: { DocsTitle, DocsNavigation, DocsContent, DocsFooter },

	data() {
		return {
			api: [
				{
					id: 'general',
					title: this.$t('docs.api.general.title'),
					items: [
						{
							title: this.$t('docs.api.general.title'),
							content: this.$t('docs.api.general.content'),
						},
					],
				},
				{
					id: 'auth',
					title: this.$t('docs.api.auth.title'),
					items: [
						{
							title: this.$t('docs.api.auth.title'),
							content: this.$t('docs.api.auth.content'),
						},
					],
				},
				{
					id: 'limits',
					title: this.$t('docs.api.limits.title'),
					items: [
						{
							title: this.$t('docs.api.limits.title'),
							content: this.$t('docs.api.limits.content'),
						},
					],
				},
				{
					id: 'codes',
					title: this.$t('docs.api.codes.title'),
					items: [
						{
							title: this.$t('docs.api.codes.title'),
							content: this.$t('docs.api.codes.content'),
						},
					],
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
							title: this.$t('docs.api.public.private.deal_list.title'),
							content: this.$t('docs.api.public.deal_list.content'),
						},
						{
							title: this.$t('docs.api.public.private.orders_list.title'),
							content: this.$t('docs.api.public.orders_list.content'),
						},
						{
							title: this.$t('docs.api.public.private.orders_info.title'),
							content: this.$t('docs.api.public.orders_info.content'),
						},
						{
							title: this.$t('docs.api.public.private.balance.title'),
							content: this.$t('docs.api.public.balance.content'),
						},
						{
							title: this.$t('docs.api.public.private.transaction_list.title'),
							content: this.$t('docs.api.public.transaction_list.content'),
						},
						{
							title: this.$t('docs.api.public.private.transfer_list.title'),
							content: this.$t('docs.api.public.transfer_list.content'),
						},
						{
							title: this.$t('docs.api.public.private.commission.title'),
							content: this.$t('docs.api.public.commission.content'),
						},
						{
							title: this.$t('docs.api.public.private.place_order.title'),
							content: this.$t('docs.api.public.place_order.content'),
						},
						{
							title: this.$t('docs.api.public.private.cancel_order.title'),
							content: this.$t('docs.api.public.cancel_order.content'),
						},
					],
				},
			],
		};
	},
};
</script>

<style scoped lang='sass'>
.api
	display: flex
	flex-flow: column
	flex-grow: 1
</style>
