<template>
	<tbody v-if="historyData" class="hdl__content__table__body">
		<tr v-for="item in historyData" :key="item.id">
			<td>
				<div class="hdl__content__table__body__item--price">
					<strong
						:class="{
							'text-danger': item.side === true,
							'text-success': item.side === false,
						}"
					>
						{{ formatPrice(item.price, priceScale) }}
					</strong>
				</div>
			</td>
			<td>
				<div class="hdl__content__table__body__item--size">
					{{ formatSize(item.size, amountScale) }}
				</div>
			</td>
			<td>
				<div class="hdl__content__table__body__item--date">
					{{ formatDate(item.createdAt) }}
				</div>
			</td>
		</tr>

		<tr v-if="historyData !== null && historyData.length === 0">
			<td colspan="3" class="text-center">
				{{ $t('trading.no_deals') }}
			</td>
		</tr>
	</tbody>
</template>

<script>
import { mapState } from 'vuex';

import formatPrice from '../../../../mixins/trading/formatPrice';
import formatSize from '../../../../mixins/trading/formatSize';
import formatDate from '../../../../mixins/trading/formatDate';

export default {
	name: 'HistoryDealListTableBody',

	mixins: [formatPrice, formatSize, formatDate],

	props: {
		historyData: {
			type: Array,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
	},

	computed: {
		...mapState('tickers', ['markets']),

		priceScale() {
			const marketItem = this.markets[this.market.toUpperCase()];
			const currencyItem = marketItem.find(
				item => (item.currency = this.currency.toUpperCase())
			);

			return currencyItem.rateScale;
		},

		amountScale() {
			const marketItem = this.markets[this.market.toUpperCase()];
			const currencyItem = marketItem.find(
				item => (item.currency = this.currency.toUpperCase())
			);

			return currencyItem.amountScale;
		},
	},
};
</script>

<style scoped lang="sass">
.hdl
	&__content
		&__table
			&__body
				&__item
					&--rate
						text-align: left

					&--size
						text-align: left

					&--date
						text-align: right
						color: #a8a8a8
</style>
