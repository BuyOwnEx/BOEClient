<template>
	<v-card class="market-activity pa-1">
		<v-card-title class="market-activity__header trading-component-title pa-0">
			{{ $t('trading.headers.market_activity') }}
		</v-card-title>

		<CommonProgressCircular v-if="isLoading || !tickersList" />
		<v-card-text v-else class="market-activity__content pa-0">
			<v-simple-table dense>
				<template v-slot:default>
					<tbody>
						<tr v-for="item in activityList">
							<td class="market-activity__item--pair">
								<span>{{ item.currency }}/{{ item.market }} </span>
							</td>

							<td
								class="market-activity__item--percent"
								:class="{
									'text-success': item.trend === 'positive',
									'text-danger': item.trend === 'negative',
								}"
							>
								<span style="font-weight: normal">
									{{ item.changePercent }}%
								</span>
							</td>

							<td class="history-deal-date">
								<div
									class="market-activity-indicator"
									:class="{
										positive: item.trend === 'positive',
										negative: item.trend === 'negative',
									}"
								>
									<div
										v-for="star in item.stars"
										class="market-activity-arrow"
									></div>
								</div>
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

import CommonProgressCircular from '../../common/CommonProgressCircular';

export default {
	name: 'MarketActivity',

	components: { CommonProgressCircular },

	data() {
		return {
			isLoading: true,
		};
	},

	computed: {
		tickersFromStorage() {
			return this.$store.state.tickers.tickersList;
		},

		tickersList() {
			if (this.tickersFromStorage === null) {
				return null;
			}
			return _.map(this.tickersFromStorage, item => {
				let change = BigNumber(item.latest).minus(BigNumber(item.previous_day));
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
			let positive = _.chain(this.tickersList)
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
			let negative = _.chain(this.tickersList)
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

	mounted() {
		this.isLoading = false;
	},
};
</script>

<style scoped lang="sass">
.market-activity
	display: flex
	flex-grow: 1
	flex-flow: column
	&__header
		margin-left: 4px
	&__content
		display: flex
		flex-grow: 1
		flex-flow: column
</style>
