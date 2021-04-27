<template>
	<div class="history-deal-list-absolute-wrapper">
		<v-simple-table dense fixed-header>
			<template v-slot:default>
				<HistoryDealListTableHeader :currency="currency" :market="market" />

				<HistoryDealListTableBody
					v-if="historyData && historyData.length"
					:history-data="historyData"
					:currency="currency"
					:market="market"
				/>

				<tbody v-else-if="historyData && !historyData.length">
					<tr>
						<td colspan="3" class="text-center">
							{{ $t('trading.no_deals') }}
						</td>
					</tr>
				</tbody>
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
import HistoryDealListTableBody from './HistoryDealListTableBody';
import HistoryDealListTableHeader from './HistoryDealListTableHeader';
import CommonLoading from '../../../common/CommonLoading';

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
	bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 35)
	overflow: hidden

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.history-deal-list-absolute-wrapper
		bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 51)
@media screen and (min-width: 960px) and (max-width: 1382px)
	.history-deal-list-absolute-wrapper
		bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 18)
@media screen and (max-width: 959px)
	.history-deal-list-absolute-wrapper
		bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 40)
</style>
