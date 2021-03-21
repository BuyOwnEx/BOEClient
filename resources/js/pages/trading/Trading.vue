<template>
	<div class="trading">
		<div v-if="!isMobile" class="trading__desktop">
			<TickersList
				class="trading__desktop__tickers"
				:currency="selectedCurrency"
				:market="selectedMarket"
			/>

			<TradingChartWrapper
				class="trading__desktop__chart"
				:currency="selectedCurrency"
				:market="selectedMarket"
			/>

			<HistoryDealList
				class="trading__desktop__history"
				:market="selectedMarket"
				:currency="selectedCurrency"
			/>

			<TradingChat class="trading__desktop__chat" />

			<AskList
				class="trading__desktop__ask-list"
				:currency="selectedCurrency"
				:market="selectedMarket"
			/>

			<TradingFormsWrapper
				class="trading__desktop__forms"
				:currency="selectedCurrency"
				:market="selectedMarket"
			/>

			<BidList
				class="trading__desktop__bid-list"
				:currency="selectedCurrency"
				:market="selectedMarket"
			/>

			<MarketActivity class="trading__desktop__market-activity" />

			<OwnListsTabsWrapper
				v-if="isLogged"
				class="trading__desktop__own-lists-tabs-wrapper"
				:is-margin="isMargin"
				:currency="selectedCurrency"
				:market="selectedMarket"
			/>
		</div>

		<div v-if="isMobile" class="trading__mobile">
			<v-tabs-items v-model="selectedTab" class="trading__mobile__tab-pages">
				<v-tab-item :key="1">
					<TradingChartWrapper
						class="trading__mobile__chart"
						:currency="selectedCurrency"
						:market="selectedMarket"
					/>
				</v-tab-item>

				<v-tab-item :key="2">
					<TickersList
						class="trading__mobile__tickers"
						:currency="selectedCurrency"
						:market="selectedMarket"
					/>
				</v-tab-item>

				<v-tab-item :key="3">
					<HistoryDealList
						class="trading__mobile__history"
						:market="selectedMarket"
						:currency="selectedCurrency"
					/>
				</v-tab-item>

				<v-tab-item :key="4">
					<TradingChat class="trading__mobile__chat" />
				</v-tab-item>

				<v-tab-item class="trading__mobile__orders" :key="5">
					<BidList
						class="trading__mobile__orders__bid"
						:currency="selectedCurrency"
						:market="selectedMarket"
					/>
					<AskList
						class="trading__mobile__orders__ask"
						:currency="selectedCurrency"
						:market="selectedMarket"
					/>
				</v-tab-item>

				<v-tab-item :key="6">
					<TradingFormsWrapper
						class="trading__mobile__forms"
						:currency="selectedCurrency"
						:market="selectedMarket"
					/>
				</v-tab-item>

				<v-tab-item :key="7" v-if="isLogged">
					<OwnListsTabsWrapper
						class="trading__mobile__own-lists-tabs-wrapper"
						:is-margin="isMargin"
						:currency="selectedCurrency"
						:market="selectedMarket"
					/>
				</v-tab-item>
			</v-tabs-items>

			<v-tabs
				v-if="isMobile"
				v-model="selectedTab"
				class="trading__mobile__tabs"
				fixed-tabs
				show-arrows
			>
				<v-tab :key="1">
					Chart
				</v-tab>
				<v-tab :key="2">
					Tickers
				</v-tab>
				<v-tab :key="3">
					History
				</v-tab>
				<v-tab :key="4">
					Chat
				</v-tab>
				<v-tab :key="5">
					Orders
				</v-tab>
				<v-tab :key="6">
					Forms
				</v-tab>
				<v-tab :key="7" v-if="isLogged">
					Own Lists
				</v-tab>
			</v-tabs>
		</div>
	</div>
</template>

<script>
import CentrifugeTradingMixin from '../../mixins/centrifugo-trading';

import TickersList from '../../components/trading/tickers/TickersList';
import TradingChartWrapper from '../../components/trading/chart/TradingChartWrapper';
import HistoryDealList from '../../components/trading/history/HistoryDealList';

import TradingChat from '../../components/trading/chat/TradingChat';
import MarketActivity from '../../components/trading/market/MarketActivity';
import AskList from '../../components/trading/orders/ask/AskList';
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
		MarketActivity,
		AskList,
		BidList,
		TradingFormsWrapper,
		OwnListsTabsWrapper,
	},

	props: {
		currency: {
			type: String,
			default: '',
		},
		market: {
			type: String,
			default: '',
		},
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
			return _.get(
				this.$store.state.tickers.markets,
				this.selectedMarket.toUpperCase(),
				null
			);
		},
		isMargin() {
			let market = this.markets
				? _.find(
						this.markets,
						item =>
							item.currency.toUpperCase() ===
							this.selectedCurrency.toUpperCase()
				  )
				: null;
			return market === null ? false : market.margin;
		},
		isLogged() {
			return this.$store.getters['app/isLogged'];
		},

		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},
	},

	methods: {
		updateUrl() {
			if ('history' in window) {
				window.history.pushState(
					null,
					this.selectedMarket.toUpperCase() +
						'/' +
						this.selectedCurrency.toUpperCase(),
					'/trading/' +
						this.selectedMarket.toUpperCase() +
						'/' +
						this.selectedCurrency.toUpperCase()
				);
			}
		},
	},

	created() {
		if (
			this.$store.state.trading.selectedMarket === null ||
			this.$store.state.trading.selectedCurrency === null
		) {
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
		//this.$store.commit('app/setAuthUser', { user: this.$user, vm: this });
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
			min-height: calc(100vh - 171px);
			overflow: auto;
		}

		&__chart {
			height: calc(100vh - 171px);
			overflow: auto;
		}

		&__history {
			flex-grow: 1;
			min-height: calc(100vh - 171px);
			overflow: auto;
		}

		&__chat {
			flex-grow: 1;
			min-height: calc(100vh - 171px);
			overflow: auto;
		}

		&__orders {
			overflow: auto;

			&__bid {
			}
			&__ask {
				margin-top: 0.5rem;
			}
		}

		&__forms {
			overflow: auto;
			flex-grow: 1;
		}

		&__own-lists-tabs-wrapper {
			min-height: calc(100vh - 171px);
			overflow: auto;
			flex-grow: 1;
		}

		&__tabs {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 58px !important;
			z-index: 5;
			box-shadow: 0 -25px 20px 0 rgb(85 85 85 / 4%);
			-webkit-transform: translateZ(0);
		}
	}
}

.trading .v-window {
	display: flex;
	flex-grow: 1;
	flex-flow: column;
}

.trading .v-tabs-items .v-window__container {
	display: flex;
	flex-grow: 1;
	flex-flow: column;
}

.trading .v-tabs-items .v-window-item {
	display: flex;
	flex-grow: 1;
	flex-flow: column;
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

			&__market-activity {
				display: none !important;
			}

			&__chat {
				display: none !important;
			}
		}
	}
}
</style>
