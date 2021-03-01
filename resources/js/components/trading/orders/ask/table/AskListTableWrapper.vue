<template>
	<div class="ask-list-table-absolute-wrapper">
		<v-simple-table class="ask-list__content__table" dense fixed-header>
			<template v-slot:default>
				<AskListTableHeader :currency="currency" :market="market" />
				<AskListTableBody
					:orders-data="ordersData"
					:amount-depth="amountDepth"
					:volume-depth="volumeDepth"
					:best="best"
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
};
</script>

<style scoped lang="sass">
.ask-list-table-absolute-wrapper
	position: absolute
	top: 0
	right: 0
	left: 0
	bottom: -482px
	overflow: hidden

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.ask-list-table-absolute-wrapper
		bottom: -332px

@media screen and (min-width: 1264px) and (max-width: 1382px)
	.ask-list-table-absolute-wrapper
		bottom: -332px

@media screen and (min-width: 960px) and (max-width: 1264px)
	.ask-list-table-absolute-wrapper
		bottom: -332px

@media screen and (max-width: 960px)
	.ask-list-table-absolute-wrapper
		bottom: -232px
</style>
