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
						{{ formatPrice(item.price, getPriceScale) }}
					</strong>
				</div>
			</td>
			<td>
				<div class="hdl__content__table__body__item--size">
					{{ formatSize(item.size, getAmountScale) }}
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
import formatPrice from '../../../../mixins/trading/formatPrice';
import formatSize from '../../../../mixins/trading/formatSize';
import formatDate from '../../../../mixins/trading/formatDate';
import getPriceScale from '../../../../mixins/trading/getPriceScale';
import getAmountScale from '../../../../mixins/trading/getAmountScale';

export default {
	name: 'HistoryDealListTableBody',

	mixins: [formatPrice, formatSize, formatDate, getPriceScale, getAmountScale],

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
