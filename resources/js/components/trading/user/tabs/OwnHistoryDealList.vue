<template>
	<v-card class="own-history-deal-list pa-1">
		<v-card-title class="own-history-deal-list__header trading-component-title pa-0">
			<span>
				{{ $t('trading.headers.own_history_deal_list') }}
			</span>

			<v-spacer />

			<v-switch
				v-model="showOtherPairs"
				:label="$t('trading.show_other_pairs')"
				hide-details
				dense
				left
				inset
			/>
		</v-card-title>

		<v-card-text class="own-history-deal-list__content pa-0 pt-1">
			<v-data-table
				:calculate-widths="true"
				:headers="headers"
				:items="ownDealList"
				:items-per-page="itemsPerPage"
				:footer-props="footerProps"
				dense
			>
				<template v-slot:item.date="{ item }">
					<span class="table-date">
						{{ formatDate(item.createdAt) }}
					</span>
				</template>

				<template v-slot:item.pair="{ item }">
					<span>
						{{ item.currency.toUpperCase() }}/{{ item.market.toUpperCase() }}
					</span>
				</template>

				<template v-slot:item.side="{ item }">
					<strong
						:class="{ 'text-success': item.side, 'text-danger': !item.side }"
					>
						{{
							item.side
								? $t('trading.order.direction.buy')
								: $t('trading.order.direction.sell')
						}}
					</strong>
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
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import OwnListConfirmDialog from '../common/OwnListConfirmDialog';
import confirmDialog from '../../../../mixins/trading/confirmDialog';

import formatDate from '../../../../mixins/trading/formatDate';
import formatSize from '../../../../mixins/trading/formatSize';
import formatPrice from '../../../../mixins/trading/formatPrice';
import calculateVolume from '../../../../mixins/trading/calculateVolume';
import findScale from '../../../../mixins/trading/findScale';

export default {
	name: 'OwnHistoryDealList',

	components: { OwnListConfirmDialog },

	mixins: [
		formatDate,
		formatSize,
		formatPrice,
		calculateVolume,
		findScale,
		confirmDialog,
	],

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
			],
			footerProps: {
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
};
</script>

<style scoped lang="sass">
.own-history-deal-list
	&__header
		margin-left: 4px
</style>