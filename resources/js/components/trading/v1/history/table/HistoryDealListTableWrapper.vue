<template>
	<div class="history-deal-list-absolute-wrapper fill-height">
		<v-simple-table dense fixed-header>
			<template #default>
				<HistoryDealListTableHeader :currency="currency" :market="market" />

				<HistoryDealListTableBody
					v-if="historyData && historyData.length"
					:history-data="historyData"
					:currency="currency"
					:market="market"
				/>
				<tbody v-else-if="historyData && !historyData.length" />
			</template>
		</v-simple-table>
    <CommonLoading v-if="!historyData" />
	</div>
</template>

<script>
import HistoryDealListTableBody from '@/components/trading/v1/history/table/HistoryDealListTableBody.vue';
import HistoryDealListTableHeader from '@/components/trading/v1/history/table/HistoryDealListTableHeader.vue';
import CommonLoading from '@/components/common/CommonLoading.vue';

export default {
	name: 'HistoryDealListTableWrapper',

	components: {
		HistoryDealListTableBody,
		HistoryDealListTableHeader,
		CommonLoading,
	},

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
		historyData: {
			required: true,
		},
	},
};
</script>

<style scoped lang="sass">
.history-deal-list-absolute-wrapper
	position: absolute
	top: 0
	right: 0
	left: 0
	//bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 35)
	overflow: hidden

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.history-deal-list-absolute-wrapper
		//bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 51)
@media screen and (min-width: 960px) and (max-width: 1382px)
	.history-deal-list-absolute-wrapper
		//bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 18)
@media screen and (max-width: 959px)
	.history-deal-list-absolute-wrapper
		//bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 40)
</style>
