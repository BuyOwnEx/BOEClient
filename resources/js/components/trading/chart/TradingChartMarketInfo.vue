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
				<span>{{ formatWithCurrencyScale(dailyVolume, currency) }} </span>
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

import formatWithCurrencyScale from '../../../mixins/common/formatWithCurrencyScale';

export default {
	name: 'MarketInfo',

	mixins: [formatWithCurrencyScale],

	props: {
		market: {
			type: String,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
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
		display: flex
		align-items: center
		justify-content: center
		flex-wrap: wrap
		padding-right: 12px
	&__daily
		display: flex
		align-items: center
		justify-content: center
		flex-wrap: wrap
		padding-right: 12px
	&__daily-high
		display: flex
		align-items: center
		justify-content: center
		flex-wrap: wrap
		padding-right: 12px
	&__daily-low
		display: flex
		align-items: center
		justify-content: center
		flex-wrap: wrap
		padding-right: 12px
	&__daily-volume
		display: flex
		align-items: center
		justify-content: center
		flex-wrap: wrap
		padding-right: 12px

	.info-value
		font-weight: bold
		font-size: 1.1rem
		padding-right: 4px
	.info-title
		font-weight: normal
		font-size: 11px

@media screen and (min-width: 1452px) and (max-width: 1850px)
	.market-info
		.info-value
			font-size: 14px
		.info-title
			font-size: 10px

@media screen and (min-width: 1382px) and (max-width: 1452px)
	.market-info
		line-height: 15px

		.info-value
			font-size: 12px
		.info-title
			font-size: 9px

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

@media screen and (min-width: 960px) and (max-width: 1382px)
	.market-info
		.info-value
			font-size: 15px
		.info-title
			font-size: 11px

		&__last-price
			padding-right: 16px
		&__daily
			padding-right: 16px
		&__daily-high
			padding-right: 16px
		&__daily-low
			padding-right: 16px
		&__daily-volume
			padding-right: 16px

@media screen and (max-width: 960px)
	.market-info
		line-height: 15px

		.info-value
			font-size: 15px
		.info-title
			font-size: 10px

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

@media screen and (max-width: 700px)
	.market-info
		line-height: 15px

		.info-value
			font-size: 10px
		.info-title
			font-size: 9px

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
</style>
