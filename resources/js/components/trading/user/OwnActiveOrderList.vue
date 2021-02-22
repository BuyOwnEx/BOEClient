<template>
	<v-card>
		<v-data-table
			dense
			:calculate-widths='true'
			:headers='headers'
			:items='ownOrderList'
			:items-per-page='itemsPerPage'
			:footer-props='footer_props'
			class='elevation-0 pl-4 pr-4'
			id='own-active-order-list'
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
						:label="$t('trading.show_other_pairs')"
					></v-switch>
					<v-menu transition='slide-y-transition' bottom>
						<template v-slot:activator='{ on, attrs }'>
							<v-btn
								tile
								outlined
								small
								color='#A6A6A6'
								v-bind='attrs'
								v-on='on'
							>
								{{ $t('trading.cancel') }}
								<v-icon right>mdi-chevron-down</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item
								dense
								v-for='(item, i) in cancelOptions'
								:key='i'
								@click='item.click'
							>
								<v-list-item-title>{{ item.text }}</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-toolbar>
			</template>
			<template v-slot:item.action='{ item }'>
				<v-btn
					tile
					outlined
					x-small
					color='#A6A6A6'
					dense
					@click='orderCancel(item)'
				>
					{{ $t('trading.cancel') }}
				</v-btn>
			</template>
			<template v-slot:item.date='{ item }'>
				{{ getDateFromTick(item) }}
			</template>
			<template v-slot:item.market='{ item }'>
				<strong>{{ item.currency }}</strong
				><span class='market-name'>/{{ item.market }}</span>
			</template>
			<template v-slot:item.side='{ item }'>
        <span v-if='item.side === false'>
          <strong class='text-success'>{{
												$t('trading.order.direction.buy')
											}}</strong>
          <span class='order_type order_type_sl' v-if="item.type === 'STOPLOSS'"
										>SL</span
										>
          <span
											class='order_type order_type_tp'
											v-if="item.type === 'TAKEPROFIT'"
										>TP</span
										>
          <span
											class='order_type order_type_ts'
											v-if="item.type === 'TRAILINGSTOP'"
										>TS</span
										>
        </span>
				<span v-else>
          <strong class='text-danger'>{{
												$t('trading.order.direction.sell')
											}}</strong>
          <span class='order_type order_type_sl' v-if="item.type === 'STOPLOSS'"
										>SL</span
										>
          <span
											class='order_type order_type_tp'
											v-if="item.type === 'TAKEPROFIT'"
										>TP</span
										>
          <span
											class='order_type order_type_ts'
											v-if="item.type === 'TRAILINGSTOP'"
										>TS</span
										>
        </span>
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
			<template v-slot:item.percent='{ item }'> {{ percent(item) }}%</template>
			<template v-slot:item.status='{ item }'>
        <span class='text-success' v-if="item.status === 'accepted'">{{
										$t('trading.order.status.accepted')
									}}</span>
				<span class='text-warning' v-else>{{
						$t('trading.order.status.partiallyFilled')
					}}</span>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
export default {
	name: 'OwnActiveOrderList',
	props: {
		currency: String,
		market: String,
	},
	data() {
		return {
			showOtherPairs: false,
			tableCaption:
				this.$t('trading.headers.own_active_order_list') +
				' ' +
				this.currency +
				'/' +
				this.market,
			itemsPerPage: 5,
			headers: [
				{
					text: this.$t('trading.date'),
					align: 'start',
					sortable: true,
					value: 'date',
				},
				{
					text: this.$t('trading.market'),
					value: 'market',
				},
				{ text: this.$t('trading.type'), value: 'side' },
				{
					text: this.$t('trading.amount'),
					value: 'size',
				},
				{ text: this.$t('trading.rate'), value: 'price' },
				{
					text: this.$t('trading.volume'),
					value: 'volume',
					sortable: false,
				},
				{
					text: this.$t('trading.filled'),
					value: 'percent',
				},
				{
					text: this.$t('trading.status'),
					value: 'status',
				},
				{
					text: this.$t('trading.actions'),
					value: 'action',
					sortable: false,
				},
			],
			footer_props: {
				'items-per-page-options': [5, 10, 15, 30, 50],
				'items-per-page-all-text': '50',
			},
			closeOnContentClick: true,
			cancelOptions: [
				{
					text: this.$t('trading.order.cancel_all'),
					link: '/trader/ext/order/cancel_all',
					click: () => this.orderCancelAll(),
				},
				{
					text: this.$t('trading.order.cancel_sl'),
					link: '/trader/ext/order/cancel_all_sl',
					click: () => this.orderCancelAllSL(),
				},
				{
					text: this.$t('trading.order.cancel_tp'),
					link: '/trader/ext/order/cancel_all_tp',
					click: () => this.orderCancelAllTP(),
				},
				{
					text: this.$t('trading.order.cancel_ts'),
					link: '/trader/ext/order/cancel_all_ts',
					click: () => this.orderCancelAllTS(),
				},
			],
		};
	},
	watch: {},
	computed: {
		ownOrderList() {
			return this.showOtherPairs
				? this.$store.state.user.orders
				: _.filter(this.$store.state.user.orders, {
					currency: this.currency.toUpperCase(),
					market: this.market.toUpperCase(),
				});
		},
	},
	methods: {
		volume: function(item) {
			return BigNumber(item.price)
				.times(BigNumber(item.actualSize))
				.toString();
		},
		percent(item) {
			if (item.status === 'partiallyFilled') {
				if (item.size === 0) {
					return 100;
				}
				return parseFloat(100 - (item.actualSize * 100) / item.size).toFixed(2);
			}
			if (item.status === 'accepted') {
				return 0;
			}
			return '';
		},
		size: function(item) {
			return BigNumber(item.actualSize).toString();
		},
		price: function(item) {
			return BigNumber(item.price).toString();
		},
		getDateFromTick(item) {
			return item.createdAt;
		},
		closeMenu(item) {
			item.menu = false;
		},
		orderCancel(item) {
			axios.post('/trader/ext/order/cancel', {
				order: item.id,
			});
		},
		orderCancelAll() {
			axios.post('/trader/ext/order/cancel_all', {
				market: this.market.toUpperCase(),
				currency: this.currency.toUpperCase(),
				all_pairs: this.showOtherPairs,
			});
		},
		orderCancelAllSL() {
			axios.post('/trader/ext/order/cancel_all_sl', {
				market: this.market.toUpperCase(),
				currency: this.currency.toUpperCase(),
				all_pairs: this.showOtherPairs,
			});
		},
		orderCancelAllTP() {
			axios.post('/trader/ext/order/cancel_all_tp', {
				market: this.market.toUpperCase(),
				currency: this.currency.toUpperCase(),
				all_pairs: this.showOtherPairs,
			});
		},
		orderCancelAllTS() {
			axios.post('/trader/ext/order/cancel_all_ts', {
				market: this.market.toUpperCase(),
				currency: this.currency.toUpperCase(),
				all_pairs: this.showOtherPairs,
			});
		},
	},
};
</script>

<style scoped></style>
