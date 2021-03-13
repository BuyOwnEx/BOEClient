<template>
	<v-card class="api pa-3 flex-grow-1">
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
							id: 'public-market',
							title: this.$t('docs.api.public.market.title'),
							content: this.$t('docs.api.public.market.content'),
						},
						{
							id: 'public-currency',
							title: this.$t('docs.api.public.currency.title'),
							content: this.$t('docs.api.public.currency.content'),
						},
						{
							id: 'public-get-ticker',
							title: this.$t('docs.api.public.get-ticker.title'),
							content: this.$t('docs.api.public.get-ticker.content'),
						},
						{
							id: 'public-get-depth',
							title: this.$t('docs.api.public.get-depth.title'),
							content: this.$t('docs.api.public.get-depth.content'),
						},
						{
							id: 'public-get-deal',
							title: this.$t('docs.api.public.get-deal.title'),
							content: this.$t('docs.api.public.get-deal.content'),
						},
					],
				},
				{
					id: 'private',
					title: this.$t('docs.api.private.title'),
					items: [
						{
							title: this.$t('docs.api.public.private.deal-list.title'),
							content: this.$t('docs.api.public.deal-list.content'),
						},
						{
							title: this.$t('docs.api.public.private.orders-list.title'),
							content: this.$t('docs.api.public.orders-list.content'),
						},
						{
							title: this.$t('docs.api.public.private.orders-info.title'),
							content: this.$t('docs.api.public.orders-info.content'),
						},
						{
							title: this.$t('docs.api.public.private.balance.title'),
							content: this.$t('docs.api.public.balance.content'),
						},
						{
							title: this.$t('docs.api.public.private.transaction-list.title'),
							content: this.$t('docs.api.public.transaction-list.content'),
						},
						{
							title: this.$t('docs.api.public.private.transfer-list.title'),
							content: this.$t('docs.api.public.transfer-list.content'),
						},
						{
							title: this.$t('docs.api.public.private.commission.title'),
							content: this.$t('docs.api.public.commission.content'),
						},
						{
							title: this.$t('docs.api.public.private.place-order.title'),
							content: this.$t('docs.api.public.place-order.content'),
						},
						{
							title: this.$t('docs.api.public.private.cancel-order.title'),
							content: this.$t('docs.api.public.cancel-order.content'),
						},
					],
				},
			],
		};
	},
};
</script>

<style scoped></style>