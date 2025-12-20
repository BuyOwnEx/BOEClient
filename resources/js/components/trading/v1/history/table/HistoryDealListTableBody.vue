<template>
	<tbody v-if="historyData" class="history-deal-list-table-body">
		<tr v-for="item in historyData" :key="item.id">
			<td>
				<div class="history-deal-list-table-body__item--price">
					<strong
						:class="{
							'error--text': item.side === true,
							'success--text': item.side === false,
						}"
					>
						{{ formatPrice(item.price, getPriceScale) }}
					</strong>
				</div>
			</td>

			<td>
				<div class="history-deal-list-table-body__item--size">
					{{ formatSize(item.size, getAmountScale) }}
				</div>
			</td>

			<td>
				<div class="history-deal-list-table-body__item--date table-date">
					{{ formatDate(item.created_at, 'trading') }}
				</div>
			</td>
		</tr>
	</tbody>
</template>

<script>
import formatPrice from '@/mixins/trading/formatPrice';
import formatSize from '@/mixins/trading/formatSize';
import formatDate from '@/mixins/format/formatDate';
import getPriceScale from '@/mixins/trading/getPriceScale';
import getAmountScale from '@/mixins/trading/getAmountScale';

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
.history-deal-list-table-body
	&__item--date
		text-align: end
</style>
