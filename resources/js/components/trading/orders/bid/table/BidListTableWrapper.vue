<template>
	<div class="bid-list-table-absolute-wrapper">
		<v-simple-table class="bid-list__content__table" dense fixed-header>
			<template v-slot:default>
				<BidListTableHeader :currency="currency" :market="market" />
				<BidListTableBody
					:orders-data="ordersData"
					:amount-depth="amountDepth"
					:volume-depth="volumeDepth"
					:best="best"
					:currency="currency"
					:market="market"
				/>
			</template>
		</v-simple-table>
	</div>
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
};
</script>

<style scoped lang="sass">
.bid-list-table-absolute-wrapper
	position: absolute
	top: 0
	right: 0
	left: 0
	bottom: -482px
	overflow: hidden

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.bid-list-table-absolute-wrapper
		bottom: -332px

@media screen and (min-width: 1264px) and (max-width: 1382px)
	.bid-list-table-absolute-wrapper
		bottom: -332px

@media screen and (min-width: 960px) and (max-width: 1264px)
	.bid-list-table-absolute-wrapper
		bottom: -332px

@media screen and (max-width: 960px)
	.bid-list-table-absolute-wrapper
		bottom: -232px
</style>
