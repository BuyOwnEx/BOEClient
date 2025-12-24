<template>
	<div class="trading">
		<div v-if="!isMediumBreakpoint" class="trading__desktop fill-height" :class="[isLogged ? 'logged' : '']">
			<TickersList class="trading__desktop__tickers" :currency="currency" :market="market" />

      <TradingChartWrapper class="trading__desktop__chart" :currency="currency" :market="market" />

			<HistoryDealList v-if="!isMediumBreakpoint" class="trading__desktop__history" :market="market" :currency="currency" />

			<AskBid class="trading__desktop__ask-bid-list" :market="market" :currency="currency" />

			<TradingFormsWrapper class="trading__desktop__forms" :currency="currency" :market="market" />

			<OwnListsTabsWrapper class="trading__desktop__own-lists-tabs-wrapper" :is-margin="isMargin" :currency="currency" :market="market" />
		</div>

		<div v-if="isMediumBreakpoint" class="trading__mobile">
			<v-bottom-navigation v-model="selectedTab" shift grow app>
				<v-btn>
					<span>{{ $t('trading.headers.chart') }}</span>
					<v-icon>mdi-chart-bar</v-icon>
				</v-btn>

				<v-btn>
					<span>{{ $t('trading.headers.tickers') }}</span>
					<v-icon>mdi-table</v-icon>
				</v-btn>

				<v-btn>
					<span>{{ $t('trading.headers.history') }}</span>
					<v-icon>mdi-book</v-icon>
				</v-btn>

				<v-btn>
					<span>{{ $t('trading.headers.orders') }}</span>
					<v-icon>mdi-chart-box</v-icon>
				</v-btn>

				<v-btn>
					<span>{{ $t('trading.headers.forms') }}</span>
					<v-icon>mdi-form-select</v-icon>
				</v-btn>

				<v-btn v-if="isLogged">
					<span>{{ $t('trading.headers.lists') }}</span>
					<v-icon>mdi-view-list</v-icon>
				</v-btn>
			</v-bottom-navigation>

			<TradingChartWrapper
				v-show="selectedTab === 0"
				class="trading__mobile__chart"
				:currency="currency"
				:market="market"
			/>
			<TickersList v-if="selectedTab === 1" class="trading__mobile__tickers" :currency="currency" :market="market" />

			<HistoryDealList
				v-if="selectedTab === 2"
				class="trading__mobile__history"
				:market="market"
				:currency="currency"
			/>

      <AskBid v-if="selectedTab === 3" class="trading__mobile__ask-bid-list fill-height" :market="market" :currency="currency" />

			<TradingFormsWrapper
				v-if="selectedTab === 4"
				class="trading__mobile__forms"
				:currency="currency"
				:market="market"
			/>

			<OwnListsTabsWrapper
				v-if="selectedTab === 5 && isLogged"
				class="trading__mobile__own-lists-tabs-wrapper"
				:is-margin="isMargin"
				:currency="currency"
				:market="market"
			/>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import TickersList from '@/components/trading/v2/tickers/TradingTickersList.vue';
import TradingChartWrapper from '@/components/trading/v2/chart/TradingChartWrapper.vue';
import HistoryDealList from '@/components/trading/v2/history/HistoryDealList.vue';
import AskBid from "@/components/trading/v2/orders/ask_bid/AskBid.vue";
import TradingChat from '@/components/trading/v2/chat/TradingChat.vue';
import TradingMarketActivity from '@/components/trading/v2/market/TradingMarketActivity.vue';

import TradingFormsWrapper from '@/components/trading/v2/forms/TradingFormsWrapper.vue';
import OwnListsTabsWrapper from '@/components/trading/v2/user/OwnListsTabsWrapper.vue';

import CentrifugeTradingMixin from '@/mixins/centrifugo-trading';

