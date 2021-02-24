<template>
	<div class='ask-list-table-absolute-wrapper'>
		<v-simple-table
			class='ask-list__content__table'
			:height='calculateTableHeight'
			dense
			fixed-header
		>
			<template v-slot:default>
				<AskListTableHeader :currency='currency' :market='market' />
				<AskListTableBody
					:orders-data='ordersData'
					:amount-depth='amountDepth'
					:volume-depth='volumeDepth'
					:best='best'
				/>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
import AskListTableBody from './AskListTableBody';
import AskListTableHeader from './AskListTableHeader';

export default {
	name: 'AskListTableWrapper',

	components: { AskListTableHeader, AskListTableBody },

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
		ordersData: {
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
.ask-list-table-absolute-wrapper
	position: absolute
	top: 0
	right: 0
	left: 0
	overflow: hidden

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.ask-list-table-absolute-wrapper
		bottom: -187px

@media screen and (min-width: 1264px) and (max-width: 1382px)
	.ask-list-table-absolute-wrapper
		bottom: -110px

@media screen and (min-width: 960px) and (max-width: 1264px)
	.ask-list-table-absolute-wrapper
		bottom: -185px

@media screen and (max-width: 960px)
	.ask-list-table-absolute-wrapper
		bottom: -236px
</style>
