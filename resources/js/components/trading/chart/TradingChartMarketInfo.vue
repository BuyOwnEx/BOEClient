<template>
	<div class="market-info px-2 pt-1">
		<div class="market-info__last-price">
			<span class="info-value">
				<span>{{ lastPrice }}</span>
				<span class="currency">{{ selectedMarket }}</span>
			</span>
			<span class="info-title">
				{{ $t('trading.last_price') }}
			</span>
		</div>

		<div class="market-info__daily">
			<span
				class="info-value"
				:class="{
					'text-success': dailyChange > 0,
					'text-danger': dailyChange < 0,
				}"
			>
				<span>{{ dailyChangePercent }}%</span>
			</span>
			<span class="info-title">
				{{ $t('trading.daily_change') }}
			</span>
		</div>

		<div class="market-info__daily-high">
			<span class="info-value">
				{{ dailyHigh }}
				<span class="currency">{{ selectedMarket }}</span>
			</span>
			<span class="info-title">{{ $t('trading.daily_high') }}</span>
		</div>

		<div class="market-info__daily-low">
			<span class="info-value">
				{{ dailyLow }}
				<span class="currency">{{ selectedMarket }}</span>
			</span>
			<span class="info-title">{{ $t('trading.daily_low') }}</span>
		</div>

		<div class="market-info__daily-volume">
			<span class="info-value">
				<span>{{ dailyVolume }}</span>
				<span class="currency">{{ selectedMarket }}</span>
			</span>
			<span class="info-title">
				{{ $t('trading.daily_volume') }}
			</span>
		</div>
	</div>
</template>

<script>
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
export default {
	name: 'MarketInfo',
	props: ['market', 'currency'],
	data() {
		return {};
	},
	computed: {
		selectedMarket() {
			return this.$store.state.trading.selectedMarket === null
				? ''
				: this.$store.state.trading.selectedMarket.toUpperCase();
		},
		selectedCurrency() {
			return this.$store.state.trading.selectedCurrency === null
				? ''
				: this.$store.state.trading.selectedCurrency.toUpperCase();
		},
		selectedPair() {
			return this.$store.getters['trading/selectedPair'];
		},
		ticker() {
			return this.$store.getters['trading/activeTicker'];
			//return this.$store.getters.activeTicker;
		},
		lastPrice() {
			return this.ticker
				? BigNumber(this.ticker.latest)
						.dp(this.ticker.scale)
						.toString()
				: 0.0;
		},
		dailyChange() {
			if (this.ticker === null) {
				return BigNumber(0);
			}
			return BigNumber(this.ticker.latest).minus(
				BigNumber(this.ticker.previous_day)
			);
		},
		dailyChangeAbsolute() {
			if (this.ticker === null) {
				return 0;
			}
			return this.dailyChange
				.abs()
				.dp(this.ticker.scale)
				.toString();
		},
		dailyChangePercent() {
			let changePercent = 0;
			if (!this.dailyChange.isZero()) {
				if (BigNumber(this.ticker.previous_day).isZero()) {
					changePercent = 100;
				} else {
					changePercent = this.dailyChange
						.multipliedBy(100)
						.div(BigNumber(this.ticker.previous_day))
						.toString();
				}
			}
			return BigNumber(changePercent)
				.dp(2)
				.toString();
		},
		dailyHigh() {
			return this.ticker
				? BigNumber(this.ticker.max)
						.dp(this.ticker.scale)
						.toString()
				: 0;
		},
		dailyLow() {
			return this.ticker
				? BigNumber(this.ticker.min)
						.dp(this.ticker.scale)
						.toString()
				: 0;
		},
		dailyVolume() {
			return this.ticker
				? BigNumber(this.ticker.volume)
						.dp(this.ticker.scale)
						.toString()
				: 0;
		},
	},
	methods: {
		BigNumber(item) {
			return BigNumber(item);
		},
	},
};
</script>

<style scoped lang="sass">
.market-info
	display: flex
	flex-flow: row
	height: 33px

	&__last-price
		padding-right: 12px
	&__daily
		padding-right: 12px
	&__daily-high
		padding-right: 12px
	&__daily-low
		padding-right: 12px
	&__daily-volume
		padding-right: 12px

	.info-value
		font-weight: bold
		font-size: 1.1rem
	.info-title
		font-weight: normal
		font-size: 11px


@media screen and (min-width: 1452px) and (max-width: 1764px)
	.market-info
		.info-value
			font-size: 14px
		.info-title
			font-size: 10px

@media screen and (min-width: 1265px) and (max-width: 1452px)
	.market-info
		.info-value
			font-size: 12px
		.info-title
			font-size: 10px

		&__last-price
			padding-right: 2px
		&__daily
			padding-right: 2px
		&__daily-high
			padding-right: 2px
		&__daily-low
			padding-right: 2px
		&__daily-volume
			padding-right: 2px

@media screen and (min-width: 960px) and (max-width: 1264px)
	.market-info
		.info-value
			font-size: 15px
		.info-title
			font-size: 11px

		&__last-price
			padding-right: 8px
		&__daily
			padding-right: 8px
		&__daily-high
			padding-right: 8px
		&__daily-low
			padding-right: 8px
		&__daily-volume
			padding-right: 8px
</style>
