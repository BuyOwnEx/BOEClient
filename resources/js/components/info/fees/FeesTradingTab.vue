<template>
	<div class="fees-trading-tab">
		<v-simple-table dense>
			<template v-slot:default>
				<thead>
					<tr>
						<th>
							Пара
						</th>
						<th>
							Комиссия по сделке, Maker
						</th>
						<th>
							Комиссия по сделке, Taker
						</th>
						<th>
							Минимальный размер ордера
						</th>
						<th>
							Минимальный объём ордера
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in pairs" :key="item.id">
						<td>{{ item.pair }}</td>
						<td>{{ item.makerFee }} %</td>
						<td>{{ item.takerFee }} %</td>
						<td>{{ item.minAmount }} {{item.currency}}</td>
						<td>{{ item.minReverseAmount }} {{item.market}}</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
export default {
	name: 'FeesTradingTab',
	computed: {
		markets() {
			return this.$store.state.tickers.markets;
		},
		pairs() {
			let result = [];
			_.forEach(this.markets, function(value, key) {
				_.forEach(value, function(item, key2) {
					result.push({
						id: item.id,
						currency: item.currency,
						market: item.market,
						pair: item.currency + '/' + item.market,
						makerFee: '0.2',
						takerFee: '0.2',
						minAmount: item.minAmount,
						minReverseAmount: item.minReverseAmount,
					});
				});
			});
			return result;
		},
	},
	created() {
		this.$store.dispatch('tickers/getMarketDataFromServer');
	},
};
</script>

<style scoped></style>