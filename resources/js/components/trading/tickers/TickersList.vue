<template>
	<v-card class='tickers-list pa-1'>
		<div class='tickers-list__header'>
			<div v-if='!isSearch' class='tickers-list__header__markets'>
				<v-btn
					v-if='marketsFromStorage !== null'
					v-for='market in markets'
					class='mr-1'
					:key='market'
					:class='{ selected: market === selectedMarket }'
					:input-value='selectedMarket === market'
					text
					small
					@click='selectedMarket = market'
				>
					<span>{{ market }}</span>
				</v-btn>
			</div>

			<div v-if='isSearch' class='tickers-list__header__search'>
				<v-text-field
					v-model='tickersSearchQuery'
					:label="$vuetify.lang.translator('trading.search')"
					color='#a6a6a6'
					outlined
					dense
					hide-details
				>
				</v-text-field>
			</div>

			<div class='tickers-list__header__actions'>
				<span class='tickers-list__header__actions__search '>
					<v-btn icon @click='switchSearchShowAndClearField'>
						<v-icon>mdi-magnify</v-icon>
					</v-btn>
				</span>
			</div>
		</div>

		<div class='tickers-list__content-wrapper'>
			<v-simple-table
				v-if='tickersList && tickersListFilteredAndSorted.length > 0'
				class='tickers-list__content'
				:height='calculateTableHeight'
				dense
				fixed-header
			>
				<template v-slot:default>
					<thead class='tickers-list__content__header'>
					<tr>
						<th
							class='tickers-list__content__header__item--favorite'
							@click='switchFavoriteSorting'
						>
								<span
									class='tickers-list__content__header__item--favorite__wrapper'
								>
									<v-icon
										v-if="selectedMarket !== 'favorites'"
										color='#b0b29c'
										small
									>
										mdi-star
									</v-icon>
									<v-icon
										v-if="selectedMarket === 'favorites'"
										color='#FFE040'
										small
									>
										mdi-star
									</v-icon>
								</span>
						</th>
						<th
							class='tickers-list__content__header__item--pair'
							@click="setSorting('pair')"
						>
								<span>
									{{ $vuetify.lang.translator('trading.market') }}
								</span>
							<v-icon v-if="tickersSorting === 'pairAsc'" small>
								mdi-arrow-up
							</v-icon>
							<v-icon v-if="tickersSorting === 'pairDesc'" small>
								mdi-arrow-down
							</v-icon>
						</th>
						<th class='tickers-list__content__header__item--rate'>
							{{ $vuetify.lang.translator('trading.rate') }}
						</th>
						<th
							class='tickers-list__content__header__item--volume'
							@click="setSorting('volume')"
						>
								<span>
									{{ $vuetify.lang.translator('trading.sort.volume') }}
								</span>
							<v-icon v-if="tickersSorting === 'volumeDesc'" small>
								mdi-arrow-down
							</v-icon>
							<v-icon v-if="tickersSorting === 'volumeAsc'" small>
								mdi-arrow-up
							</v-icon>
						</th>
						<th
							class='tickers-list__content__header__item--change'
							@click="setSorting('change')"
						>
								<span>
									{{ $vuetify.lang.translator('trading.sort.change') }}
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

					<tbody class='tickers-list__content__body'>
					<tr
						v-for='item in tickersListFilteredAndSorted'
						:key='item.pairName'
					>
						<td class='tickers-list__content__body__item--favorite'>
							<div
								class='tickers-list__content__body__item--favorite__wrapper'
							>
								<v-icon
									v-if='isPairFavorite(item.pairName)'
									color='#FFE040'
									small
									@click='removeFromFavorites(item.pairName)'
								>
									mdi-star
								</v-icon>
								<v-icon
									v-if='!isPairFavorite(item.pairName)'
									color='#b0b29c'
									small
									@click='addToFavorites(item.pairName)'
								>
									mdi-star
								</v-icon>
							</div>
						</td>

						<td class='tickers-list__content__body__item--pair'>
							<a
								href='#'
								class='tickers-list__content__body__item--pair__link'
								@click.prevent='
										selectMarketAndCurrency(item.market, item.currency)
									'
							>
								<strong
									class='tickers-list__content__body__item--pair__currency'
								>
									{{ item.currency }}
								</strong>
							</a>
						</td>

						<td class='tickers-list__content__body__item--cost'>
							{{ BigNumber(item.latest).toString() }}
						</td>

						<td class='tickers-list__content__body__item--volume'>
							{{ item.volumeReadable }}
						</td>

						<td
							class='tickers-list__content__body__item--change'
							:class='getPercentColorClass(item.changePercent)'
						>
							<span>{{ item.changePercent }}</span>
							<span>%</span>
						</td>
					</tr>
					</tbody>
				</template>
			</v-simple-table>
			<div v-else-if='isNotLoadedOrTickersNotFound' class='text-center mt-2'>
				{{ $vuetify.lang.translator('trading.not_found') }}
			</div>
		</div>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	name: 'TickersList',

	props: {
		market: {
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
			isPageLoading: true,
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
			if (
				this.tickersFromStorage === null ||
				this.marketsFromStorage === null
			) {
				return [];
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
							.div(BigNumber(item.previous_day));
					}
				}

				let amountScale = 6;
				let rateScale = 2;
				let currentMarket = this.marketsFromStorage[item.market.toUpperCase()];
				if (currentMarket !== undefined) {
					let currentPair = _.find(currentMarket, marketArray => {
						return (
							marketArray.currency.toLowerCase() === item.currency.toLowerCase()
						);
					});
					if (currentPair !== undefined) {
						amountScale = currentPair.amountScale;
						rateScale = currentPair.rateScale;
					}
				}
				return {
					pairName:
						item.currency.toUpperCase() + '/' + item.market.toUpperCase(),
					market: item.market,
					currency: item.currency,
					margin: item.margin,
					volume: item.volume,
					volumeReadable: BigNumber(item.volume)
						.dp(amountScale + rateScale)
						.toFixed(2)
						.toString(),
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
			if (
				this.tickersSearchQuery !== '' &&
				this.selectedMarket !== 'favorites'
			) {
				return _.filter(this.tickersList, item => {
					return (
						item.pairName
							.toLowerCase()
							.indexOf(this.tickersSearchQuery.toLowerCase()) !== -1
					);
				});
			}
			if (this.selectedMarket === 'favorites') {
				if (this.tickersSearchQuery !== '') {
					return _.filter(this.allFavorites, item => {
						return (
							item.pairName
								.toLowerCase()
								.indexOf(this.tickersSearchQuery.toLowerCase()) !== -1
						);
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
					return _.sortBy(this.tickersListFiltered, item =>
						parseFloat(item.changePercent),
					);
				case 'changeDesc':
					return _.sortBy(
						this.tickersListFiltered,
						item => parseFloat(item.changePercent) * -1,
					);

				case 'volumeAsc':
					return _.sortBy(this.tickersListFiltered, item =>
						parseFloat(item.volume),
					);
				case 'volumeDesc':
				default:
					return _.sortBy(
						this.tickersListFiltered,
						item => parseFloat(item.volume) * -1,
					);
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
			const mid = deviceWidth > 960 && deviceWidth <= 1264;

			if (mobile) return undefined;
			else if (mid) return 185;
			else return 365;
		},
		isNotLoadedOrTickersNotFound() {
			if (this.isPageLoading) return true;
			return !this.tickersList || this.tickersListFilteredAndSorted.length <= 0;
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
			let sort = this.tickersSorting;
			switch (type) {
				case 'pair':
					if (sort === 'pairAsc') {
						this.tickersSorting = 'pairDesc';
					} else if (sort === 'pairDesc') {
						this.tickersSorting = '';
					} else {
						this.tickersSorting = 'pairAsc';
					}
					break;

				case 'change':
					if (sort === 'changeAsc') {
						this.tickersSorting = 'changeDesc';
					} else if (sort === 'changeDesc') {
						this.tickersSorting = '';
					} else {
						this.tickersSorting = 'changeAsc';
					}
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
			}
		},
		setPrevSelectedMarket(prevMarket) {
			this.prevSelectedMarket = prevMarket;
		},

		addToFavorites(pairName) {
			let exist = _.find(this.favoritePairs, item => {
				return item.toLowerCase() === pairName.toLowerCase();
			});
			if (exist === undefined) {
				this.favoritePairs.push(pairName);
			}
		},
		removeFromFavorites(pairName) {
			let index = _.findIndex(this.favoritePairs, item => {
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
	},

	watch: {
		favoritePairs(val, oldVal) {
			if (typeof Storage !== 'undefined') {
				localStorage.setItem('tickersFavorites', JSON.stringify(val));
			}
		},
		selectedTradingMarket(val, oldVal) {
			if (this.selectedMarket !== 'favorites' && val) {
				this.selectedmarket = val.toUpperCase();
			}
		},
		selectedMarket(val, oldVal) {
			this.setPrevSelectedMarket(oldVal);
		},
	},

	mounted() {
		this.isPageLoading = false;

		this.selectedMarket = this.selectedTradingMarket
			? this.selectedTradingMarket.toUpperCase()
			: this.market;

		if (typeof Storage !== 'undefined') {
			let savedFavoriteTickers = localStorage.getItem('tickersFavorites');
			if (savedFavoriteTickers !== null) {
				this.favoritePairs = JSON.parse(savedFavoriteTickers);
			}
		}
	},
	/*beforeMount() {
            if (this.marketsFromStorage === null) {
                this.$store.dispatch('tickers/getMarketDataFromServer').then(() => {
                    if (this.tickersFromStorage === null) {
                        this.$store.dispatch('tickers/getTickersListFromServer')
                    }
                });
            }
        }*/
};
</script>

<style scoped lang='sass'>
.tickers-list
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

		&__search
			width: 100%
			padding-right: 8px
			padding-top: 6px !important

			::v-deep.v-input .v-text-field--outlined
				max-height: 30px

			::v-deep.v-input .v-input--dense
				max-height: 30px

			::v-deep.v-input .v-input__control
				max-height: 30px

			::v-deep.v-input .v-input__slot
				max-height: 30px

			::v-deep.v-input fieldset
				max-height: 30px

			::v-deep.v-input .v-text-field__slot
				max-height: 30px

			::v-deep.v-input .v-text-field__slot .v-label
				top: 3px

			::v-deep.v-text-field--outlined.v-input--dense .v-label--active
				transform: translateY(-12px) scale(0.75)

			::v-deep.v-input--selection-controls
				margin-top: 8px

			::v-deep.v-input__append-inner
				margin-top: 6px

			::v-deep input
				padding-bottom: 12px

		&__actions
			display: flex
			align-items: center

	&__content-wrapper
		display: flex
		flex-flow: column
		flex-grow: 1

	&__content
		&__header
			height: 35px

			&__item
				&--favorite
					cursor: pointer

					&__wrapper
						display: flex
						justify-content: center
						align-items: center

						i
							padding-bottom: 2px

				&--pair
					cursor: pointer

				&--volume
					cursor: pointer

				&--change
					cursor: pointer
					text-align: right !important
					margin-right: 8px !important

		&__body
			&__item
				&--favorite
					&__wrapper
						display: flex
						align-items: center
						justify-content: center

				&--pair
					&__link
						padding-left: 4px
						text-decoration: none
						color: unset

				&--change
					text-align: right
					margin-right: 8px !important

	::v-deep .v-data-table__wrapper
		padding-right: 8px
		margin-top: 8px
</style>
