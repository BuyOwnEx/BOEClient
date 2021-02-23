<template>
	<thead class='bid-table-header'>
	<tr>
		<th>
			<div class='bid-table-header__item--price'>
				<span>{{ $t('trading.rate') }}</span>
				<span>({{ market }})</span>
			</div>
		</th>

		<th>
			<div class='bid-table-header__item--amount'>
				<span>{{ $t('trading.amount') }}</span>
				<span>({{ currency }})</span>
			</div>
		</th>

		<th>
			<div class='bid-table-header__item--total'>
				{{ $t('trading.volume') }}
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
