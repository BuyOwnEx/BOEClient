<template>
	<form class="alf" @submit.prevent="sendAskLimit">
		<input name="type" type="hidden" value="LIMIT" />
		<input name="currency" type="hidden" :value="currency" />
		<input name="market" type="hidden" :value="market" />
		<input name="side" type="hidden" value="1" />

    <div class="d-flex flex-grow-0 flex-column">
      <div class="d-inline-block position-relative fill-height">
        <transition mode="out-in" name="slide-left">
          <div class="fill-height" v-if="!additionalParamsEnabled && !useMargin">
            <v-text-field
                v-model="form.rate"
                :label="$t('table_header.rate_per') + ' ' + currency.toUpperCase()"
                type="text"
                outlined
                dense
                hide-details
                v-maska:unmaskedRate.masked=rate_options
                @maska="updateVolumeRateChanged"
            >
              <template #append>
                <span class="button-currency-text">{{ market.toUpperCase() }}</span>
              </template>
            </v-text-field>

            <v-text-field
                v-model="form.amount"
                :label="$t('table_header.amount')"
                type="text"
                outlined
                dense
                hide-details
                v-maska:unmaskedAmount.masked=amount_options
                @maska="updateVolumeAmountChanged"
            >
              <template #append>
                <span class="button-currency-text">{{ currency.toUpperCase() }}</span>
              </template>
            </v-text-field>

            <v-slider
                v-model="percent"
                :min="0"
                :max="100"
                :step="1"
                :ticks="false"
                tile
                color="primary"
                thumb-color="primary"
                thumb-size="28"
                thumb-label
                hide-details
                @change="setAmount"
            ></v-slider>

            <div class="alf__volume">
              <v-text-field
                  v-model="volume"
                  :label="$t('table_header.volume')"
                  type="text"
                  outlined
                  dense
                  hide-details
                  v-maska:unmaskedVolume.masked=volume_options
                  @maska="updateAmountVolumeChanged"
              >
                <template #append>
                  <span class="button-currency-text">{{ market.toUpperCase() }}</span>
                </template>
              </v-text-field>
              <div class="alf__text-field-hint mb-1">
                {{ $t('table_header.fee') }}: {{ fee_visible }}% ~ {{ fee_amount }} {{ market.toUpperCase() }}
              </div>
            </div>
          </div>
          <div class="fill-height" v-else-if="additionalParamsEnabled && !useMargin">
            <div v-if="!useMargin && conditionalOrdersAvailable && additionalParamsEnabled" class="alf__params">
              <div class="mb-3 text--start pl-1">
                <span class="text--disabled" style="font-size: 10px;">
                    {{ $t('trading.forms.main_sell_order') }}
                    <span class="font-weight-bold text--uppercase">{{ form.amount }} {{ currency.toUpperCase() }}</span>
                    {{ $t('trading.forms.for_price') }}
                    <span class="font-weight-bold text--uppercase">{{ form.rate }} {{ market.toUpperCase() }}</span>
                </span>
              </div>

              <v-text-field
                  v-model="form.sl_rate"
                  :label="$t('trading.order.sl_rate')"
                  :disabled="!additionalParamsEnabled"
                  type="text"
                  outlined
                  dense
                  hide-details
                  v-maska:unmaskedSL.masked=rate_options
              >
                <template #append>
                  <span class="button-currency-text">
                    {{ market.toUpperCase() }}
                  </span>
                </template>
              </v-text-field>

              <v-text-field
                  v-model="form.tp_rate"
                  :label="$t('trading.order.tp_rate')"
                  :disabled="!additionalParamsEnabled"
                  type="text"
                  outlined
                  dense
                  hide-details
                  v-maska:unmaskedTP.masked=rate_options
              >
                <template #append>
                  <span class="button-currency-text">
                    {{ market.toUpperCase() }}
                  </span>
                </template>
              </v-text-field>

              <v-text-field
                  v-model="form.ts_offset"
                  :label="$t('trading.order.ts_offset')"
                  :disabled="!additionalParamsEnabled"
                  type="text"
                  outlined
                  dense
                  hide-details
                  v-maska:unmaskedTS.masked=rate_options
              >
                <template #append>
                  <span class="button-currency-text">{{ market.toUpperCase() }}</span>
                </template>
              </v-text-field>
              <div class="d-flex justify-space-around">
                <v-btn
                    color="primary"
                    class="align-center text-uppercase lc-custom"
                    tile
                    text
                    x-small
                    @click="setCondParams"
                >
                  {{ $t('common.apply') }}
                </v-btn>
                <v-btn
                    color="secondary"
                    class="align-center text-uppercase lc-custom"
                    tile
                    text
                    x-small
                    @click="resetCondParams"
                >
                  {{ $t('common.reset') }}
                </v-btn>
              </div>
            </div>
          </div>
          <div v-else-if="!additionalParamsEnabled && useMargin">
            <div class="alf__margin" v-if="useMargin && marginAvailable">
              <v-select
                  v-model="form.offer"
                  :items="offers_select"
                  :label="$t('trading.order.offer')"
                  item-text="name"
                  item-value="id"
                  dense
                  hide-details
              />
              <div class="d-flex justify-space-around mt-2 mb-1">
                <v-btn
                    color="primary"
                    class="align-center text-uppercase lc-custom"
                    tile
                    text
                    x-small
                    @click="setOfferParams"
                >
                  {{ $t('common.apply') }}
                </v-btn>
                <v-btn
                    color="secondary"
                    class="align-center text-uppercase lc-custom"
                    tile
                    text
                    x-small
                    @click="resetOfferParams"
                >
                  {{ $t('common.reset') }}
                </v-btn>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="alf__switch">
        <div v-if="!useMargin && conditionalOrdersAvailable && !isSetOffer" class="d-flex justify-start">
          <v-switch
              v-model="additionalParamsEnabled"
              :label="$t('trading.order.use_additional_params')"
              :disabled="!useCondOrdersEnabled"
              hide-details
              left
              dense
              inset
              :ripple="false"
              color="primary"
          />
        </div>
        <div v-if="marginTradingAvailable && marginAvailable && !additionalParamsEnabled && !showCondParams" class="d-flex justify-start">
          <v-switch
              v-model="useMargin"
              :label="$t('trading.order.use_margin')"
              :disabled="!useMarginEnabled"
              hide-details
              left
              dense
              inset
              :ripple="false"
              color="primary"
              @change="resetOffer"
          />
        </div>
      </div>
      <div class="alf__cond-params">
        <div class="alf__text-field-hint" v-if="showCondParams && isSetSL">
          + SL-MARKET: <span class="success--text text--uppercase font-weight-bold">{{ form.sl_rate }} {{ market.toUpperCase() }}</span>
        </div>
        <div class="alf__text-field-hint" v-if="showCondParams && isSetTP">
          + TP-MARKET: <span class="success--text text--uppercase font-weight-bold">{{ form.tp_rate }} {{ market.toUpperCase() }}</span>
        </div>
        <div class="alf__text-field-hint" v-if="showCondParams && isSetTS">
          + TS-MARKET: <span class="success--text text--uppercase font-weight-bold">{{ form.ts_offset }} {{ market.toUpperCase() }}</span>
        </div>
      </div>
      <div class="alf__offer-params">
        <div class="alf__text-field-hint" v-if="isSetOffer">
          + {{ $t('trading.leverage') }}: <span class="success--text text--uppercase font-weight-bold">x{{ leverageLevel }}</span>
        </div>
      </div>
    </div>

    <div class="alf__footer mt-2">
      <TradingFormsConfirmDialog
          order-type="limit"
          action-type="sell"
          :amount="form.amount"
          :price="form.rate"
          :currency="currency"
          :market="market"
          :is-additional-params="showCondParams"
          :stop-loss="form.sl_rate"
          :take-profit="form.tp_rate"
          :trailing-stop="form.ts_offset"
          :is-leverage="isSetOffer"
          :leverage-offer="selectedOffer"
          :leverage-level="leverageLevel"
          @confirm="sendAskLimit"
      >
        <v-btn color="error" height="24" block>
          {{ $t('trading.order.direction.sell') }}
        </v-btn>
      </TradingFormsConfirmDialog>

      <div class="alf__footer__available text-center mt-1">
        {{ $t('trading.order.available') }}
        <span class="alf__footer__balance">
						{{ formatWithScaleInAllCurrencies(balance, currency) }}
					</span>
        {{ currency.toUpperCase() }}
      </div>
    </div>
	</form>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import { vMaska } from "maska/vue";
