<template>
	<div class="market-info px-2 flex-grow-1 justify-space-between">
		<div class="market-info__last-price market-info__item flex-column justify-space-between">
      <span class="info-title">{{ $t('trading.last_price') }}</span>
			<span class="info-value">
        <span>{{ lastPrice }}</span> <span class="currency">{{ selectedMarket }}</span>
      </span>
		</div>
		<div class="market-info__daily market-info__item flex-column justify-space-between">
			<span class="info-title">{{ $t('trading.daily_change') }}</span>
      <span class="info-value" :class="{ 'success--text': dailyChange > 0, 'error--text': dailyChange < 0 }">
				<span>{{ dailyChangePercent }}%</span>
			</span>
		</div>
		<div class="market-info__daily-high market-info__item flex-column justify-space-between">
      <span class="info-title">{{ $t('trading.daily_high') }}</span>
			<span class="info-value">
				{{ dailyHigh }} <span class="currency">{{ selectedMarket }}</span>
			</span>
		</div>
		<div class="market-info__daily-low market-info__item flex-column justify-space-between">
      <span class="info-title">{{ $t('trading.daily_low') }}</span>
			<span class="info-value">
				{{ dailyLow }} <span class="currency">{{ selectedMarket }}</span>
			</span>
		</div>
		<div class="market-info__daily-volume market-info__item flex-column justify-space-between">
      <span class="info-title">{{ $t('trading.daily_volume') }}</span>
			<span class="info-value">
				<span>{{ dailyVolumeText }} </span> <span class="currency">{{ selectedMarket }}</span>
			</span>
		</div>
	</div>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import thousands from '@/plugins/thousands.js';
import formatWithScaleInAllCurrencies from '@/mixins/format/formatWithScaleInAllCurrencies';

export default {
	name: 'MarketInfo',

	mixins: [formatWithScaleInAllCurrencies],

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
		},
		lastPrice() {
			return this.ticker ? thousands(BigNumber(this.ticker.latest).dp(this.ticker.scale).toString(), ' ') : 0.0;
		},
		dailyChange() {
			if (this.ticker === null) {
				return BigNumber(0);
			}
			return BigNumber(this.ticker.latest).minus(BigNumber(this.ticker.previous_day));
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
			return this.ticker ? thousands(BigNumber(this.ticker.max).dp(this.ticker.scale).toString(), ' ') : 0;
		},
		dailyLow() {
			return this.ticker ? thousands(BigNumber(this.ticker.min).dp(this.ticker.scale).toString(), ' ') : 0;
		},
		dailyVolume() {
			return this.ticker ? this.ticker.volume : 0;
		},
    dailyVolumeText() {
      return thousands(this.formatWithScaleInAllCurrencies(this.dailyVolume, this.market),' ');
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

	&__item
		display: flex
		padding-right: 4px

	.info-value
		font-weight: bold
		font-size: 14px
		padding-right: 4px

	.info-title
		font-weight: normal
		font-size: 10px
		opacity: 0.6

@media screen and (max-width: 1200px)
	.market-info

		&__item

		.info-value
			font-size: 12px

@media screen and (max-width: 1000px)
	.market-info

		&__item

		.info-value
			font-size: 11px

@media screen and (max-width: 959px)
	.market-info
		margin-top: 10px

		.info-value
			font-size: 14px
		.info-title
			font-size: 10px

		&__item
			padding-right: 8px

@media screen and (max-width: 700px)
	.market-info
		margin-top: 10px

		.info-value
			font-size: 10px
		.info-title
			font-size: 9px

		&__item
			padding-right: 2px

.v-application--is-rtl
	.market-info
		&__item
			padding-left: 12px
			padding-right: 0
		.info-value
			padding-left: 4px
			padding-right: 0

		@media screen and (min-width: 1382px) and (max-width: 1500px)
			padding-left: 2px
			padding-right: 0
		@media screen and (min-width: 960px) and (max-width: 1382px)
			padding-left: 16px
			padding-right: 0
		@media screen and (max-width: 959px)
			padding-left: 8px
			padding-right: 0
		@media screen and (max-width: 700px)
			padding-left: 2px
			padding-right: 0
</style>
