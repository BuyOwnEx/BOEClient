<template>
	<div
		v-if='idx === selectedIdx'
		class='orders-tooltip'
		:class="{
			'd-none': idx !== selectedIdx,
			'orders-success': successColor,
			'orders-error': !successColor,
		}"
	>
		<div>index - {{ selectedIdx }}</div>
		<div>avgPrice - {{ averagePrice }}</div>
		<div>sumSize - {{ sumSize }}</div>
		<div>sumVolume - {{ sumVolume }}</div>
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
		successColor: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style scoped lang='sass'>
.orders-tooltip
	position: absolute
	top: 24px
	left: 0
	right: 0
	width: 150px
	height: 100px
	padding: 16px 8px
	z-index: 3

.orders-success
	background: var(--v-success-base)

.orders-error
	background: var(--v-error-base)
</style>
