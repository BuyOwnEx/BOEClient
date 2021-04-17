<template>
	<v-card class="own-active-order-list pa-1">
		<v-card-title class="own-list__header pa-0">
			<span class="own-list__title component-title">
				{{ $t('trading.headers.own_active_order_list') }}
			</span>

			<v-spacer />

			<v-switch
				v-model="showOtherPairs"
				class="small-label-table-switch mr-3"
				:label="$t('trading.show_other_pairs')"
				hide-details
				dense
				left
				inset
			/>
			<v-menu
				v-model="isCancelMenu"
				transition="slide-y-transition"
				content-class="small-text-menu"
				bottom
			>
				<template v-slot:activator="{ on, attrs }">
					<v-btn
						class="mr-1"
						color="#A6A6A6"
						v-bind="attrs"
						v-on="on"
						text
						tile
						small
					>
						{{ $t('trading.cancel') }}
						<v-icon right>mdi-chevron-down</v-icon>
					</v-btn>
				</template>

				<v-list dense>
					<CommonDialog
						v-for="item in cancelOptions"
						:key="item.text"
						@confirm="handleCancelConfirm(item)"
					>
						<template #default>
							<v-list-item @click="closeCancelMenu">
								<v-list-item-title>{{ item.text }}</v-list-item-title>
							</v-list-item>
						</template>

						<template #title>
							{{ $t('trading.order.cancel_title') }}
						</template>

						<template #content>
							{{ $t('trading.order.cancel_many', { type: item.type }) }}
						</template>
					</CommonDialog>
				</v-list>
			</v-menu>
		</v-card-title>

		<v-card-text class="own-active-order-list__content pa-0 pt-1">
			<v-data-table
				:calculate-widths="true"
				:headers="headers"
				:items="ownOrderList"
				:items-per-page="itemsPerPage"
				:footer-props="footerProps"
				dense
			>
				<template v-slot:item.date="{ item }">
					<span class="table-date">
						{{ formatDate(item.createdAt, 'trading') }}
					</span>
				</template>

				<template v-slot:item.pair="{ item }">
					<span>
						{{ item.currency.toUpperCase() }}/{{ item.market.toUpperCase() }}
					</span>
				</template>

				<template v-slot:item.side="{ item }">
					<span v-if="item.side === false">
						<strong class="text-success">
							{{ $t('trading.order.direction.buy') }}
						</strong>
					</span>
					<span v-else>
						<strong class="text-danger">
							{{ $t('trading.order.direction.sell') }}
						</strong>
					</span>

					<span
						v-if="item.type === 'STOPLOSS'"
						class="own-active-order-list__type own-active-order-list__type--sl"
					>
						SL
					</span>

					<span
						v-if="item.type === 'TAKEPROFIT'"
						class="own-active-order-list own-active-order-list__type--tp"
					>
						TP
					</span>

					<span
						v-if="item.type === 'TRAILINGSTOP'"
						class="own-active-order-list own-active-order-list__type--ts"
					>
						TS
					</span>
				</template>

				<template v-slot:item.size="{ item }">
					{{
						formatSize(item.size, findScale(market, currency, 'amountScale'))
					}}
					{{ item.currency.toUpperCase() }}
				</template>

				<template v-slot:item.price="{ item }">
					{{
						formatPrice(item.price, findScale(market, currency, 'rateScale'))
					}}
					{{ item.market.toUpperCase() }}
				</template>

				<template v-slot:item.volume="{ item }">
					{{ calculateVolume(item.price, item.size) }}
					{{ item.market.toUpperCase() }}
				</template>

				<template v-slot:item.percent="{ item }">
					{{ percent(item) }}%
				</template>

				<template v-slot:item.status="{ item }">
					<span class="text-success" v-if="item.status === 'accepted'">
						{{ $t('trading.order.status.accepted') }}
					</span>
					<span class="text-warning" v-else>
						{{ $t('trading.order.status.partiallyFilled') }}
					</span>
				</template>

				<template v-slot:item.action="{ item }">
					<CommonDialog @confirm="orderCancel(item)">
						<template #default>
							<v-btn
								color="rgba(148, 148, 148, 0.14)"
								elevation="0"
								tile
								x-small
								dense
							>
								<v-icon class="own-active-order-list__cancel-icon" x-small>
									mdi-close
								</v-icon>
								<span class="own-active-order-list__cancel-text">
									{{ $t('trading.cancel') }}
								</span>
							</v-btn>
						</template>

						<template #title>
							{{ $t('trading.order.cancel_title') }}
						</template>

						<template #content>
							{{ $t('trading.order.cancel_one') }}
						</template>
					</CommonDialog>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import formatDate from '../../../../mixins/format/formatDate';
import calculateVolume from '../../../../mixins/trading/calculateVolume';
import findScale from '../../../../mixins/trading/findScale';
import formatSize from '../../../../mixins/trading/formatSize';
import formatPrice from '../../../../mixins/trading/formatPrice';

export default {
	name: 'OwnActiveOrderList',

	components: {
		CommonDialog: () =>
			import(/* webpackPrefetch: true */ '../../../common/CommonDialog'),
	},

	mixins: [formatDate, formatSize, formatPrice, calculateVolume, findScale],

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			showOtherPairs: false,
			itemsPerPage: 10,
			headers: [
				{
					text: this.$t('trading.date'),
					align: 'start',
					sortable: true,
					value: 'date',
				},
				{
					text: this.$t('trading.market'),
					value: 'pair',
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
			footerProps: {
				'items-per-page-options': [5, 10, 15, 30, 50],
				'items-per-page-all-text': '50',
			},
			closeOnContentClick: true,
			cancelOptions: [
				{
					text: this.$t('trading.order.cancel_all'),
					type: '',
					link: '/trader/ext/order/cancel_all',
					click: () => this.orderCancelAll(),
				},
				{
					text: this.$t('trading.order.cancel_by_type', { type: 'SL' }),
					type: 'SL',
					link: '/trader/ext/order/cancel_all_sl',
					click: () => this.orderCancelAllSL(),
				},
				{
					text: this.$t('trading.order.cancel_by_type', { type: 'TP' }),
					type: 'TP',
					link: '/trader/ext/order/cancel_all_tp',
					click: () => this.orderCancelAllTP(),
				},
				{
					text: this.$t('trading.order.cancel_by_type', { type: 'TS' }),
					type: 'TS',
					link: '/trader/ext/order/cancel_all_ts',
					click: () => this.orderCancelAllTS(),
				},
			],
			isCancelMenu: false,
		};
	},

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

		handleCancelConfirm(item) {
			this.closeCancelMenu();
			item.click();
		},
		closeCancelMenu() {
			this.isCancelMenu = false;
		},
	},
};
</script>

<style scoped lang="sass">
.own-active-order-list
	&__cancel
		&-icon
			opacity: 0.6
			margin-right: 2px
		&-text
			opacity: 0.8
</style>
