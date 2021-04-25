<template>
	<v-card class="trading-tickers-list pa-1">
		<div class="trading-tickers-list__header">
			<div v-if="!isSearch" class="trading-tickers-list__header-markets">
				<v-btn
					v-if="marketsFromStorage !== null"
					v-for="market in markets"
					class="mr-1"
					:key="market"
					:class="{ selected: market === selectedMarket }"
					:input-value="selectedMarket === market"
					text
					small
					@click="selectedMarket = market"
				>
					<span>{{ market }}</span>
				</v-btn>
			</div>

			<div v-if="isSearch" class="trading-tickers-list__header-search">
				<v-text-field v-model="tickersSearchQuery" :label="$t('trading.search')" hide-details outlined dense>
				</v-text-field>
			</div>

			<div class="trading-tickers-list__header-actions">
				<span class="trading-tickers-list__search-action">
					<v-btn icon @click="switchSearchShowAndClearField">
						<v-icon>mdi-magnify</v-icon>
					</v-btn>
				</span>
			</div>
		</div>

		<CommonLoading v-if="!tickersList" />

		<div v-else class="trading-tickers-list__content-wrapper">
			<v-simple-table
				v-if="tickersList && tickersListFilteredAndSorted.length > 0"
				class="trading-tickers-list__content"
				:height="calculateTableHeight"
				dense
				fixed-header
			>
				<template v-slot:default>
					<thead class="trading-tickers-list__table-header">
						<tr>
							<th class="trading-tickers-list__header-item--favorite" @click="switchFavoriteSorting">
								<span class="trading-tickers-list__header-favorite-wrapper">
									<v-icon v-if="selectedMarket !== 'favorites'" color="#b0b29c" small>
										mdi-star
									</v-icon>
									<v-icon v-if="selectedMarket === 'favorites'" color="#FFE040" small>
										mdi-star
									</v-icon>
								</span>
							</th>
							<th class="trading-tickers-list__header-item--pair" @click="setSorting('pair')">
								<span>
									{{ $t('table_header.market') }}
								</span>
								<v-icon v-if="tickersSorting === 'pairAsc'" small>
									mdi-arrow-up
								</v-icon>
								<v-icon v-if="tickersSorting === 'pairDesc'" small>
									mdi-arrow-down
								</v-icon>
							</th>
							<th class="trading-tickers-list__header-item--rate">
								{{ $t('table_header.rate') }}
							</th>
							<th class="trading-tickers-list__header-item--volume" @click="setSorting('volume')">
								<span>
									{{ $t('trading.sort.volume') }}
								</span>
								<v-icon v-if="tickersSorting === 'volumeDesc'" small>
									mdi-arrow-down
								</v-icon>
								<v-icon v-if="tickersSorting === 'volumeAsc'" small>
									mdi-arrow-up
								</v-icon>
							</th>
							<th class="trading-tickers-list__header-item--change text-end" @click="setSorting('change')">
								<span>
									{{ $t('trading.sort.change') }}
								</span>
								<v-icon v-if="tickersSorting === 'changeDesc'" small>
									mdi-arrow-down
								</v-icon>
								<v-icon v-if="tickersSorting === 'changeAsc'" small>
									mdi-arrow-up
								</v-icon>
							</th>
						</tr>
					</thead>

					<tbody class="trading-tickers-list__table-body">
						<tr v-for="item in tickersListFilteredAndSorted" :key="item.pairName">
							<td class="trading-tickers-list__body-item--favorite">
								<div class="trading-tickers-list__body-favorite-wrapper">
									<v-icon
										v-if="isPairFavorite(item.pairName)"
										color="#FFE040"
										small
										@click="removeFromFavorites(item.pairName)"
									>
										mdi-star
									</v-icon>
									<v-icon
										v-if="!isPairFavorite(item.pairName)"
										color="#b0b29c"
										small
										@click="addToFavorites(item.pairName)"
									>
										mdi-star
									</v-icon>
								</div>
							</td>

							<td class="trading-tickers-list__body-item--pair">
								<a
									href="#"
									class="trading-tickers-list__pair-link"
									@click.prevent="selectMarketAndCurrency(item.market, item.currency)"
								>
									<strong class="trading-tickers-list__pair-currency">
										{{ item.currency }}
									</strong>
								</a>
							</td>

							<td class="trading-tickers-list__body-item--cost">
								{{ BigNumber(item.latest).toString() }}
							</td>

							<td class="trading-tickers-list__body-item--volume">
								{{ formatWithScaleInAllCurrencies(item.volume, market) }}
							</td>

							<td
								class="trading-tickers-list__body-item--change text-end"
								:class="[getPercentColorClass(item.changePercent)]"
							>
								<span>{{ item.changePercent }}</span>
								<span>%</span>
							</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>

			<div v-else-if="tickersList && tickersListFilteredAndSorted.length === 0" class="text-center mt-4 overline">
				{{ $t('trading.not_found') }}
			</div>
		</div>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import CommonLoading from '../../common/CommonLoading';

