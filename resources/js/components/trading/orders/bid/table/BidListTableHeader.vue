<template>
	<thead class="bid-list-table-header">
		<tr>
			<th>
				<div class="bid-list-table-header__item--price">
					<span>{{ $t('table_header.rate') }}</span> <span>({{ market }})</span>
				</div>
			</th>

			<th>
				<div class="bid-list-table-header__item--amount">
					<span>{{ $t('table_header.amount') }}</span> <span>({{ currency }})</span>
				</div>
			</th>

			<th>
				<div
					class="bid-list-table-header__item--total text-end"
				>
					{{ $t('table_header.volume') }}
				</div>
			</th>
		</tr>
	</thead>
</template>

<script>
export default {
	name: 'BidListTableHeader',
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
