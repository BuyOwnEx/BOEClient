<template>
	<form class="bmf" @submit.prevent="sendBidMarket">
		<input name="type" type="hidden" value="MARKET" />
		<input name="currency" type="hidden" :value="currency" />
		<input name="market" type="hidden" :value="market" />
		<input name="side" type="hidden" value="0" />
		<input name="base" type="hidden" value="0" />

		<div>
			<v-text-field
				v-model="form.amount"
				ref="bid_market_amount"
				:label="$t('trading.order.direction.buy')"
				type="text"
				outlined
				dense
				hide-details
				@keydown="validateNumber($event)"
			>
				<template v-slot:append>
					<span class="button-currency-text">{{ currency.toUpperCase() }}</span>
				</template>
			</v-text-field>

			<div class="bmf__percents">
				<v-btn
					:input-value="form.amount === '25'"
					text
					small
					outlined
					tile
					@click="setAmount(25)"
				>
					<span>25 %</span>
				</v-btn>
				<v-btn
					:input-value="form.amount === '50'"
					text
					small
					outlined
					tile
					@click="setAmount(50)"
				>
					<span>50 %</span>
				</v-btn>
				<v-btn
					:input-value="form.amount === '75'"
					text
					small
					outlined
					tile
					@click="setAmount(75)"
				>
					<span>75 %</span>
				</v-btn>
				<v-btn
					:input-value="form.amount === '100'"
					text
					small
					outlined
					tile
					@click="setAmount(100)"
				>
					<span>100 %</span>
				</v-btn>
			</div>

			<div class="bmf__volume">
				<v-text-field
					v-model="volume"
					ref="bid_market_volume"
					:label="$t('trading.volume')"
					type="text"
					outlined
					dense
					hide-details
					@keydown="validateNumber($event)"
				>
					<template v-slot:append>
						<span class="button-currency-text">{{
							currency.toUpperCase()
						}}</span>
					</template>
				</v-text-field>
				<div class="bmf__text-field-hint">
					{{
						$t('trading.order.pay_market_buy', [fee_visible]) +
							' ' +
							currency.toUpperCase()
					}}
				</div>
			</div>

			<div class="bmf__margin" v-if="useMargin">
				<v-select
					v-model="form.offer"
					:items="offers_select"
					:label="$t('trading.order.offer')"
					item-text="name"
					item-value="id"
					dense
					hide-details
				>
				</v-select>
			</div>

			<div v-if="!useMargin" class="bmf__params">
				<TradingFormsInfoTooltip>
					<v-text-field
						v-model="form.sl_rate"
						ref="bid_limit_sl_rate"
						:label="$t('trading.order.sl_rate')"
						:disabled="!additionalParamsEnabled"
						type="text"
						outlined
						dense
						hide-details
						@keydown="validateNumber($event)"
					>
						<template v-slot:append>
							<span class="button-currency-text">
								{{ market.toUpperCase() }}
							</span>
						</template>
					</v-text-field>
					<template #text>
						{{ $t('trading.forms.stop_loss_info') }}
					</template>
				</TradingFormsInfoTooltip>

				<TradingFormsInfoTooltip>
					<v-text-field
						v-model="form.tp_rate"
						style="margin-top: 6px"
						ref="bid_limit_tp_rate"
						:label="$t('trading.order.tp_rate')"
						:disabled="!additionalParamsEnabled"
						type="text"
						outlined
						dense
						hide-details
						@keydown="validateNumber($event)"
					>
						<template v-slot:append>
							<span class="button-currency-text">
								{{ market.toUpperCase() }}
							</span>
						</template>
					</v-text-field>
					<template #text>
						{{ $t('trading.forms.take_profit_info') }}
					</template>
				</TradingFormsInfoTooltip>

				<TradingFormsInfoTooltip>
					<v-text-field
						v-model="form.ts_offset"
						style="margin-top: 6px"
						ref="bid_limit_ts_offset"
						:label="$t('trading.order.ts_offset')"
						:disabled="!additionalParamsEnabled"
						type="text"
						outlined
						dense
						hide-details
						@keydown="validateNumber($event)"
					>
						<template v-slot:append>
							<span class="button-currency-text">{{
								market.toUpperCase()
							}}</span>
						</template>
					</v-text-field>
					<template #text>
						{{ $t('trading.forms.trailing_stop_info') }}
					</template>
				</TradingFormsInfoTooltip>
			</div>
		</div>

		<div>
			<div class="bmf__switch">
				<div v-if="marginTradingAvailable" class="d-flex justify-start">
					<v-switch
						v-model="useMargin"
						:label="$t('trading.order.use_margin')"
						hide-details
						left
						dense
						inset
					/>
				</div>
				<div v-if="!useMargin" class="d-flex justify-start">
					<v-switch
						v-model="additionalParamsEnabled"
						:label="$t('trading.order.use_additional_params')"
						hide-details
						left
						dense
						inset
					/>
				</div>
			</div>
			<div class="bmf__footer mt-2">
				<TradingFormsConfirmDialog
					order-type="market"
					action-type="buy"
					:amount="form.amount"
					:currency="currency"
					:market="market"
					:is-additional-params="additionalParamsEnabled"
					:stop-loss="form.sl_rate"
					:take-profit="form.tp_rate"
					:trailing-stop="form.ts_offset"
					@confirm="sendBidMarket"
				>
					<v-btn color="success" height="24" block>
						{{ $t('trading.order.direction.buy') }}
					</v-btn>
				</TradingFormsConfirmDialog>

				<div class="bmf__footer__available text-center">
					{{ $t('trading.order.available') }}
					<span class="bmf__footer__balance" @click="setAmount(100)">
						{{ formatWithScaleInAllCurrencies(balance, market) }}
					</span>
					{{ market.toUpperCase() }}
				</div>
			</div>
		</div>
	</form>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import TradingFormsInfoTooltip from '../common/TradingFormsInfoTooltip';
