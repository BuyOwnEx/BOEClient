<template>
	<v-card class="own-active-order-list own-list pa-1 fill-height d-flex flex-column" elevation="0">
		<v-card-title class="own-list__header pa-0">

			<v-spacer />

			<v-switch
				v-model="showOtherPairs"
				class="small-label-table-switch"
				:class="[$vuetify.rtl ? 'ml-3' : 'mr-3']"
				:label="$t('trading.show_other_pairs')"
				hide-details
				dense
				left
				inset
			/>

			<v-menu v-model="isCancelMenu" transition="slide-y-transition" content-class="small-text-menu" bottom>
				<template #activator="{ on, attrs }">
					<v-btn
						:class="[$vuetify.rtl ? 'mr-auto' : 'ml-auto']"
						color="#A6A6A6"
						v-bind="attrs"
						v-on="on"
						text
						tile
						small
					>
						{{ $t('common.cancel') }}
						<v-icon right>mdi-chevron-down</v-icon>
					</v-btn>
				</template>

				<v-list dense>
					<CommonDialog
              confirm-color="error"
              header-color="error"
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

		<v-card-text class="own-active-order-list__content pa-0 pt-1 flex-column flex-grow-1">
			<v-data-table
				:calculate-widths="true"
				:headers="headers"
				:items="ownOrderList"
				:items-per-page="itemsPerPage"
				:footer-props="footerProps"
				mobile-breakpoint="720"
				dense
        fixed-header
        class="fill-height"
        style="position: relative"
			>
        <template #item.id="{ item }">
					<span class="table-date">
						#{{ item.id }}
					</span>
        </template>

				<template #item.date="{ item }">
					<span class="table-date">
						{{ formatDate(item.created_at, 'trading') }}
					</span>
				</template>

				<template #item.pair="{ item }">
					<span> {{ item.currency.toUpperCase() }}/{{ item.market.toUpperCase() }} </span>
				</template>

				<template #item.side="{ item }">
					<span v-if="item.side === false">
						<strong class="success--text">
							{{ $t('trading.order.direction.buy') }}
						</strong>
					</span>
					<span v-else>
						<strong class="error--text">
							{{ $t('trading.order.direction.sell') }}
						</strong>
					</span>

					<span v-if="item.type === 'STOPLOSS'" class="own-active-order-list__type own-active-order-list__type--sl">
						SL
					</span>

					<span v-if="item.type === 'TAKEPROFIT'" class="own-active-order-list own-active-order-list__type--tp">
						TP
					</span>

					<span v-if="item.type === 'TRAILINGSTOP'" class="own-active-order-list own-active-order-list__type--ts">
						TS
					</span>
				</template>

				<template #item.size="{ item }">
          <span v-if="item.type === 'STOPLOSS' && !item.side">
            {{ formatSize(item.size, findScale(market, currency, 'rateScale')) }}
					  {{ item.market.toUpperCase() }}
          </span>
          <span v-else-if="item.type === 'TAKEPROFIT' && !item.side">
            {{ formatSize(item.size, findScale(market, currency, 'rateScale')) }}
					  {{ item.market.toUpperCase() }}
          </span>
          <span v-else-if="item.type === 'TRAILINGSTOP' && !item.side">
            {{ formatSize(item.size, findScale(market, currency, 'rateScale')) }}
					  {{ item.market.toUpperCase() }}
          </span>
          <span v-else>
            {{ formatSize(item.size, findScale(market, currency, 'amountScale')) }}
					  {{ item.currency.toUpperCase() }}
          </span>
				</template>

				<template #item.price="{ item }">
          <span v-if="item.type === 'LIMIT'">{{ formatPrice(item.price, findScale(market, currency, 'rateScale')) }} {{ item.market.toUpperCase() }}</span>
					<span v-else>-</span>
				</template>

				<template #item.volume="{ item }">
          <span v-if="item.type === 'LIMIT'">{{ calculateVolume(item.price, item.size) }} {{ item.market.toUpperCase() }}</span>
          <span v-else>-</span>
				</template>

				<template #item.percent="{ item }">
          <span>{{ percent(item) }}%</span>
          <span v-if="item.type !== 'LIMIT'">
              <CommonTooltip>
                <v-icon color="secondary" x-small class="help-tooltip align-center">
                  mdi-help-circle
                </v-icon>
                <template #text>
                  <span v-if="item.type === 'STOPLOSS'">
                    {{ $t('trading.orders_tooltip.sl_tooltip',{
                    price: formatPrice(item.price, findScale(market, currency, 'rateScale')),
                    currency: item.market.toUpperCase()
                  }) }}
                  </span>
                  <span v-if="item.type === 'TAKEPROFIT'">
                    {{ $t('trading.orders_tooltip.tp_tooltip',{
                    price: formatPrice(item.price, findScale(market, currency, 'rateScale')),
                    currency: item.market.toUpperCase()
                  }) }}
                  </span>
                  <span v-if="item.type === 'TRAILINGSTOP' && item.side">
                    {{ $t('trading.orders_tooltip.sell_ts_tooltip',{
                    price: formatPrice(item.price, findScale(market, currency, 'rateScale')),
                    currency: item.market.toUpperCase(),
                    offset: formatPrice(item.offset, findScale(market, currency, 'rateScale'))
                  }) }}
                  </span>
                  <span v-if="item.type === 'TRAILINGSTOP' && !item.side">
                    {{ $t('trading.orders_tooltip.buy_ts_tooltip',{
                    price: formatPrice(item.price, findScale(market, currency, 'rateScale')),
                    currency: item.market.toUpperCase(),
                    offset: formatPrice(item.offset, findScale(market, currency, 'rateScale'))
                  }) }}
                  </span>
                </template>
              </CommonTooltip>
            </span>
        </template>

				<template #item.status="{ item }">
					<span class="success--text" v-if="item.status === 'accepted'">
						{{ $t('trading.order.status.accepted') }}
					</span>
					<span class="warning--text" v-else>
						{{ $t('trading.order.status.partiallyFilled') }}
					</span>
				</template>

				<template #item.action="{ item }">
          <CommonTooltip :value="$t('common.cancel')">
            <CommonDialog
                confirm-color="error"
                header-color="error"
                @confirm="orderCancel(item)"
            >
              <template #default>
                <v-btn icon plain x-small>
                  <v-icon x-small color="error">mdi-close</v-icon>
                </v-btn>
              </template>

              <template #title>
                {{ $t('trading.order.cancel_title') }}
              </template>

              <template #content>
                {{ $t('trading.order.cancel_one') }}
              </template>
            </CommonDialog>
          </CommonTooltip>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import CommonTooltip from '@/components/common/CommonTooltip.vue'