import formatWithScaleInAllCurrencies from '../../../mixins/format/formatWithScaleInAllCurrencies';

export default {
	name: 'TradingTickersList',

	components: { CommonLoading },

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

	data() {
		return {
			selectedMarket: this.market,
			prevSelectedMarket: '',
			tickersSorting: 'volumeDesc',
			tickersSearchQuery: '',
			favoritePairs: [],
			isSearch: false,
		};
	},

	computed: {
		selectedTradingMarket() {
			return this.$store.state.trading.selectedMarket;
		},
		marketsFromStorage() {
			return this.$store.state.tickers.markets;
		},
		tickersFromStorage() {
			return this.$store.state.tickers.tickersList;
		},
		markets() {
			return _.keys(this.marketsFromStorage);
		},

		tickersList() {
			if (this.tickersFromStorage === null || this.marketsFromStorage === null) {
				return null;
			}

			return _.map(this.tickersFromStorage, item => {
				let change = BigNumber(item.latest).minus(BigNumber(item.previous_day));
				let changePercent = 0;
				if (!change.isZero()) {
					if (BigNumber(item.previous_day).isZero()) {
						changePercent = 100;
					} else {
						changePercent = change.multipliedBy(100).div(BigNumber(item.previous_day));
					}
				}

				let amountScale = 6;
				let rateScale = 2;
				let currentMarket = this.marketsFromStorage[item.market.toUpperCase()];
				if (currentMarket !== undefined) {
					let currentPair = _.find(currentMarket, marketArray => {
						return marketArray.currency.toLowerCase() === item.currency.toLowerCase();
					});
					if (currentPair !== undefined) {
						amountScale = currentPair.amountScale;
						rateScale = currentPair.rateScale;
					}
				}
				return {
					pairName: item.currency.toUpperCase() + '/' + item.market.toUpperCase(),
					market: item.market,
					currency: item.currency,
					margin: item.margin,
					volume: item.volume,
					latest: item.latest.toFixed(2),
					change: change.toFixed(item.scale),
					changePercent: changePercent.toFixed(2),
				};
			});
		},
		tickersListFiltered() {
			if (this.selectedMarket === null) {
				return this.markets;
			}
			if (this.tickersSearchQuery !== '' && this.selectedMarket !== 'favorites') {
				return _.filter(this.tickersList, item => {
					return item.pairName.toLowerCase().indexOf(this.tickersSearchQuery.toLowerCase()) !== -1;
				});
			}
			if (this.selectedMarket === 'favorites') {
				if (this.tickersSearchQuery !== '') {
					return _.filter(this.allFavorites, item => {
						return item.pairName.toLowerCase().indexOf(this.tickersSearchQuery.toLowerCase()) !== -1;
					});
				}
				return this.allFavorites;
			}

			return _.filter(this.tickersList, item => {
				return item.market === this.selectedMarket;
			});
		},
		tickersListFilteredAndSorted() {
			switch (this.tickersSorting) {
				case 'pairAsc':
					return _.orderBy(this.tickersListFiltered, ['pairName'], ['asc']);
				case 'pairDesc':
					return _.orderBy(this.tickersListFiltered, ['pairName'], ['desc']);

				case 'changeAsc':
					return _.sortBy(this.tickersListFiltered, item => parseFloat(item.changePercent));
				case 'changeDesc':
					return _.sortBy(this.tickersListFiltered, item => parseFloat(item.changePercent) * -1);

				case 'volumeAsc':
					return _.sortBy(this.tickersListFiltered, item => parseFloat(item.volume));
				case 'volumeDesc':
				default:
					return _.sortBy(this.tickersListFiltered, item => parseFloat(item.volume) * -1);
			}
		},
		allFavorites() {
			if (this.favoritePairs.length === 0) {
				return [];
			}
			return _.filter(this.tickersList, item => {
				return _.find(this.favoritePairs, pair => {
					return pair === item.pairName;
				});
			});
		},

		calculateTableHeight() {
			const deviceWidth = this.$vuetify.breakpoint.width;
			const mobile = deviceWidth <= 960;
			const mid = deviceWidth > 960 && deviceWidth <= 1382;
			const mid2 = deviceWidth > 1382 && deviceWidth <= 1768;

			if (mobile) return undefined;
			else if (mid) return 313;
			else if (mid2) return 388;
			else return 365;
		},
	},

	methods: {
		BigNumber(item) {
			return BigNumber(item);
		},
		selectMarketAndCurrency(market, currency) {
			market = market.toLowerCase();
			currency = currency.toLowerCase();

			this.$store.commit('trading/setPair', {
				market: market,
				currency: currency,
			});
		},
		setSorting(type) {
			const sort = this.tickersSorting;

			switch (type) {
				case 'pair':
					if (sort === 'pairAsc') {
						this.tickersSorting = 'pairDesc';
					} else if (sort === 'pairDesc') {
						this.tickersSorting = '';
					} else {
						this.tickersSorting = 'pairAsc';
					}
					this.setSortingToLocalStorage(this.tickersSorting);
					break;

				case 'change':
					if (sort === 'changeAsc') {
						this.tickersSorting = 'changeDesc';
					} else if (sort === 'changeDesc') {
						this.tickersSorting = '';
					} else {
						this.tickersSorting = 'changeAsc';
					}
					this.setSortingToLocalStorage(this.tickersSorting);
					break;

				case 'volume':
				default:
					if (sort === 'volumeAsc') {
						this.tickersSorting = 'volumeDesc';
					} else if (sort === 'volumeDesc') {
						this.tickersSorting = '';
					} else {
						this.tickersSorting = 'volumeAsc';
					}
					this.setSortingToLocalStorage(this.tickersSorting);
			}
		},
		setPrevSelectedMarket(prevMarket) {
			this.prevSelectedMarket = prevMarket;
		},

		addToFavorites(pairName) {
			const exist = _.find(this.favoritePairs, item => {
				return item.toLowerCase() === pairName.toLowerCase();
			});
			if (!exist) {
				this.favoritePairs.push(pairName);
			}
		},
		removeFromFavorites(pairName) {
			const index = _.findIndex(this.favoritePairs, item => {
				return item.toLowerCase() === pairName.toLowerCase();
			});
			if (index !== -1) {
				this.favoritePairs.splice(index, 1);
			}
		},
		isPairFavorite(pairName) {
			const pairIndex = this.favoritePairs.indexOf(pairName);
			return pairIndex !== -1;
		},
		switchFavoriteSorting() {
			const isSelectedFavorite = this.selectedMarket === 'favorites';
			if (isSelectedFavorite) this.selectedMarket = this.prevSelectedMarket;
			else this.selectedMarket = 'favorites';
		},

		getPercentColorClass(percent) {
			if (percent > 0) return 'text-success';
			else if (percent < 0) return 'text-danger';
			else return '';
		},

		switchSearchShowAndClearField() {
			this.isSearch = !this.isSearch;
			this.tickersSearchQuery = '';
		},

		setSortingToLocalStorage(sorting) {
			localStorage.setItem('tickersSorting', sorting);
		},
	},

	watch: {
		favoritePairs(val) {
			if (typeof Storage !== 'undefined') {
				localStorage.setItem('tickersFavorites', JSON.stringify(val));
			}
		},
		selectedTradingMarket(val) {
			if (this.selectedMarket !== 'favorites' && val) {
				this.selectedmarket = val.toUpperCase();
			}
		},
		selectedMarket(val, oldVal) {
			this.setPrevSelectedMarket(oldVal);
		},
	},

	mounted() {
		this.selectedMarket = this.selectedTradingMarket ? this.selectedTradingMarket.toUpperCase() : this.market;

		if (typeof Storage !== 'undefined') {
			const savedFavoriteTickers = localStorage.getItem('tickersFavorites');
			if (savedFavoriteTickers) {
				this.favoritePairs = JSON.parse(savedFavoriteTickers);
			}

			const sortType = localStorage.getItem('tickersSorting');
			if (sortType) this.tickersSorting = sortType;
		}
	},
};
</script>

