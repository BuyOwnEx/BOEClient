<template>
	<div
		v-if='selectedRowIndex !== -1'
		class='orders-tooltip'
		:class="{ 'd-none': selectedRowIndex === -1 }"
		:style="{
			'margin-top': calculateMargin,
			right: calculateRight,
			left: calculateLeft,
		}"
	>
		<div
			v-if="activeTooltipType === 'bid' && type === 'bid'"
			class='orders-tooltip--bid'
		>
			<div class='d-flex'>
				<span>Average Price:</span>
				<b class='ml-auto'>{{ averagePrice }}</b>
			</div>
			<div class='d-flex'>
				<span>Total Size:</span>
				<b class='ml-auto'>{{ sumSize }}</b>
			</div>
			<div class='d-flex'>
				<span>Total Volume:</span>
				<b class='ml-auto'>{{ sumVolume }}</b>
			</div>
		</div>

		<div
			v-if="activeTooltipType === 'ask' && type === 'ask'"
			class='orders-tooltip--ask'
		>
			<div class='d-flex'>
				<span>Average Price:</span>
				<b class='ml-auto'>{{ averagePrice }}</b>
			</div>
			<div class='d-flex'>
				<span>Total Size:</span>
				<b class='ml-auto'>{{ sumSize }}</b>
			</div>
			<div class='d-flex'>
				<span>Total Volume:</span>
				<b class='ml-auto'>{{ sumVolume }}</b>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'OrdersTooltip',

	props: {
		type: {
			validator(value) {
				return ['ask', 'bid'].indexOf(value) !== -1;
			},
		},
	},

	computed: {
		...mapState('tooltip', [
			'selectedRowIndex',
			'averagePrice',
			'sumSize',
			'sumVolume',
			'activeTooltipType',
		]),

		calculateMargin() {
			const rowHeight = 25;
			const rowsSelected = this.selectedRowIndex;
			return rowsSelected * rowHeight + 'px';
		},
		calculateLeft() {
			if (this.type === 'bid') return 'calc(100% - 4px)';
		},
		calculateRight() {
			if (this.type === 'ask') return 'calc(100% - 4px)';
		},
	},
};
</script>

<style scoped lang='sass'>
.orders-tooltip
	position: absolute
	top: 35px
	width: 220px
	z-index: 3

	&--bid
		padding: 8px 16px
		background: var(--v-success-base)

	&--ask
		padding: 8px 16px
		background: var(--v-error-base)

@media screen and (max-width: 960px)
	.orders-tooltip
		display: none !important
</style>
