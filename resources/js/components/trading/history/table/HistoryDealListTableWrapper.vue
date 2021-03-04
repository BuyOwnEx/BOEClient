<template>
	<v-simple-table
		class="hdl__content__table"
		:height="calculateTableHeight"
		dense
		fixed-header
	>
		<template v-slot:default>
			<HistoryDealListTableHeader :currency="currency" :market="market" />

			<HistoryDealListTableBody
				v-if="historyData && historyData.length"
				:history-data="historyData"
				:currency="currency"
				:market="market"
			/>

			<tbody v-else-if="historyData && !historyData.length"></tbody>
			<tbody v-else>
				<tr>
					<td colspan="3">
						<CommonProgressCircular />
					</td>
				</tr>
			</tbody>
		</template>
	</v-simple-table>
</template>

<script>
import HistoryDealListTableBody from './HistoryDealListTableBody';
import HistoryDealListTableHeader from './HistoryDealListTableHeader';
import CommonProgressCircular from '../../../common/CommonProgressCircular';

export default {
	name: 'HistoryDealListTableWrapper',

	components: {
		HistoryDealListTableBody,
		HistoryDealListTableHeader,
		CommonProgressCircular,
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

	computed: {
		calculateTableHeight() {
			const deviceWidth = this.$vuetify.breakpoint.width;
			const mobile = deviceWidth <= 960;
			const mid = deviceWidth > 960 && deviceWidth <= 1264;
			const mid2 = deviceWidth > 1264 && deviceWidth <= 1382;
			const mid3 = deviceWidth > 1382 && deviceWidth <= 1768;

			if (mobile) return undefined;
			else if (mid) return 384;
			else if (mid2) return 384;
			else if (mid3) return 1306;
			else return 907;
		},
	},
};
</script>

<style scoped lang="sass"></style>
