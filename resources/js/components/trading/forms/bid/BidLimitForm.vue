<template>
	<form class="blf" @submit.prevent="sendBidLimit">
		<input name="type" type="hidden" value="LIMIT" />
		<input name="currency" type="hidden" :value="currency" />
		<input name="market" type="hidden" :value="market" />
		<input name="side" type="hidden" value="0" />

		<div>
			<v-text-field
				v-model="form.amount"
				ref="bid_limit_amount"
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

			<div class="blf__percents">
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

			<v-text-field
				v-model="form.rate"
				ref="bid_limit_rate"
				:label="$t('table_header.rate_per') + ' ' + currency.toUpperCase()"
				type="text"
				outlined
				dense
				hide-details
				@keydown="validateNumber($event)"
			>
				<template v-slot:append>
					<span class="button-currency-text">{{ market.toUpperCase() }}</span>
				</template>
			</v-text-field>

			<div class="blf__volume">
				<v-text-field
					v-model="volume"
					ref="bid_limit_volume"
					:label="$t('table_header.volume')"
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
				<div class="blf__text-field-hint">
					{{
						$t('trading.order.pay_limit_buy', [fee_visible]) +
							' ' +
							currency.toUpperCase()
					}}
				</div>
			</div>

			<div class="blf__margin" v-if="useMargin">
				<v-select
					v-model="form.offer"
					:items="offers_select"
					:label="$t('trading.order.offer')"
					item-text="name"
					item-value="id"
					dense
					hide-details
				/>
			</div>

			<div v-if="!useMargin" class="blf__params">
				<CommonTooltip>
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
				</CommonTooltip>

				<CommonTooltip>
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
				</CommonTooltip>

				<CommonTooltip>
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
				</CommonTooltip>
			</div>
		</div>

		<div>
			<div class="blf__switch">
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
			<div class="blf__footer mt-2">
				<TradingFormsConfirmDialog
					order-type="limit"
					action-type="buy"
					:amount="form.amount"
					:price="form.rate"
					:currency="currency"
					:market="market"
					:is-additional-params="additionalParamsEnabled"
					:stop-loss="form.sl_rate"
					:take-profit="form.tp_rate"
					:trailing-stop="form.ts_offset"
					@confirm="sendBidLimit"
				>
					<v-btn color="success" height="24" block>
						{{ $t('trading.order.direction.buy') }}
					</v-btn>
				</TradingFormsConfirmDialog>

				<div class="blf__footer__available text-center">
					{{ $t('trading.order.available') }}
					<span class="blf__footer__balance" @click="setAmount(100)">
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

import CommonTooltip from '../../../common/CommonTooltip';
import TradingFormsConfirmDialog from '../common/TradingFormsConfirmDialog';

import formatWithScaleInAllCurrencies from '../../../../mixins/format/formatWithScaleInAllCurrencies';
import showNotificationMixin from '../../../../mixins/common/showNotificationMixin';

export default {
	name: 'BidLimitForm',

	components: { CommonTooltip, TradingFormsConfirmDialog },

	mixins: [formatWithScaleInAllCurrencies, showNotificationMixin],

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

	data() {
		return {
			form: {
				type: 'LIMIT',
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
				side: 0,
				amount: 0,
				rate: 0,
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
		activeTicker() {
			return this.$store.getters.activeTicker;
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
			if (this.form.rate !== '' && this.form.rate !== 0) {
				this.form.amount = this.balance
					.div(BigNumber(this.form.rate))
					.div(100)
					.times(percents)
					.decimalPlaces(this.amountScale, 1)
					.toString();
			} else {
				this.form.amount = 0;
			}
		},
		getOffers() {
			let app = this;
			let queryParams = {
				params: {
					currency: this.market.toUpperCase(),
					amount:
						this.form.amount === ''
							? 0
							: this.form.rate === ''
							? 0
							: BigNumber(this.form.amount)
									.times(BigNumber(this.form.rate))
									.toString(),
					side: 0,
					type: 'LIMIT',
				},
			};
			axios.get('/trader/ext/get_offer_list', queryParams).then(response => {
				console.log(response.data);
				this.offers = response.data;
			});
		},
		sendBidLimit() {
			if (!this.form.amount) {
				this.pushErrorNotification(_, 'incorrect');
				return
			}

			let form = this.additionalParamsEnabled
				? this.form
				: _.omit(this.form, ['sl_rate', 'tp_rate', 'ts_offset']);
			if (this.marginTradingAvailable) {
				form.margin = this.useMargin ? 1 : 0;
			} else form.margin = 0;
			axios.post('/trader/ext/order/limit', form).then(response => {
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
		setFormRate({ price }) {
			this.form.rate = price;
		},
		getRateFromTicker() {
			if (!this.activeTicker) {
				return;
			}
			this.form.rate = BigNumber(this.activeTicker.ask)
				.dp(this.rateScale, 1)
				.toString();
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
			this.getRateFromTicker();
		},
		market(val, oldVal) {
			this.$set(this.form, 'market', val.toUpperCase());
			this.$set(this.form, 'amount', '');
			this.getRateFromTicker();
		},
		volume: function(newVolume, oldVolume) {
			if (this.isNumeric(newVolume) || newVolume === '') {
				let rl = new RegExp(
					'\\d+\\.\\d{' + (this.amountScale + this.rateScale + 4) + ',}',
					'i'
				);
				if (rl.test(newVolume)) {
					this.volume = oldVolume;
					this.$refs.bid_limit_volume.lazyValue = oldVolume;
				} else {
					if (
						this.form.rate !== '' &&
						this.volume !== '' &&
						this.form.rate !== 0 &&
						this.volume !== 0
					) {
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
					this.$refs.bid_limit_amount.lazyValue = oldAmount;
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
		'form.rate': function(newRate, oldRate) {
			if (this.isNumeric(newRate) || newRate === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.rateScale + 1) + ',}', 'i');
				if (rl.test(newRate)) {
					this.form.rate = oldRate;
					this.$refs.bid_limit_rate.lazyValue = oldRate;
				} else {
					this.form.rate = newRate;
				}
			} else {
				this.form.rate = 0;
			}
			this.debouncedUpdateOffers();
		},
		'form.sl_rate': function(newSlRate, oldSlRate) {
			if (this.isNumeric(newSlRate) || newSlRate === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.rateScale + 1) + ',}', 'i');
				if (rl.test(newSlRate)) {
					this.form.sl_rate = oldSlRate;
					this.$refs.bid_limit_sl_rate.lazyValue = oldSlRate;
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
					this.$refs.bid_limit_tp_rate.lazyValue = oldTpRate;
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
					this.$refs.bid_limit_ts_offset.lazyValue = oldTsOffset;
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
	created() {
		this.$eventHub.$on('set-buy-price', this.setFormRate);
	},
	beforeDestroy() {
		this.$eventHub.$off('set-buy-price', this.setFormRate);
	},
	activated() {
		this.$eventHub.$on('set-buy-price', this.setFormRate);
	},
	deactivated() {
		this.$eventHub.$off('set-buy-price', this.setFormRate);
	},
};
</script>

<style scoped lang="scss">
.blf {
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
