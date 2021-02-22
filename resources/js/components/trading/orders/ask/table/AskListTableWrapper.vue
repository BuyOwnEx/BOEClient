<template>
	<div class='ask-list__absolute-table-wrapper'>
		<v-simple-table
			class='ask-list__content__table'
			:height='calculateTableHeight'
			dense
			fixed-header
		>
			<template v-slot:default>
				<OrdersTableHeader :currency='currency' :market='market' />
				<AskListTableBody
					:ask-data='askData'
					:amount-depth='amountDepth'
					:volume-depth='volumeDepth'
					:best='best'
				/>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
import OrdersTableHeader from '../../OrdersTableHeader';
import AskListTableBody from './AskListTableBody';

export default {
	name: 'AskListTableWrapper',

	components: { AskListTableBody, OrdersTableHeader },

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
		askData: {
			type: Array,
			required: true,
		},
		amountDepth: {
			type: Number,
			required: true,
		},
		volumeDepth: {
			type: Number,
			required: true,
		},
		best: {
			type: Number,
			required: true,
		},
	},

	computed: {
		calculateTableHeight() {
			const deviceWidth = this.$vuetify.breakpoint.width;
			const mobile = deviceWidth <= 960;
			const mid = deviceWidth > 960 && deviceWidth <= 1264;
			const mid2 = deviceWidth > 1264 && deviceWidth <= 1382;
			const mid3 = deviceWidth > 1382 && deviceWidth <= 1768;

			if (mobile) return 281;
			else if (mid) return 206;
			else if (mid2) return 206;
			else if (mid3) return 206;
			else return 408;
		},
	},
};
</script>

<style scoped lang='sass'>
.ask-list
	&__absolute-table-wrapper
		overflow-y: hidden
		position: absolute
		top: 46px
		bottom: 12px
		left: 0
		right: 0
</style>
