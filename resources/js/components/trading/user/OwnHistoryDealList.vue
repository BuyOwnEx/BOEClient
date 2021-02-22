<template>
	<v-card>
		<v-data-table
			dense
			:calculate-widths='true'
			:headers='headers'
			:items='ownDealList'
			:items-per-page='itemsPerPage'
			:footer-props='footer_props'
			class='elevation-0 pl-4 pr-4'
			id='own-history-deal-list'
		>
			<template v-slot:top>
				<v-toolbar flat dense class='mt-2'>
					<v-toolbar-title>{{ tableCaption }}</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-switch
						v-model='showOtherPairs'
						class='mr-3'
						hide-details
						height='14'
						left
						inset
						:label="$vuetify.lang.translator('trading.show_other_pairs')"
					></v-switch>
				</v-toolbar>
			</template>
			<template v-slot:item.date='{ item }'>
				{{ getDate(item) }}
			</template>
			<template v-slot:item.market='{ item }'>
				<strong>{{ item.currency.toUpperCase() }}</strong
				><span class='market-name'>/{{ item.market.toUpperCase() }}</span>
			</template>
			<template v-slot:item.side='{ item }'>
				<strong
					:class="{ 'text-success': item.side, 'text-danger': !item.side }"
				>
					{{
						item.side
							? $vuetify.lang.translator('trading.order.direction.buy')
							: $vuetify.lang.translator('trading.order.direction.sell')
					}}
				</strong>
			</template>
			<template v-slot:item.size='{ item }'>
				{{ size(item) }} {{ item.currency.toUpperCase() }}
			</template>
			<template v-slot:item.price='{ item }'>
				{{ price(item) }} {{ item.market.toUpperCase() }}
			</template>
			<template v-slot:item.volume='{ item }'>
				{{ volume(item) }} {{ item.market.toUpperCase() }}
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
export default {
	name: 'OwnHistoryDealList',
	props: {
		currency: String,
		market: String,
	},
	data() {
		return {
			showOtherPairs: false,
			tableCaption:
				this.$vuetify.lang.translator('trading.headers.own_history_deal_list') +
				' ' +
				this.currency +
				'/' +
				this.market,
			itemsPerPage: 5,
			headers: [
				{
					text: this.$vuetify.lang.translator('trading.date'),
					align: 'start',
					sortable: true,
					value: 'date',
				},
				{
					text: this.$vuetify.lang.translator('trading.market'),
					value: 'market',
				},
				{ text: this.$vuetify.lang.translator('trading.type'), value: 'side' },
				{
					text: this.$vuetify.lang.translator('trading.amount'),
					value: 'size',
				},
				{ text: this.$vuetify.lang.translator('trading.rate'), value: 'price' },
				{
					text: this.$vuetify.lang.translator('trading.volume'),
					value: 'volume',
					sortable: false,
				},
			],
			footer_props: {
				'items-per-page-options': [5, 10, 15, 30, 50],
				'items-per-page-all-text': '50',
			},
		};
	},
	computed: {
		ownDealList() {
			return this.showOtherPairs
				? this.$store.state.user.deals
				: _.filter(this.$store.state.user.deals, {
					currency: this.currency.toUpperCase(),
					market: this.market.toUpperCase(),
				});
		},
	},
	methods: {
		volume: function(item) {
			return BigNumber(item.price)
				.times(BigNumber(item.size))
				.toString();
		},
		size: function(item) {
			return BigNumber(item.size).toString();
		},
		price: function(item) {
			return BigNumber(item.price).toString();
		},
		getDate(item) {
			return item.createdAt;
		},
	},
};
</script>

<style scoped></style>
