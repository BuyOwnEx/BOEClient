<template>
	<div class="ask-list-table-absolute-wrapper">
		<v-simple-table class="ask-list__content__table" dense fixed-header>
			<template v-slot:default>
				<AskListTableHeader :currency="currency" :market="market" />

				<AskListTableBody
					v-if="ordersData && ordersData.length"
					:orders-data="ordersData"
					:amount-depth="amountDepth"
					:volume-depth="volumeDepth"
					:best="best"
					:currency="currency"
					:market="market"
				/>

				<tbody v-else-if="ordersData && !ordersData.length"></tbody>
				<tbody v-else>
					<tr>
						<td colspan="3">
							<CommonProgressCircular />
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
import AskListTableBody from './AskListTableBody';
import AskListTableHeader from './AskListTableHeader';
import CommonProgressCircular from '../../../../common/CommonProgressCircular';

export default {
	name: 'AskListTableWrapper',

	components: { AskListTableHeader, AskListTableBody, CommonProgressCircular },

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
	bottom: -482px
	overflow: hidden

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.ask-list-table-absolute-wrapper
		bottom: -332px
@media screen and (min-width: 960px) and (max-width: 1382px)
	.ask-list-table-absolute-wrapper
		bottom: -332px
@media screen and (max-width: 960px)
	.ask-list-table-absolute-wrapper
		bottom: -357px
</style>