import TradingFormsConfirmDialog from '../common/TradingFormsConfirmDialog';

import formatWithScaleInAllCurrencies from '../../../../mixins/common/formatWithScaleInAllCurrencies';

export default {
	name: 'BidMarketForm',

	components: { TradingFormsInfoTooltip, TradingFormsConfirmDialog },

	mixins: [formatWithScaleInAllCurrencies],

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			form: {
				type: 'MARKET',
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
				side: 0,
				base: 0,
				amount: 0,
				sl_rate: null,
				tp_rate: null,
				ts_offset: null,
				offer: 0,
			},
			additionalParamsEnabled: false,
			volume: 0,
			useMargin: false,
			offers: [],
		};
	},

	computed: {
		isAuth() {
			return this.$store.getters['app/isLogged'];
		},
		balances() {
			return this.$store.state.user.balances;
		},
		offers_select() {
			let self = this;
			return _.map(this.offers, function(value) {
				return {
					id: value.id,
					name: self.$t(
						'trading.order.offer_option',
						BigNumber(value.percent).toString(),
						BigNumber(value.days).toString(),
						BigNumber(value.amount).toString(),
						self.market.toUpperCase()
					),
				};
			});
		},
		tickersFromStorage() {
			return this.$store.state.tickers.tickersList;
		},
		bestAsk() {
			let ticker = _.find(
				this.tickersFromStorage,
				item =>
					item.currency.toUpperCase() === this.currency.toUpperCase() &&
					item.market.toUpperCase() === this.market.toUpperCase()
			);
			return ticker.ask;
		},
		markets() {
			return _.get(
				this.$store.state.tickers.markets,
				this.market.toUpperCase(),
				null
			);
		},
		selectedMarket() {
			if (this.markets === null) {
				return null;
			}
			let market = _.find(
				this.markets,
				item => item.currency.toUpperCase() === this.currency.toUpperCase()
			);
			return market === undefined ? null : market;
		},
		amountScale() {
			return this.selectedMarket === null
				? 2
				: parseInt(this.selectedMarket.amountScale);
		},
		rateScale() {
			return this.selectedMarket === null
				? 2
				: parseInt(this.selectedMarket.rateScale);
		},
		minAmount() {
			return this.selectedMarket === null
				? 0
				: parseInt(this.selectedMarket.minAmount);
		},
		marginTradingAvailable() {
			return this.selectedMarket === null ? false : this.selectedMarket.margin;
		},
		fee_currency() {
			if (this.isAuth) {
				let amount = _.get(this.balances, this.currency.toUpperCase(), 0.002);
				if (amount.fee !== undefined) {
					return BigNumber(amount.fee);
				}
				return BigNumber(amount);
			} else return BigNumber(0.002);
		},
		fee_visible() {
			return this.fee_currency.times(BigNumber(100)).toString();
		},
		balance() {
			if (this.isAuth) {
				let scale = 8;
				let amount = _.get(this.balances, this.market.toUpperCase(), 0);
				if (amount.available !== undefined) {
					return BigNumber(amount.available).dp(scale, 1);
				}
				return BigNumber(0).dp(scale, 1);
			} else return BigNumber(0);
		},
		isAdditionalParams() {
			return this.additionalParamsEnabled;
		},
	},

	methods: {
		BigNumber(item) {
			return BigNumber(item).toString();
		},
		isNumeric: function(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		updateVolume() {
			this.volume = BigNumber(this.form.amount)
				.times(BigNumber(1 - this.fee_currency))
				.toString();
		},
		updateOffers() {
			if (this.useMargin) {
				this.getOffers();
			}
		},
		getOffers() {
			let queryParams = {
				params: {
					currency: this.currency.toUpperCase(),
					market: this.market.toUpperCase(),
					amount:
						this.form.amount === ''
							? 0
							: BigNumber(this.form.amount).toString(),
					side: 0,
					type: 'MARKET',
				},
			};
			axios.get('/trader/ext/get_offer_list', queryParams).then(response => {
				console.log(response.data);
				this.offers = response.data;
			});
		},
		updateAmount() {
			let oldAmount = this.form.amount;
			let newAmount = BigNumber(this.volume)
				.div(BigNumber(1 - this.fee_currency))
				.decimalPlaces(this.amountScale, 1)
				.toString();

			let prevHasDot = /\.$/.test(oldAmount);
			let newHasDot = /\./.test(newAmount);
			let prevEndsWithDotWithZeroes = /\.0+$/.test(oldAmount);

			// BigNumber конвертация отрезает точки и нули.
			if (!newHasDot) {
				if (prevHasDot) {
					// старое заканчивается на точку без нулей, но в новом нет точки: добавляем точку
					newAmount += '.';
				} else if (prevEndsWithDotWithZeroes) {
					// старое заканчивается на точку и нули, но в новом нет точки (и нулей тоже нет): добавляем точку и потерянное количество нулей
					let matches = oldAmount.match(/\.0+$/);
					if (matches !== null) {
						newAmount += matches[0];
					}
				}
			}

			this.form.amount = newAmount;
		},
		setAmount(percents = 100) {
			if (this.bestAsk !== 0) {
				this.form.amount = this.balance
					.div(BigNumber(this.bestAsk))
					.div(100)
					.times(percents)
					.decimalPlaces(this.amountScale, 1)
					.toString();
			} else {
				this.form.amount = 0;
			}
		},
		sendBidMarket(event) {
			let form = this.additionalParamsEnabled
				? this.form
				: _.omit(this.form, ['sl_rate', 'tp_rate', 'ts_offset']);
			if (this.marginTradingAvailable) {
				form.margin = this.useMargin ? 1 : 0;
			} else form.margin = 0;
			axios.post('/trader/ext/order/market', form).then(response => {
				if (response.data.success === true) {
					console.log(response.data);
				}
			});
		},
		validateNumber: function(evt) {
			evt = evt ? evt : window.event;
			let charCode = evt.which ? evt.which : evt.keyCode;
			if (
				charCode > 31 &&
				(charCode < 48 || charCode > 57) &&
				(charCode < 96 || charCode > 105) &&
				charCode !== 46 &&
				charCode !== 35 &&
				charCode !== 36 &&
				charCode !== 37 &&
				charCode !== 39 &&
				evt.key != '.'
			) {
				evt.preventDefault();
			} else {
				return true;
			}
		},
	},

	watch: {
		useMargin(val, oldVal) {
			if (val) {
				this.getOffers();
				this.additionalParamsEnabled = false;
			}
		},
		currency(val, oldVal) {
			this.$set(this.form, 'currency', val.toUpperCase());
			this.$set(this.form, 'amount', '');
		},
		market(val, oldVal) {
			this.$set(this.form, 'market', val.toUpperCase());
			this.$set(this.form, 'amount', '');
		},
		volume: function(newVolume, oldVolume) {
			if (this.isNumeric(newVolume) || newVolume === '') {
				let rl = new RegExp(
					'\\d+\\.\\d{' + (this.amountScale + this.rateScale + 4) + ',}',
					'i'
				);
				if (rl.test(newVolume)) {
					this.volume = oldVolume;
					this.$refs.bid_market_volume.lazyValue = oldVolume;
				} else {
					if (this.bestAsk !== 0 && this.volume !== '' && this.volume !== 0) {
						this.debouncedUpdateAmount();
					}
				}
			} else {
				this.volume = 0;
			}
		},
		'form.amount': function(newAmount, oldAmount) {
			if (this.isNumeric(newAmount) || newAmount === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.amountScale + 1) + ',}', 'i');
				if (rl.test(newAmount)) {
					this.form.amount = oldAmount;
					this.$refs.bid_market_amount.lazyValue = oldAmount;
				} else if (newAmount === '' || newAmount === 0) {
					this.form.amount = newAmount;
				} else {
					this.form.amount = newAmount;
				}
			} else {
				this.form.amount = 0;
			}
			this.debouncedUpdateVolume();
			this.debouncedUpdateOffers();
		},
		'form.sl_rate': function(newSlRate, oldSlRate) {
			if (this.isNumeric(newSlRate) || newSlRate === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.rateScale + 1) + ',}', 'i');
				if (rl.test(newSlRate)) {
					this.form.sl_rate = oldSlRate;
					this.$refs.bid_market_sl_rate.lazyValue = oldSlRate;
				} else {
					this.form.sl_rate = newSlRate;
				}
			} else {
				this.form.sl_rate = 0;
			}
		},
		'form.tp_rate': function(newTpRate, oldTpRate) {
			if (this.isNumeric(newTpRate) || newTpRate === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.rateScale + 1) + ',}', 'i');
				if (rl.test(newTpRate)) {
					this.form.tp_rate = oldTpRate;
					this.$refs.bid_market_tp_rate.lazyValue = oldTpRate;
				} else {
					this.form.tp_rate = newTpRate;
				}
			} else {
				this.form.tp_rate = 0;
			}
		},
		'form.ts_offset': function(newTsOffset, oldTsOffset) {
			if (this.isNumeric(newTsOffset) || newTsOffset === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.rateScale + 1) + ',}', 'i');
				if (rl.test(newTsOffset)) {
					this.form.ts_offset = oldTsOffset;
					this.$refs.bid_market_ts_offset.lazyValue = oldTsOffset;
				} else {
					this.form.ts_offset = newTsOffset;
				}
			} else {
				this.form.ts_offset = 0;
			}
		},
	},

	mounted() {
		this.debouncedUpdateAmount = _.debounce(this.updateAmount, 50);
		this.debouncedUpdateVolume = _.debounce(this.updateVolume, 50);
		this.debouncedUpdateOffers = _.debounce(this.updateOffers, 1000);
	},
};
</script>

<style scoped lang="scss">
.bmf {
	display: flex;
	flex-flow: column;
	flex-grow: 1;
	justify-content: space-between;

	&__volume {
		height: 60px;
		margin: 6px 0;
	}

	&__percents {
		display: grid;
		grid-gap: 2px;
		grid-template-columns: repeat(4, 1fr);
		margin: -6px 0 16px;
	}

	&__text-field-hint {
		line-height: 1;
		font-size: 0.75rem;
		padding: 0 12px;
		margin-top: -6px;
		opacity: 0.6;
	}

	&__footer {
		&__available {
			font-size: 11px;
		}
		&__balance {
			cursor: pointer;
		}
	}
}
</style>
