<template>
	<v-card class="trading-market-activity pa-1">
		<v-card-title class="trading-market-activity__header component-title pa-0">
			{{ $t('trading.headers.market_activity') }}
		</v-card-title>

		<CommonLoading v-if="!tickersList" />
		<v-card-text v-else class="trading-market-activity__content pa-0">
			<v-simple-table dense>
				<template #default>
					<tbody>
						<tr v-for="item in activityList" :key="item.id">
							<td class="trading-market-activity__item--pair">{{ item.currency }}/{{ item.market }}</td>

							<td
								class="trading-market-activity__item--percent"
								:class="{
									'success--text': item.trend === 'positive',
									'error--text': item.trend === 'negative',
								}"
							>
								<span> {{ item.changePercent }}% </span>
							</td>

							<td class="trading-market-activity__trend text-center">
								<v-icon v-if="item.trend === 'positive'" color="success" small>
									mdi-arrow-up
								</v-icon>
								<v-icon v-else-if="item.trend === 'negative'" color="error" small>
									mdi-arrow-down
								</v-icon>
								<span v-else>
									—
								</span>
							</td>
						</tr>

						<tr v-if="activityList.length === 0">
							<td colspan="5" class="text-center">
								{{ $t('trading.no_activity') }}
							</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</v-card-text>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import CommonLoading from '@/components/common/CommonLoading.vue';

export default {
	name: 'TradingMarketActivity',

	components: { CommonLoading },

	computed: {
		tickersFromStorage() {
			return this.$store.state.tickers.tickersList;
		},

		tickersList() {
			if (!this.tickersFromStorage) {
				return null;
			}

			return _.map(this.tickersFromStorage, item => {
				const change = BigNumber(item.latest).minus(BigNumber(item.previous_day));
				let changePercent = 0;

				if (!change.isZero()) {
					if (BigNumber(item.previous_day).isZero()) {
						changePercent = 100;
					} else {
						changePercent = change
							.multipliedBy(100)
							.div(BigNumber(item.previous_day))
							.dp(2)
							.toNumber();
					}
				}
				return {
					market: item.market,
					trend: change > 0 ? 'positive' : change < 0 ? 'negative' : 0,
					currency: item.currency,
					change: change.dp(item.scale).toNumber(),
					changePercent: changePercent,
				};
			});
		},

		activityList() {
			const positive = _.chain(this.tickersList)
				.filter(item => {
					return item.trend === 'positive' || item.trend === 0;
				})
				.sortBy(item => {
					return item.changePercent * -1;
				})
				.slice(0, 3)
				.map((item, key) => {
					item['stars'] = 3 - key;
					return item;
				})
				.value();
			const negative = _.chain(this.tickersList)
				.filter(item => {
					return item.trend === 'negative';
				})
				.sortBy(item => {
					return item.changePercent;
				})
				.slice(0, 3)
				.map((item, key) => {
					item['stars'] = 3 - key;
					return item;
				})
				.value();
			return _.union(positive, negative);
		},
	},
};
</script>

<style scoped lang="sass">
.trading-market-activity
	display: flex
	flex-grow: 1
	flex-flow: column
	&__header
		margin-left: 4px
	&__content
		display: flex
		flex-grow: 1
		flex-flow: column
	&__trend
		width: 1%
</style>
