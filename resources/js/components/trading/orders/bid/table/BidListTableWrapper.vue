<template>
	<v-simple-table
		class='bid-list__content__table'
		:height='calculateTableHeight'
		dense
		fixed-header
	>
		<template v-slot:default>
			<BidListTableHeader :currency='currency' :market='market' />
			<BidListTableBody
				:bid-data='bidData'
				:amount-depth='amountDepth'
				:volume-depth='volumeDepth'
				:best='best'
			/>
		</template>
	</v-simple-table>
</template>

<script>
import BidListTableBody from './BidListTableBody';
import BidListTableHeader from './BidListTableHeader';

export default {
	name: 'BidListTableWrapper',

	components: { BidListTableHeader, BidListTableBody },

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
		bidData: {
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

<style scoped lang='sass'></style>