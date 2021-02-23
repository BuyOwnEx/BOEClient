<template>
	<div
		v-if='idx === selectedIdx'
		class='orders-tooltip'
		:class="{
			'orders-tooltip--bid': type === 'bid',
			'orders-tooltip--ask': type === 'ask',
			'd-none': idx !== selectedIdx,
		}"
		:style="{ 'margin-top': calculateTooltipMargin }"
	>
		<div class='orders-tooltip__content'>
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
export default {
	name: 'OrdersTooltip',

	props: {
		idx: {
			type: Number,
			required: true,
		},
		selectedIdx: {
			type: Number,
			required: true,
		},
		averagePrice: {
			type: [Number, String],
			required: true,
		},
		sumSize: {
			type: [Number, String],
			required: true,
		},
		sumVolume: {
			type: [Number, String],
			required: true,
		},
		type: {
			validator(value) {
				return ['ask', 'bid'].indexOf(value) !== -1;
			},
		},
	},

	computed: {
		calculateTooltipMargin() {
			const rowHeight = 25;
			const rowsSelected = this.selectedIdx;

			return rowsSelected * rowHeight + 'px';
		},
	},
};
</script>

<style scoped lang='sass'>
.orders-tooltip
	position: absolute
	top: 73px
	width: 160px
	height: 85px
	padding: 16px 8px
	z-index: 3

	&--bid
		background: var(--v-success-base)
		left: calc(100% - 12px)
		right: 0

	&--ask
		background: var(--v-error-base)
		right: calc(100% - 12px)


@media screen and (max-width: 960px)
	.orders-tooltip
		display: none !important
</style>
