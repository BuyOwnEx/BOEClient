<template>
	<v-card class="own-history-deal-list own-list fill-height d-flex flex-column" elevation='0'>
		<v-card-title class="own-list__header pa-0">

			<v-spacer />

			<v-switch
				v-model="showOtherPairs"
				class="small-label-table-switch"
				:label="$t('trading.show_other_pairs')"
				hide-details
				dense
				left
				inset
			/>
		</v-card-title>

		<v-card-text class="own-history-deal-list__content pa-0 pt-1 flex-column flex-grow-1">
			<v-data-table
				:calculate-widths="true"
				:headers="headers"
				:items="ownDealList"
				:items-per-page="itemsPerPage"
				:footer-props="footerProps"
        mobile-breakpoint="600"
				dense
        fixed-header
        class="fill-height"
        style="position: relative"
			>
				<template #item.date="{ item }">
					<span class="table-date">
						{{ formatDate(item.created_at, 'trading') }}
					</span>
				</template>

				<template #item.pair="{ item }">
					<span> {{ item.currency.toUpperCase() }}/{{ item.market.toUpperCase() }} </span>
				</template>

				<template #item.side="{ item }">
					<strong :class="{ 'success--text': item.side, 'error--text': !item.side }">
						{{ item.side ? $t('trading.order.direction.buy') : $t('trading.order.direction.sell') }}
					</strong>
				</template>

				<template #item.size="{ item }">
					{{ formatSize(item.size, findScale(market, currency, 'amountScale')) }}
					{{ item.currency.toUpperCase() }}
				</template>

				<template #item.price="{ item }">
					{{ formatPrice(item.price, findScale(market, currency, 'rateScale')) }}
					{{ item.market.toUpperCase() }}
				</template>

				<template #item.volume="{ item }">
					{{ calculateVolume(item.price, item.size) }}
					{{ item.market.toUpperCase() }}
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import formatDate from '@/mixins/format/formatDate';
import formatSize from '@/mixins/trading/formatSize';
import formatPrice from '@/mixins/trading/formatPrice';
import calculateVolume from '@/mixins/trading/calculateVolume';
import findScale from '@/mixins/trading/findScale';

export default {
	name: 'OwnHistoryDealList',

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
		};
	},

	computed: {
		headers() {
			return [
				{
					text: this.$t('table_header.date'),
					align: 'start',
					sortable: true,
					value: 'date',
				},
				{
					text: this.$t('table_header.pair'),
					value: 'pair',
				},
				{ text: this.$t('table_header.type'), value: 'side' },
				{
					text: this.$t('table_header.amount'),
					value: 'size',
				},
				{ text: this.$t('table_header.rate'), value: 'price' },
				{
					text: this.$t('table_header.volume'),
					value: 'volume',
					sortable: false,
				},
			];
		},

		ownDealList() {
			return this.showOtherPairs
				? this.$store.state.user.deals
				: _.filter(this.$store.state.user.deals, {
						currency: this.currency.toUpperCase(),
						market: this.market.toUpperCase(),
				  });
		},
	},
};
</script>
<style scoped lang="scss">
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
