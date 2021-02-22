<template>
	<div class='ask-list__absolute-table-wrapper'>
		<v-simple-table class='ask-list__content__table' dense fixed-header>
			<template v-slot:default>
				<OrdersTableHeader :currency='currency' :market='market' />

				<AskListTableBody :ask-data='askData' />
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
