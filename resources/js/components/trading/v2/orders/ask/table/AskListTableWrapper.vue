<template>
	<div class="ask-list-table-absolute-wrapper">
		<v-simple-table class="ask-list__content__table" dense fixed-header style="position: absolute; bottom: 0; width: 100%">
			<template #default>
				<AskListTableBody
					v-if="ordersData && ordersData.length"
					:orders-data="ordersData"
					:amount-depth="amountDepth"
					:volume-depth="volumeDepth"
					:best="best"
					:currency="currency"
					:market="market"
				/>

				<tbody v-else-if="ordersData && !ordersData.length" />
				<tbody v-else>
					<tr>
						<td colspan="3">
							<CommonLoading />
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
import AskListTableBody from '@/components/trading/v2/orders/ask/table/AskListTableBody.vue';
import AskListTableHeader from '@/components/trading/v2/orders/ask/table/AskListTableHeader.vue';
import CommonLoading from '@/components/common/CommonLoading.vue';

export default {
	name: 'AskListTableWrapper',

	components: { AskListTableHeader, AskListTableBody, CommonLoading },

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
	height: inherit
	overflow: hidden
</style>