import formatDate from '@/mixins/format/formatDate';
import calculateVolume from '@/mixins/trading/calculateVolume';
import findScale from '@/mixins/trading/findScale';
import formatSize from '@/mixins/trading/formatSize';
import formatPrice from '@/mixins/trading/formatPrice';

export default {
	name: 'OwnActiveOrderList',

	components: {
    CommonTooltip,
		CommonDialog: () => import('@/components/common/CommonDialog.vue'),
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
			footerProps: {
				'items-per-page-options': [5, 10, 15, 30, 50],
				'items-per-page-all-text': '50',
			},
			isCancelMenu: false,
		};
	},

	computed: {
		headers() {
			return [
        { text: 'ID', align: 'start', sortable: true, value: 'id' },
				{ text: this.$t('table_header.date'), align: 'start', sortable: true, value: 'date' },
				{ text: this.$t('table_header.market'), value: 'pair' },
				{ text: this.$t('table_header.type'), value: 'side' },
				{ text: this.$t('table_header.amount'), value: 'size' },
				{ text: this.$t('table_header.rate'), value: 'price' },
				{ text: this.$t('table_header.volume'), value: 'volume', sortable: false },
				{ text: this.$t('table_header.filled'), value: 'percent', align: this.isWidthLess1520px ? ' d-none' : '' },
				{ text: this.$t('table_header.status'), value: 'status' },
				{ text: this.$t('table_header.actions'), value: 'action', align: 'center', sortable: false },
			];
		},
    isWidthLess1520px() {
      return this.$vuetify.breakpoint.width < 1520;
    },
		cancelOptions() {
			return [
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
			];
		},

		ownOrderList() {
			return this.showOtherPairs
				? this.$store.state.user.orders
				: _.filter(this.$store.state.user.orders, {
						currency: this.currency.toUpperCase(),
						market: this.market.toUpperCase(),
				  });
		},

		closePositionPayload() {
			return {
				market: this.market.toUpperCase(),
				currency: this.currency.toUpperCase(),
				all_pairs: this.showOtherPairs,
			};
		},
	},

	methods: {
		orderCancel(item) {
			axios.post('/trader/ext/order/cancel', {
				order: item.id,
			});
		},
		orderCancelAll() {
			axios.post('/trader/ext/order/cancel_all', this.closePositionPayload);
		},
		orderCancelAllSL() {
			axios.post('/trader/ext/order/cancel_all_sl', this.closePositionPayload);
		},
		orderCancelAllTP() {
			axios.post('/trader/ext/order/cancel_all_tp', this.closePositionPayload);
		},
		orderCancelAllTS() {
			axios.post('/trader/ext/order/cancel_all_ts', this.closePositionPayload);
		},

		percent(item) {
			if (item.status === 'partiallyFilled') {
				if (item.size === 0) {
					return 100;
				}
				return parseFloat(100 - (item.actual_size * 100) / item.size).toFixed(2);
			}
			if (item.status === 'accepted') {
				return 0;
			}
			return '';
		},
		closeMenu(item) {
			item.menu = false;
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
<style scoped lang="scss">
.help-tooltip {
  vertical-align: baseline;
  margin-left: 2px;
  font-size: inherit;
  line-height: inherit
}
::v-deep .v-data-table__wrapper {
  position: absolute;
  width: 100%;
  overflow-y: auto;
  height: calc(100% - 60px);
}
::v-deep .v-data-footer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
}
</style>