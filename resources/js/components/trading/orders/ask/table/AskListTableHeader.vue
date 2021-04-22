<template>
	<thead class="ask-table-header">
		<tr v-if="$vuetify.breakpoint.mdAndUp">
			<th>
				<div class="ask-table-header__item--total">
					{{ $t('table_header.volume') }}
				</div>
			</th>
			<th>
				<div class="ask-table-header__item--amount">
					<span>{{ $t('table_header.amount') }}</span>
					<span>({{ currency }})</span>
				</div>
			</th>
			<th>
				<div
					class="ask-table-header__item--price text-end"
				>
					<span>{{ $t('table_header.rate') }}</span>
					<span>({{ market }})</span>
				</div>
			</th>
		</tr>

		<tr v-else>
			<th>
				<div class="ask-table-header__item--price">
					<span>{{ $t('table_header.rate') }}</span>
					<span>({{ market }})</span>
				</div>
			</th>
			<th>
				<div class="ask-table-header__item--amount">
					<span>{{ $t('table_header.amount') }}</span>
					<span>({{ currency }})</span>
				</div>
			</th>
			<th>
				<div
					class="ask-table-header__item--total text-end"
				>
					{{ $t('table_header.volume') }}
				</div>
			</th>
		</tr>
	</thead>
</template>

<script>
export default {
	name: 'AskListTableHeader',
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