export default {
	name: 'Trading',

	mixins: [CentrifugeTradingMixin],

	components: {
    AskBid,
		TickersList,
		TradingChartWrapper,
		HistoryDealList,
		TradingChat,
		TradingMarketActivity,
		TradingFormsWrapper,
		OwnListsTabsWrapper,
	},

	data: () => ({
		selectedTab: 0,
	}),

	computed: {
		...mapState({
			allMarkets: state => state.tickers.markets,
			selectedMarket: state => state.trading.selectedMarket,
			selectedCurrency: state => state.trading.selectedCurrency,
		}),
		...mapGetters({
			selectedPair: 'trading/selectedPair',
			isLogged: 'app/isLogged',
		}),

		markets() {
			const selectedMarket = this.selectedMarket.toUpperCase();
			return _.get(this.allMarkets, selectedMarket, null);
		},

		isMargin() {
			const market = this.markets
				? _.find(this.markets, item => item.currency.toUpperCase() === this.selectedCurrency.toUpperCase())
				: null;
			return market === null ? false : market.margin;
		},

		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},
		isMediumBreakpoint() {
			return this.$vuetify.breakpoint.width < 1264;
		},

		currency() {
			return this.selectedCurrency ? this.selectedCurrency.toUpperCase() : null;
		},
		market() {
			return this.selectedMarket ? this.selectedMarket.toUpperCase() : null;
		},
	},

	methods: {
		updateUrl() {
			if ('history' in window) {
				window.history.pushState(
					null,
					this.market + '/' + this.currency,
					'/trading/' + this.market + '/' + this.currency
				);
			}
		},
	},

	created() {
		if (!this.$store.state.trading.selectedMarket || !this.$store.state.trading.selectedCurrency) {
			this.$store.commit('trading/setPair', {
        currency: this.$route.params.currency,
        market: this.$route.params.market,
			});
		}
    if ('localStorage' in window) {
      const candlePeriod = window.localStorage.getItem('tradingCandlePeriod');
      if(candlePeriod) this.$store.commit('trading/setGraphPeriod', candlePeriod);
      else this.$store.commit('trading/setGraphPeriod', '1m');
    }
	},

	mounted() {
		this.debouncedUpdateUrl = _.debounce(this.updateUrl, 300);
		this.$watch('selectedPair', this.debouncedUpdateUrl);
	},
};
</script>

<style lang="scss">
.trading {
	display: flex;
	flex-grow: 1;
	flex-flow: column;
	max-width: 100%;

	&__desktop {
		display: grid;
		grid-gap: 5px;
    overflow-y: auto;
    grid-template-areas:
			'tickers chart chart chart ask-bid forms'
			'own own own own own history';
    grid-template-columns: minmax(325px, 1fr) 1fr 1fr 1fr minmax(300px, 1fr) minmax(325px, 1fr);
    grid-template-rows: minmax(458px, 1.4fr) minmax(250px, 1fr);

		&__tickers {
			grid-area: tickers;
			min-width: 325px;
		}

		&__chart {
			grid-area: chart;
		}

		&__history {
			grid-area: history;
			min-width: 325px;
		}

		&__chat {
			grid-area: chat;
			min-width: 325px;
		}

		&__market-activity {
			grid-area: activity;
		}

		&__ask-bid-list {
			grid-area: ask-bid;
		}

		&__forms {
			grid-area: forms;
		}

		&__own-lists-tabs-wrapper {
			grid-area: own;
		}
	}

  &__desktop.logged {
    grid-template-areas:
			'tickers chart chart chart ask-bid forms'
			'own own own own own history';
    grid-template-columns: minmax(325px, 1fr) 1fr 1fr 1fr minmax(300px, 1fr) minmax(325px, 1fr);
    grid-template-rows: minmax(458px, 1fr) minmax(250px, 1fr);
  }

	&__mobile {
		display: flex;
		flex-grow: 1;
		flex-flow: column;

		&__history {
			flex-grow: 1;
			overflow: auto;
		}

		&__orders__last-price {
			margin: 8px 0;
		}
	}
}

@media screen and (min-width: 1264px) and (max-width: 1628px) {
	.trading__desktop {
    grid-template-areas:
			'tickers chart chart chart chart forms'
			'own own own own ask-bid history';
    grid-template-columns: minmax(325px, 1fr) 1fr 1fr 1fr 300px minmax(325px, 1fr);
    grid-template-rows: minmax(458px, 1.2fr) minmax(250px, 1fr);
	}
  .trading__desktop.logged {
    grid-template-areas:
			'tickers chart chart chart chart forms'
			'own own own own ask-bid history';
    grid-template-columns: minmax(325px, 1fr) 1fr 1fr 1fr 300px minmax(325px, 1fr);
    grid-template-rows: minmax(458px, 1fr) minmax(250px, 1fr);
  }
}
</style>
