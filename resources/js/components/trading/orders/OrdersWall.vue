<template>
	<span>
		<span
			v-if="type === 'bid'"
			class='orders-wall--bid'
			:style="{ 'margin-top': calculateMargin, left: calculateLength }"
		>
		</span>
		<span
			v-if="type === 'ask'"
			class='orders-wall--ask'
			:style="{ 'margin-top': calculateMargin, right: calculateLength }"
		>
		</span>
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
		volumeDepth: {
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
			return rowsSelected * rowHeight + 'px';
		},
		calculateLength() {
			const percent = (this.volume / this.volumeDepth) * 100 + '%';
			const tablePadding = '4px';
			return `calc(100% - ${percent} - ${tablePadding})`;
		},
	},
};
</script>

<style scoped lang='sass'>
.orders-wall-main
	position: absolute
	top: 35.65px
	bottom: 0
	height: 25px

.orders-wall--bid
	@extend .orders-wall-main
	background: rgba(146, 245, 150, 0.2)
	right: 4px

.orders-wall--ask
	@extend .orders-wall-main
	background: rgba(245, 146, 146, 0.2)
	left: 4px
</style>
