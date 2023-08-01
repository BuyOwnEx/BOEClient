<template>
	<div class="trading">
		<div v-if="!isMobile" class="trading__desktop fill-height">
			<TickersList class="trading__desktop__tickers" :currency="currency" :market="market" />

			<TradingChartWrapper class="trading__desktop__chart" :currency="currency" :market="market" />

			<HistoryDealList class="trading__desktop__history" :market="market" :currency="currency" />

			<TradingChat v-if="!isMediumBreakpoint" class="trading__desktop__chat" />

			<AskList class="trading__desktop__ask-list" :currency="currency" :market="market" />

			<TradingFormsWrapper class="trading__desktop__forms" :currency="currency" :market="market" />

			<BidList class="trading__desktop__bid-list" :currency="currency" :market="market" />

			<TradingMarketActivity v-if="!isMediumBreakpoint" class="trading__desktop__market-activity" />

			<OwnListsTabsWrapper
				v-if="isLogged"
				class="trading__desktop__own-lists-tabs-wrapper"
				:is-margin="isMargin"
				:currency="currency"
				:market="market"
			/>
		</div>

		<div v-if="isMobile" class="trading__mobile">
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
					<span>{{ $t('trading.headers.chat') }}</span>
					<v-icon>mdi-forum</v-icon>
				</v-btn>

				<v-btn>
					<span>{{ $t('trading.headers.orders') }}</span>
					<v-icon>mdi-chart-box</v-icon>
				</v-btn>

				<v-btn @click="moveToTop">
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

			<TradingChat v-if="selectedTab === 3" class="trading__mobile__chat" />

			<div v-if="selectedTab === 4">
				<BidList class="trading__mobile__orders__bid" :currency="currency" :market="market" />
				<AskBidLastPrice
					class="trading__mobile__orders__last-price"
					id="last-price"
					ref="askBidLastPrice"
					:market="market"
					@mounted="moveToOrdersLastPrice"
				/>
				<AskList class="trading__mobile__orders__ask" :currency="currency" :market="market" />
			</div>

			<TradingFormsWrapper
				v-if="selectedTab === 5"
				class="trading__mobile__forms"
				:currency="currency"
				:market="market"
			/>

			<OwnListsTabsWrapper
				v-if="selectedTab === 6 && isLogged"
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

import TickersList from '../../components/trading/tickers/TradingTickersList';
import TradingChartWrapper from '../../components/trading/chart/TradingChartWrapper';
import HistoryDealList from '../../components/trading/history/HistoryDealList';

import TradingChat from '../../components/trading/chat/TradingChat';
import AskList from '../../components/trading/orders/ask/AskList';
import TradingMarketActivity from '../../components/trading/market/TradingMarketActivity';
import BidList from '../../components/trading/orders/bid/BidList';

import TradingFormsWrapper from '../../components/trading/forms/TradingFormsWrapper';
import OwnListsTabsWrapper from '../../components/trading/user/OwnListsTabsWrapper';

import CentrifugeTradingMixin from '../../mixins/centrifugo-trading';

export default {
	name: 'Trading',

	mixins: [CentrifugeTradingMixin],

	components: {
		TickersList,
		TradingChartWrapper,
		HistoryDealList,
		TradingChat,
		TradingMarketActivity,
		AskList,
		AskBidLastPrice: () => import(/* webpackPrefetch: true */ '../../components/trading/orders/mobile/AskBidLastPrice'),
		BidList,
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
			return this.$vuetify.breakpoint.width < 1382;
		},

		currency() {
			return this.selectedCurrency.toUpperCase();
		},
		market() {
			return this.selectedMarket.toUpperCase();
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

		moveToOrdersLastPrice() {
			const element = this.$refs.askBidLastPrice.$el;
			element.scrollIntoView({
				block: 'center',
			});
		},
		moveToTop() {
			window.scrollTo(0, 0);
		},
	},

	created() {
		if (!this.$store.state.trading.selectedMarket || !this.$store.state.trading.selectedCurrency) {
			this.$store.commit('trading/setPair', {
				currency: this.$trading_currency,
				market: this.$trading_market,
			});
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
		grid-template-columns: 325px 1fr 1fr 1fr 1fr 325px;
		grid-template-rows: 1fr 1fr;
		grid-template-areas:
			'tickers chart chart chart chart history'
			'chat bid forms forms ask history'
			'chat bid forms forms ask history'
			'activity bid forms forms ask history'
			'own own own own own own';

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

		&__ask-list {
			grid-area: ask;
		}

		&__forms {
			grid-area: forms;
		}

		&__bid-list {
			grid-area: bid;
		}

		&__own-lists-tabs-wrapper {
			grid-area: own;
		}
	}

	&__mobile {
		display: flex;
		flex-grow: 1;
		flex-flow: column;

		// TODO: поглядеть и убрать
		&__history {
			flex-grow: 1;
			overflow: auto;
		}

		&__orders__last-price {
			margin: 5px 0;
		}
	}
}

@media screen and (min-width: 1382px) and (max-width: 1768px) {
	.trading__desktop {
		grid-template-areas:
			'tickers chart chart chart chart history'
			'chat bid bid ask ask history'
			'chat forms forms forms forms history'
			'activity forms forms forms forms history'
			'own own own own own own';
	}
}

@media screen and (max-width: 1382px) {
	.trading {
		&__desktop {
			grid-template-columns: repeat(12, 1fr);
			grid-template-areas:
				'chart chart chart chart chart chart chart chart chart chart chart chart'
				'bid bid bid bid ask ask ask ask tickers tickers tickers tickers'
				'forms forms forms forms forms forms forms forms history history history history'
				'forms forms forms forms forms forms forms forms history history history history'
				'forms forms forms forms forms forms forms forms history history history history'
				'own own own own own own own own own own own own';
		}
	}
}
</style>
