<template>
	<div
		v-if="selectedRowIndex !== -1"
		class="orders-tooltip"
		:style="{
			transform: calculateMargin,
			right: calculateRight,
			left: calculateLeft,
			top: calculateTop,
			bottom: 0
		}"
	>
		<div v-if="showBid" class="orders-tooltip--bid">
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.avg_price') }}:</span>
				<b class="orders-tooltip__value">{{ averagePrice }}</b>
			</div>
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.total_size') }}:</span>
				<b class="orders-tooltip__value">{{ sumSize }}</b>
			</div>
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.total_volume') }}:</span>
				<b class="orders-tooltip__value">{{ sumVolume }}</b>
			</div>
		</div>

		<div v-if="showAsk" class="orders-tooltip--ask">
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.avg_price') }}:</span>
				<b class="orders-tooltip__value">{{ averagePrice }}</b>
			</div>
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.total_size') }}:</span>
				<b class="orders-tooltip__value">{{ sumSize }}</b>
			</div>
			<div class="d-flex">
				<span>{{ $t('trading.orders_tooltip.total_volume') }}:</span>
				<b class="orders-tooltip__value">{{ sumVolume }}</b>
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
		...mapState('tooltip', ['selectedRowIndex', 'averagePrice', 'sumSize', 'sumVolume', 'activeTooltipType']),

		calculateMargin() {
			const rowHeight = 25;
      const tooltipHeight = 80;
			const lastRowSelectedIndex = this.selectedRowIndex;
      if(this.showAsk)
      {
        const calculatedMargin = tooltipHeight - (lastRowSelectedIndex + 1) * rowHeight + 'px';
        return `translateY(${calculatedMargin})`;
      }
      else
      {
        const calculatedMargin = (lastRowSelectedIndex - 1) * rowHeight + 'px';
        return `translateY(${calculatedMargin})`;
      }
		},
    isWidthBetween1264And1628() {
      return this.$vuetify.breakpoint.width > 1264 && this.$vuetify.breakpoint.width <= 1628;
    },
    isWidthBetween960And1264() {
      return this.$vuetify.breakpoint.width > 960 && this.$vuetify.breakpoint.width <= 1264;
    },
    isWidthLess1264() {
      return this.$vuetify.breakpoint.width <= 1264;
    },
		calculateLeft() {
			if(this.type === 'bid' && !this.isWidthLess1264) return '100%';
		},
		calculateRight() {
			if (this.type === 'ask' && !this.isWidthLess1264) return '100%';
		},
    calculateTop() {
      if (this.type === 'bid' && this.isWidthBetween1264And1628) return '-30px';
      else if (this.type === 'bid' && this.isWidthLess1264) return '-30px';
      else if (this.type === 'bid') return '25px';
    },

		showAsk() {
			const activeNowAskTooltip = this.activeTooltipType === 'ask';
			const typePropIsAsk = this.type === 'ask';
			return activeNowAskTooltip && typePropIsAsk;
		},
		showBid() {
			const activeNowBidTooltip = this.activeTooltipType === 'bid';
			const typePropIsBid = this.type === 'bid';
			return activeNowBidTooltip && typePropIsBid;
		},
	},
};
</script>

<style scoped lang="sass">
.orders-tooltip
	position: absolute
	width: 250px
	height: 80px
	z-index: 3

	&--bid
		height: 80px
		padding: 8px 16px
		background: #defbec
	&--ask
		height: 80px
		padding: 8px 16px
		background: rgb(255, 223, 223)

	&__value
		margin-left: auto

.v-application--is-rtl
	.orders-tooltip__value
			margin-right: auto
			margin-left: 0

.theme--dark
	.orders-tooltip
		&--bid
			background: #4a724b !important
		&--ask
			background: #724a4a !important

@media screen and (max-width: 959px)
	.orders-tooltip
		left: 0 !important
		right: 0 !important
		margin-left: auto
		margin-right: auto
</style>
