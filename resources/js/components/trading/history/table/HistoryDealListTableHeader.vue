<template>
	<thead class="history-deal-list-table-header">
		<tr>
			<th>
				<div class="history-deal-list-table-header__item--rate">
					<span>{{ $t('table_header.rate') }}</span>
					<span>({{ market }})</span>
				</div>
			</th>

			<th>
				<div class="history-deal-list-table-header__item--amount">
					<span>{{ $t('table_header.amount') }}</span>
					<span>({{ currency }})</span>
				</div>
			</th>

			<th>
				<div class="history-deal-list-table-header__item--date">
					{{ $t('table_header.date') }}
				</div>
			</th>
		</tr>
	</thead>
</template>

<script>
export default {
	name: 'HistoryDealListTableHeader',

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
};
</script>

<style scoped lang="sass">
.history-deal-list-table-header
	&__item--date
		text-align: end
</style>
