<template>
	<thead class="ask-table-header">
		<tr v-if="$vuetify.breakpoint.mdAndUp">
			<th>
				<div class="ask-table-header__item--total">
					{{ $t('trading.volume') }}
				</div>
			</th>
			<th>
				<div class="ask-table-header__item--amount">
					<span>{{ $t('trading.amount') }}</span>
					<span>({{ currency }})</span>
				</div>
			</th>
			<th>
				<div
					class="ask-table-header__item--price"
					:class="[$vuetify.rtl ? 'text-left' : 'text-right']"
				>
					<span>{{ $t('trading.rate') }}</span>
					<span>({{ market }})</span>
				</div>
			</th>
		</tr>

		<tr v-else>
			<th>
				<div class="ask-table-header__item--price">
					<span>{{ $t('trading.rate') }}</span>
					<span>({{ market }})</span>
				</div>
			</th>
			<th>
				<div class="ask-table-header__item--amount">
					<span>{{ $t('trading.amount') }}</span>
					<span>({{ currency }})</span>
				</div>
			</th>
			<th>
				<div
					class="ask-table-header__item--total"
					:class="[$vuetify.rtl ? 'text-left' : 'text-right']"
				>
					{{ $t('trading.volume') }}
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