import config from '@/configs';
import { mapState } from 'vuex';
import CommonTooltip from '@/components/common/CommonTooltip.vue';
import TradingFormsConfirmDialog from '@/components/trading/v2/forms/common/TradingFormsConfirmDialog.vue';
import formatWithScaleInAllCurrencies from '@/mixins/format/formatWithScaleInAllCurrencies';
import showNotificationMixin from '@/mixins/common/showNotificationMixin';

export default {
	name: 'AskLimitForm',
  directives: { maska: vMaska },
	components: { CommonTooltip, TradingFormsConfirmDialog },
	mixins: [formatWithScaleInAllCurrencies, showNotificationMixin],
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
				type: 'LIMIT',
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
				side: 1,
				amount: 0,
				rate: 0,
        sl_rate: '0',
        tp_rate: '0',
        ts_offset: '0',
				offer: null,
			},
			additionalParamsEnabled: false,
      useMargin: false,
      percent: 0,
      fee_amount: 0,
      volume: 0,
      offers: [],
      leverageLevel: 5
		};
	},

	computed: {
		...mapState('trading', ['best_ask', 'best_bid']),
		isAuth() {
			return this.$store.getters['app/isLogged'];
		},
    rate_options() {
      return {
        mask: '9.'+"#".repeat(this.rateScale),
        tokens: {
          9: { pattern: /[0-9]/, multiple: true }
        }
      }
    },
    amount_options() {
      return {
        mask: '9.'+"#".repeat(this.amountScale),
        tokens: {
          9: { pattern: /[0-9]/, multiple: true }
        }
      }
    },
    volume_options() {
      return {
        mask: '9.'+"#".repeat(this.rateScale + this.amountScale),
        tokens: {
          9: { pattern: /[0-9]/, multiple: true }
        }
      }
    },
    isSetOffer() {
      return this.form.offer !== null;
    },
    isSetSL() {
      return this.form.sl_rate !== null && this.form.sl_rate !== '0' && this.form.sl_rate !== '';
    },
    isSetTP() {
      return this.form.tp_rate !== null && this.form.tp_rate !== '0' && this.form.tp_rate !== '';
    },
    isSetTS() {
      return this.form.ts_offset !== null && this.form.ts_offset !== '0' && this.form.ts_offset !== '';
    },
    showCondParams() {
      return !!(this.isSetSL || this.isSetTP || this.isSetTS);
    },
		conditionalOrdersAvailable() {
			return config.product.type === 'startPlus' || config.product.type === 'full';
		},
		marginAvailable() {
			return config.product.type === 'full';
		},
		balances() {
			return this.$store.state.user.balances;
		},
    own_fees() {
      return this.$store.state.user.fees
          ? _.find(this.$store.state.user.fees, item => item.currency.toUpperCase() === this.currency.toUpperCase() && item.market.toUpperCase() === this.market.toUpperCase())
          : null;
    },
		offers_select() {
			return _.map(this.offers, value => {
				return {
					id: value.id,
					name: this.$t('trading.order.offer_option', [
						BigNumber(value.percent).toString(),
						BigNumber(value.days).toString(),
						BigNumber(value.amount).toString(),
						this.currency.toUpperCase(),
					]),
				};
			});
		},
		activeTicker() {
			return this.$store.getters.activeTicker;
		},
		markets() {
			return _.get(this.$store.state.tickers.markets, this.market.toUpperCase(), null);
		},
		selectedMarket() {
			if (this.markets === null) {
				return null;
			}
			let market = _.find(this.markets, item => item.currency.toUpperCase() === this.currency.toUpperCase());
			return market === undefined ? null : market;
		},
		amountScale() {
			return this.selectedMarket === null ? 2 : parseInt(this.selectedMarket.amountScale);
		},
		rateScale() {
			return this.selectedMarket === null ? 2 : parseInt(this.selectedMarket.rateScale);
		},
		minAmount() {
			return this.selectedMarket === null ? 0 : parseInt(this.selectedMarket.minAmount);
		},
		marginTradingAvailable() {
			return this.selectedMarket === null ? false : this.selectedMarket.margin;
		},
    fee_currency() {
			if(this.selectedMarket !== null)
			{
				if (this.isAuth) {
					if(this.form.rate > this.best_bid) {
						if(this.own_fees !== null && this.own_fees !== undefined)
						{
							return BigNumber(this.own_fees.maker_fee).div(100);
						}
						else return BigNumber(this.selectedMarket.makerFee).div(100);
					}
					else {
						if(this.own_fees !== null && this.own_fees !== undefined)
						{
							return BigNumber(this.own_fees.taker_fee).div(100);
						}
						else return BigNumber(this.selectedMarket.takerFee).div(100);
					}
				}
				else
				{
					if(this.form.rate > this.best_bid) {
						return BigNumber(this.selectedMarket.makerFee).div(100);
					}
					else return BigNumber(this.selectedMarket.takerFee).div(100);
				}
			}
			else return BigNumber(0);
		},
    fee_scale() {
      return this.rateScale + this.amountScale + Math.abs(this.fee_currency.e);
    },
		fee_visible() {
			return this.fee_currency.times(BigNumber(100)).toString();
		},
		balance() {
			if (this.isAuth) {
				let scale = 8;
				let amount = _.get(this.balances, this.currency.toUpperCase(), 0);
				if (amount.available !== undefined) {
					return BigNumber(amount.available).dp(scale, 1);
				}
				return BigNumber(0).dp(scale, 1);
			} else return BigNumber(0);
		},
    useCondOrdersEnabled() {
      return Number(this.form.amount) && Number(this.form.rate);
    },
		useMarginEnabled() {
			return Number(this.form.amount);
		},
		selectedOffer() {
			const selectedOfferID = this.form.offer;
			return this.offers?.find(item => item.id === selectedOfferID)
		}
	},

	watch: {
		useMargin(val) {
			if (val) {
				this.getOffers();
				this.additionalParamsEnabled = false;
			}
		},
		currency(val) {
			this.$set(this.form, 'currency', val.toUpperCase());
			this.$set(this.form, 'amount', '');
			this.getRateFromTicker();
			this.resetForm();
		},
		market(val) {
			this.$set(this.form, 'market', val.toUpperCase());
			this.$set(this.form, 'amount', '');
			this.getRateFromTicker();
		},
	},

	mounted() {

	},

	created() {
		this.$eventHub.$on('set-sell-price', this.setFormRate);
	},

	beforeDestroy() {
		this.$eventHub.$off('set-sell-price', this.setFormRate);
	},

	activated() {
		this.$eventHub.$on('set-sell-price', this.setFormRate);
	},

	deactivated() {
		this.$eventHub.$off('set-sell-price', this.setFormRate);
	},

	methods: {
		BigNumber(item) {
			return BigNumber(item).toString();
		},
		isNumeric(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
    updateVolumeRateChanged(event) {
      if (!this.useMarginEnabled) this.useMargin = false;
      if(event.detail.masked !== '')
      {
        this.volume = BigNumber(event.detail.masked)
            .times(BigNumber(this.form.amount))
            .decimalPlaces(this.amountScale + this.rateScale, 1)
            .toString();
        this.fee_amount = BigNumber(event.detail.masked)
            .times(this.form.amount)
            .times(this.fee_currency)
            .div(100)
            .decimalPlaces(this.fee_scale, 1)
            .toString();
      }
      else {
        this.volume = '0';
        this.fee_amount = '0';
      }
    },
    updateVolumeAmountChanged(event) {
      if (!this.useMarginEnabled) this.useMargin = false;
      if(event.detail.masked !== '')
      {
        this.volume = BigNumber(event.detail.masked)
            .times(BigNumber(this.form.rate))
            .decimalPlaces(this.amountScale + this.rateScale, 1)
            .toString();
        this.percent = BigNumber(event.detail.masked)
            .times(100)
            .div(this.balance)
            .decimalPlaces(0, 1)
            .toNumber();
        this.fee_amount = BigNumber(event.detail.masked)
            .times(this.form.rate)
            .times(this.fee_currency)
            .div(100)
            .decimalPlaces(this.fee_scale, 1)
            .toString();
      }
      else {
        this.volume = '0';
        this.percent = 0;
        this.fee_amount = '0';
      }
    },
    setAmount() {
      if (this.form.rate !== '' && this.form.rate !== '0') {
        this.form.amount = this.balance
            .times(this.percent)
            .div(100)
            .decimalPlaces(this.amountScale, 1)
            .toString();
        this.volume = BigNumber(this.form.rate)
            .times(this.form.amount)
            .decimalPlaces(this.amountScale + this.rateScale, 1)
            .toString();
        this.fee_amount = BigNumber(this.form.amount)
            .times(this.form.rate)
            .times(this.fee_currency)
            .div(100)
            .decimalPlaces(this.fee_scale, 1)
            .toString();
      } else {
        this.form.amount = '0';
        this.volume = '0';
        this.fee_amount = '0';
      }
    },
    updateAmountVolumeChanged(event) {
      if (!this.useMarginEnabled) this.useMargin = false;
      if(event.detail.masked !== '')
      {
        this.form.amount = BigNumber(event.detail.masked)
            .div(this.form.rate)
            .decimalPlaces(this.amountScale, 1)
            .toString();
        this.percent = BigNumber(this.form.amount)
            .times(100)
            .div(this.balance)
            .decimalPlaces(0, 1)
            .toNumber();
        this.fee_amount = BigNumber(this.form.rate)
            .times(this.form.amount)
            .times(this.fee_currency)
            .div(100)
            .decimalPlaces(this.fee_scale, 1)
            .toString();
      }
      else {
        this.form.amount = '0';
        this.percent = 0;
        this.fee_amount = '0';
      }
    },
    setCondParams() {
      this.additionalParamsEnabled = false;
    },
    setOfferParams() {
      this.useMargin = false;
    },
    resetCondParams() {
      this.form.sl_rate = '0';
      this.form.tp_rate = '0';
      this.form.ts_offset = '0';
      this.additionalParamsEnabled = false;
    },
    resetOfferParams() {
      this.form.offer = null;
      this.useMargin = false;
    },
    resetOffer() {
      if(!this.useMargin) this.form.offer = null
    },
		getOffers() {
			if (!this.marginTradingAvailable) return;
			const queryParams = {
				params: {
					currency: this.currency.toUpperCase(),
					amount: this.form.amount === '' ? 0 : BigNumber(this.form.amount).toString(),
					side: 1,
					type: 'LIMIT',
				},
			};
			axios.get('/trader/ext/get_offer_list', queryParams).then(response => {
				console.log(response.data);
				this.offers = response.data.offers;
			});
		},
		sendAskLimit() {
			if (!this.form.amount || this.form.amount === '0' || !this.form.rate || this.form.rate === '0') {
				this.pushErrorNotification(_, 'incorrect');
				return;
			}
      this.form.rate = BigNumber(this.form.rate).toString();
      this.form.amount = BigNumber(this.form.amount).toString();
      this.form.sl_rate = (this.form.sl_rate && this.form.sl_rate !== '0') ? BigNumber(this.form.sl_rate).toString() : null;
      this.form.tp_rate = (this.form.tp_rate && this.form.tp_rate !== '0') ? BigNumber(this.form.tp_rate).toString() : null;
      this.form.ts_offset = (this.form.ts_offset && this.form.ts_offset !== '0') ? BigNumber(this.form.ts_offset).toString() : null;
			let form = this.showCondParams ? this.form : _.omit(this.form, ['sl_rate', 'tp_rate', 'ts_offset']);
			if (this.marginTradingAvailable) {
				form.margin = this.useMargin ? 1 : 0;
			} else form.margin = 0;
			axios.post('/trader/ext/order/limit', form).then(response => {
				if (response.data.success === true) {
					console.log(response.data);
				}
			});
		},
		setFormRate({ price }) {
			this.form.rate = price;
		},
		getRateFromTicker() {
			if (!this.activeTicker) {
				return;
			}
			this.form.rate = BigNumber(this.activeTicker.bid)
				.dp(this.rateScale, 1)
				.toString();
		},
		resetForm() {
			this.useMargin = false;
			this.additionalParamsEnabled = false;
			this.form.rate = 0;
			this.form.sl_rate = '0';
			this.form.tp_rate = '0';
			this.form.ts_offset = '0';
		},
	},
};
</script>

<style scoped lang="scss">
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s ease-out;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.v-slider {
  font-size: 10px;
}
.lc-custom {
  letter-spacing: 0.0892857em;
}
.alf {
  position: relative;
	display: flex;
	flex-flow: column;
	flex-grow: 1;
	justify-content: space-between;

	&__volume {
    margin-top: 6px;
	}

	&__percents {
    display: grid;
    grid-gap: 2px;
    grid-template-columns: repeat(4, 1fr);
    margin-top: 6px;
    margin-bottom: 8px;
	}

	&__text-field-hint {
    line-height: 1;
    font-size: 0.75rem;
    padding: 0 12px;
    opacity: 0.6;
	}

  &__cond-params {
    margin-top: 4px;
    .alf__text-field-hint:not(:first-child) {
      margin-top: 2px;
    }
  }

	&__margin {
		padding: 0 4px;
	}

	&__footer {
    position: absolute;
    bottom: 0;
    width: 100%;
		&__available {
			font-size: 11px;
		}
		&__balance {
			cursor: pointer;
		}
	}
}
</style>