<style scoped lang="sass">
.trading-tickers-list
	display: flex
	flex-flow: column
	flex-grow: 1
	padding: 16px

	&__header
		display: flex
		justify-content: space-between
		align-items: center
		height: 32px
		.v-btn
			z-index: 3 !important

	&__header-search
		width: 100%
		padding-right: 8px
		padding-top: 9px !important

	&__header-actions
		display: flex
		align-items: center

	&__content-wrapper
		display: flex
		flex-flow: column
		flex-grow: 1

	&__table-header
		height: 35px

	&__header-item--favorite
		cursor: pointer
	&__header-favorite-wrapper
		display: flex
		justify-content: center
		align-items: center
		i
			padding-bottom: 2px

	&__header-item--pair
		cursor: pointer
		&:hover
			color: rgba(0, 0, 0, 0.87) !important

	&__header-item--volume
		cursor: pointer
		&:hover
			color: rgba(0, 0, 0, 0.87) !important

	&__header-item--change
		cursor: pointer
		margin-right: 8px !important
		&:hover
			color: rgba(0, 0, 0, 0.87) !important

	&__body-favorite-wrapper
		display: flex
		align-items: center
		justify-content: center

	&__pair-link
		padding-left: 4px
		text-decoration: none
		color: unset

	&__body-item--change
		margin-right: 8px !important

	::v-deep .v-data-table__wrapper
		padding-right: 8px
		margin-top: 8px

.theme--dark
	.trading-tickers-list
		&__header-item--pair:hover
			color: #edf0f2 !important
		&__header-item--volume:hover
			color: #edf0f2 !important
		&__header-item--change:hover
			color: #edf0f2 !important
</style>
