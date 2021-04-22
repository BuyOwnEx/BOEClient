<template>
	<div class="trading">
		<div v-if="!isMobile" class="trading__desktop">
			<TickersList class="trading__desktop__tickers" :currency="selectedCurrency" :market="selectedMarket" />

			<TradingChartWrapper class="trading__desktop__chart" :currency="selectedCurrency" :market="selectedMarket" />

			<HistoryDealList class="trading__desktop__history" :market="selectedMarket" :currency="selectedCurrency" />

			<TradingChat v-if="!isMediumBreakpoint" class="trading__desktop__chat" />

			<AskList class="trading__desktop__ask-list" :currency="selectedCurrency" :market="selectedMarket" />

			<TradingFormsWrapper class="trading__desktop__forms" :currency="selectedCurrency" :market="selectedMarket" />

			<BidList class="trading__desktop__bid-list" :currency="selectedCurrency" :market="selectedMarket" />

			<TradingMarketActivity v-if="!isMediumBreakpoint" class="trading__desktop__market-activity" />

			<OwnListsTabsWrapper
				v-if="isLogged"
				class="trading__desktop__own-lists-tabs-wrapper"
				:is-margin="isMargin"
				:currency="selectedCurrency"
				:market="selectedMarket"
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
				v-if="selectedTab === 0"
				class="trading__mobile__chart"
				:currency="selectedCurrency"
				:market="selectedMarket"
			/>
			<TickersList
				v-if="selectedTab === 1"
				class="trading__mobile__tickers"
				:currency="selectedCurrency"
				:market="selectedMarket"
			/>

			<HistoryDealList
				v-if="selectedTab === 2"
				class="trading__mobile__history"
				:market="selectedMarket"
				:currency="selectedCurrency"
			/>

			<TradingChat v-if="selectedTab === 3" class="trading__mobile__chat" />

			<div v-if="selectedTab === 4">
				<BidList class="trading__mobile__orders__bid" :currency="selectedCurrency" :market="selectedMarket" />
				<AskBidLastPrice
					class="trading__mobile__orders__last-price"
					id="last-price"
					ref="askBidLastPrice"
					:market="selectedMarket"
					@mounted="moveToOrdersLastPrice"
				/>
				<AskList class="trading__mobile__orders__ask" :currency="selectedCurrency" :market="selectedMarket" />
			</div>

			<TradingFormsWrapper
				v-if="selectedTab === 5"
				class="trading__mobile__forms"
				:currency="selectedCurrency"
				:market="selectedMarket"
			/>

			<OwnListsTabsWrapper
				v-if="selectedTab === 6 && isLogged"
				class="trading__mobile__own-lists-tabs-wrapper"
				:is-margin="isMargin"
				:currency="selectedCurrency"
				:market="selectedMarket"
			/>
		</div>
	</div>
</template>

<script>
import CentrifugeTradingMixin from '../../mixins/centrifugo-trading';

import TickersList from '../../components/trading/tickers/TradingTickersList';
import TradingChartWrapper from '../../components/trading/chart/TradingChartWrapper';
import HistoryDealList from '../../components/trading/history/HistoryDealList';

import TradingChat from '../../components/trading/chat/TradingChat';
import AskList from '../../components/trading/orders/ask/AskList';
import TradingMarketActivity from '../../components/trading/market/TradingMarketActivity';
import BidList from '../../components/trading/orders/bid/BidList';

import TradingFormsWrapper from '../../components/trading/forms/TradingFormsWrapper';
import OwnListsTabsWrapper from '../../components/trading/user/OwnListsTabsWrapper';

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
		selectedMarket() {
			return this.$store.state.trading.selectedMarket;
		},
		selectedCurrency() {
			return this.$store.state.trading.selectedCurrency;
		},
		selectedPair() {
			return this.$store.getters['trading/selectedPair'];
		},
		markets() {
			return _.get(this.$store.state.tickers.markets, this.selectedMarket.toUpperCase(), null);
		},

		isMargin() {
			let market = this.markets
				? _.find(this.markets, item => item.currency.toUpperCase() === this.selectedCurrency.toUpperCase())
				: null;
			return market === null ? false : market.margin;
		},
		isLogged() {
			return this.$store.getters['app/isLogged'];
		},

		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},
		isMediumBreakpoint() {
			return this.$vuetify.breakpoint.width < 1382;
		},
	},

	methods: {
		updateUrl() {
			if ('history' in window) {
				window.history.pushState(
					null,
					this.selectedMarket.toUpperCase() + '/' + this.selectedCurrency.toUpperCase(),
					'/trading/' + this.selectedMarket.toUpperCase() + '/' + this.selectedCurrency.toUpperCase()
				);
			}
		},

		moveToOrdersLastPrice() {
			const ordersTab = 4;
			if (this.selectedTab === ordersTab) {
				const element = this.$refs.askBidLastPrice.$el;
				element.scrollIntoView({
					block: 'center',
				});
			}
		},
		moveToTop() {
			window.scrollTo(0, 0);
		},
	},

	created() {
		if (this.$store.state.trading.selectedMarket === null || this.$store.state.trading.selectedCurrency === null) {
			console.log('currency: ' + this.$trading_currency);
			console.log('market: ' + this.$trading_market);
			this.$store.commit('trading/setPair', {
				currency: this.$trading_currency,
				market: this.$trading_market,
			});
		}
	},

	mounted() {
		this.debouncedUpdateUrl = _.debounce(this.updateUrl, 300);
		this.$watch('selectedPair', this.debouncedUpdateUrl);
		console.log('user: ' + this.$user);
	},
};
</script>

<style lang="scss">
.trading {
	display: flex;
	flex-grow: 1;
	flex-flow: column;

	&__desktop {
		display: grid;
		grid-gap: 5px;
		grid-template-columns: 325px 1fr 1fr 1fr 1fr 325px;
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

		&__tickers {
			flex-grow: 1;
			overflow: auto;
		}

		&__chart {
			overflow: auto;
		}

		&__history {
			flex-grow: 1;
			overflow: auto;
		}

		&__chat {
			flex-grow: 1;
			overflow: auto;
		}

		&__orders {
			overflow: auto;
			&__last-price {
				margin: 5px 0;
			}
		}

		&__forms {
			overflow: auto;
			flex-grow: 1;
		}

		&__own-lists-tabs-wrapper {
			overflow: auto;
			flex-grow: 1;
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
