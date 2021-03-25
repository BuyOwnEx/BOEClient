<template>
	<span>
		<span
			v-if="type === 'bid'"
			class="orders-wall--bid"
			:style="{ transform: calculateMargin, left: calculateLength }"
		/>

		<span
			v-if="type === 'ask' && !isMobile"
			class="orders-wall--ask"
			:style="{ transform: calculateMargin, right: calculateLength }"
		/>
		<span
			v-if="type === 'ask' && isMobile"
			class="orders-wall--ask"
			:style="{ transform: calculateMargin, left: calculateLength }"
		/>
	</span>
</template>

<script>
export default {
	name: 'OrdersWall',

	props: {
		itemIndex: {
			type: Number,
			required: true,
		},
		volume: {
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
		calculateMargin() {
			const rowHeight = 25;
			const rowsSelected = this.itemIndex;
			const calculatedMargin = rowsSelected * rowHeight + 'px';

			return `translateY(${calculatedMargin})`;
		},
		calculateLength() {
			let volumeDepth = 0;
			if (this.type === 'bid') volumeDepth = this.bidVolumeDepth;
			else if (this.type === 'ask') volumeDepth = this.askVolumeDepth;

			const percent = (this.volume / volumeDepth) * 100 + '%';
			const tablePadding = '4px';
			return `calc(100% - ${percent} - ${tablePadding})`;
		},

		bidVolumeDepth() {
			return this.$store.state.trading.bid_volume_depth;
		},
		askVolumeDepth() {
			return this.$store.state.trading.ask_volume_depth;
		},

		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},
	},
};
</script>

<style scoped lang="sass">
.orders-wall-main
	position: absolute
	top: 32px
	bottom: 0
	height: 25px

.orders-wall--bid
	@extend .orders-wall-main
	background: rgba(146, 245, 150, 0.2)
	right: 0
	left: 0

.orders-wall--ask
	@extend .orders-wall-main
	background: rgba(245, 146, 146, 0.2)
	left: 0
	right: 0
</style>
