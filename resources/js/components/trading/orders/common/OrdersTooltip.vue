<template>
	<div
		v-if="selectedRowIndex !== -1"
		class="orders-tooltip"
		:class="{ 'd-none': selectedRowIndex === -1 }"
		:style="{
			'margin-top': calculateMargin,
			right: calculateRight,
			left: calculateLeft,
		}"
	>
		<div
			v-if="activeTooltipType === 'bid' && type === 'bid'"
			class="orders-tooltip--bid"
		>
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.avg_price') }}:</span>
				<b class="ml-auto">{{ averagePrice }}</b>
			</div>
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.total_size') }}:</span>
				<b class="ml-auto">{{ sumSize }}</b>
			</div>
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.total_volume') }}:</span>
				<b class="ml-auto">{{ sumVolume }}</b>
			</div>
		</div>

		<div
			v-if="activeTooltipType === 'ask' && type === 'ask'"
			class="orders-tooltip--ask"
		>
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.avg_price') }}:</span>
				<b class="ml-auto">{{ averagePrice }}</b>
			</div>
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.total_size') }}:</span>
				<b class="ml-auto">{{ sumSize }}</b>
			</div>
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.total_volume') }}:</span>
				<b class="ml-auto">{{ sumVolume }}</b>
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
			const lastRowSelectedIndex = this.selectedRowIndex;
			return (lastRowSelectedIndex - 2) * rowHeight + 'px';
		},
		calculateLeft() {
			if (this.type === 'bid') return '100%';
		},
		calculateRight() {
			if (this.type === 'ask') return '100%';
		},
	},
};
</script>

<style scoped lang="sass">
.orders-tooltip
	position: absolute
	top: 29px
	width: 250px
	z-index: 3

	&--bid
		padding: 8px 16px
		background: #defbec

	&--ask
		padding: 8px 16px
		background: rgb(255, 223, 223)

.theme--dark
	.orders-tooltip
		&--bid
			background: #4a724b !important
		&--ask
			background: #724a4a !important

@media screen and (max-width: 960px)
	.orders-tooltip
		top: 29px
		left: 0 !important
		right: 0 !important
		margin-left: auto
		margin-right: auto
</style>
