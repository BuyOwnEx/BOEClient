<template>
	<CommonDialog :confirm-color="getTypeColor" :header-color="getTypeColor" @confirm="confirm" :disabled="!isLogged || (isLogged && (!verifyStatus && !isNonKYCTradingAvailable))">
		<template #default>
			<slot></slot>
		</template>

		<template #title>
			{{ $t('trading.forms.dialog.title') }}
		</template>

		<template #content>
      <div v-if="!isLogged" class="mt-2 mb-2">
        <span class="red--text"><b>{{ $t('trading.forms.must_login') }}</b></span>
      </div>
      <div v-else-if="isLogged && (!verifyStatus && !isNonKYCTradingAvailable)" class="mt-2 mb-2">
        <span class="red--text"><b>{{ $t('trading.forms.must_kyc') }}</b></span>
      </div>
			<div v-else>
				<div v-if="!isLeverage">
          <div v-if="isBuy && isLimit && !isAnyAdditionalParamExist">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.buy') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_limit_price') }} <b>{{ price }} {{ market }}</b>
          </div>
          <div v-else-if="isBuy && isMarket && !isAnyAdditionalParamExist">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.buy') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_market_price') }}
          </div>
          <div v-else-if="isBuy && isLimit && isAnyAdditionalParamExist">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.buy') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_limit_price') }} <b>{{ price }} {{ market }}</b> {{ $t('trading.forms.dialog.with_cond_orders') }}
          </div>
          <div v-else-if="isBuy && isMarket && isAnyAdditionalParamExist">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.buy') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_market_price') }} {{ $t('trading.forms.dialog.with_cond_orders') }}
          </div>

          <div v-if="isSell && isLimit && !isAnyAdditionalParamExist">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.sell') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_limit_price') }} <b>{{ price }} {{ market }}</b>
          </div>
          <div v-else-if="isSell && isMarket && !isAnyAdditionalParamExist">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.sell') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_market_price') }}
          </div>
          <div v-else-if="isSell && isLimit && isAnyAdditionalParamExist">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.sell') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_limit_price') }} <b>{{ price }} {{ market }}</b> {{ $t('trading.forms.dialog.with_cond_orders') }}
          </div>
          <div v-else-if="isSell && isMarket && isAnyAdditionalParamExist">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.sell') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_market_price') }} {{ $t('trading.forms.dialog.with_cond_orders') }}
          </div>
				</div>

				<div v-else-if="isLeverage">
          <div v-if="isBuy && isLimit">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.buy') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_limit_price') }} <b>{{ price }} {{ market }}</b>, {{ $t('trading.forms.dialog.use_leverage') }} <b>{{ leverageLevel }}x</b>. {{ $t('trading.forms.dialog.daily_fee') }} <b>{{ offerPercent }}%</b>. {{ $t('trading.forms.dialog.expiration_text') }} <b>{{ offerDays }}</b> {{ $t('trading.forms.dialog.days') }}
          </div>
          <div v-if="isBuy && isMarket">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.buy') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_market_price') }}, {{ $t('trading.forms.dialog.use_leverage') }} <b>{{ leverageLevel }}x</b>. {{ $t('trading.forms.dialog.daily_fee') }} <b>{{ offerPercent }}%</b>. {{ $t('trading.forms.dialog.expiration_text') }} <b>{{ offerDays }}</b> {{ $t('trading.forms.dialog.days') }}
          </div>

          <div v-if="isSell && isLimit">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.sell') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_limit_price') }} <b>{{ price }} {{ market }}</b>, {{ $t('trading.forms.dialog.use_leverage') }} <b>{{ leverageLevel }}x</b>. {{ $t('trading.forms.dialog.daily_fee') }} <b>{{ offerPercent }}%</b>. {{ $t('trading.forms.dialog.expiration_text') }} <b>{{ offerDays }}</b> {{ $t('trading.forms.dialog.days') }}
          </div>
          <div v-if="isSell && isMarket">
            {{ $t('trading.forms.dialog.going_to') }} <b>{{ $t('trading.forms.dialog.sell') }} {{ amount }} {{ currency }}</b> {{ $t('trading.forms.dialog.at_market_price') }}, {{ $t('trading.forms.dialog.use_leverage') }} <b>{{ leverageLevel }}x</b>. {{ $t('trading.forms.dialog.daily_fee') }} <b>{{ offerPercent }}%</b>. {{ $t('trading.forms.dialog.expiration_text') }} <b>{{ offerDays }}</b> {{ $t('trading.forms.dialog.days') }}
          </div>
				</div>

				<ul v-if="isAnyAdditionalParamExist" class="trading-forms-confirm-dialog__add-params-list">
          <li v-if="isBuy && isSetSL">{{ $t('trading.forms.dialog.buy_cond_text') }} <b>{{ stopLoss }} {{ market }}</b> {{ $t('trading.forms.dialog.sl_order') }}</li>
          <li v-if="isBuy && isSetTP">{{ $t('trading.forms.dialog.buy_cond_text') }} <b>{{ takeProfit }} {{ market }}</b> {{ $t('trading.forms.dialog.tp_order') }}</li>
          <li v-if="isBuy && isSetTS">{{ $t('trading.forms.dialog.buy_cond_ts_text') }} <b>{{ trailingStop }}</b> {{ $t('trading.forms.dialog.points') }} {{ $t('trading.forms.dialog.ts_order') }}</li>

          <li v-if="isSell && isSetSL">{{ $t('trading.forms.dialog.sell_cond_text') }} <b>{{ stopLoss }} {{ market }}</b> {{ $t('trading.forms.dialog.sl_order') }}</li>
          <li v-if="isSell && isSetTP">{{ $t('trading.forms.dialog.sell_cond_text') }} <b>{{ takeProfit }} {{ market }}</b> {{ $t('trading.forms.dialog.tp_order') }}</li>
          <li v-if="isSell && isSetTS">{{ $t('trading.forms.dialog.sell_cond_ts_text') }} <b>{{ trailingStop }}</b> {{ $t('trading.forms.dialog.points') }} {{ $t('trading.forms.dialog.ts_order') }}</li>
				</ul>
        <br v-if="isMultiplyAdditionalParams && isAdditionalParams">
				<small v-if="isMultiplyAdditionalParams && isAdditionalParams" class="text--secondary">
					* {{ $t('trading.forms.dialog.only_one_conditional_orders_trigger') }}
				</small>
			</div>
		</template>
	</CommonDialog>
</template>

<script>
import CommonDialog from '@/components/common/CommonDialog.vue';
import { mapGetters, mapState } from 'vuex';

export default {
	name: 'TradingFormsConfirmDialog',
	components: { CommonDialog },
	props: {
		orderType: {
			type: String,
			validator(value) {
				return ['limit', 'market'].indexOf(value) !== -1;
			},
		},
		actionType: {
			type: String,
			validator(value) {
				return ['buy', 'sell'].indexOf(value) !== -1;
			},
		},
		amount: {
			type: [Number, String],
			required: true,
		},
		price: {
			type: [Number, String],
			required: false,
			default: 0,
		},
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
		isAdditionalParams: {
			type: Boolean,
			default: false,
		},
		stopLoss: {
			type: [Number, String],
			default: null,
		},
		takeProfit: {
			type: [Number, String],
			default: null,
		},
		trailingStop: {
			type: [Number, String],
			default: null,
		},
		isLeverage: {
			type: Boolean,
			required: false,
			default: false,
		},
		leverageOffer: {
			type: Object,
			required: false,
			default: null,
		},
		leverageLevel: {
			type: Number,
			default: null,
		},
	},
	computed: {
    ...mapGetters({
      isLogged: 'app/isLogged',
    }),
    ...mapState('user', ['verifyStatus']),
    isNonKYCTradingAvailable() {
      return import.meta.env.VITE_TRADING_WITHOUT_KYC === 'true';
    },
    offerPercent() {
      return this.leverageOffer?.percent || 0;
    },
    offerDays() {
      return this.leverageOffer?.days || 0;
    },
		isLimit() {
			return this.orderType === 'limit';
		},
		isMarket() {
			return this.orderType === 'market';
		},
		isBuy() {
			return this.actionType === 'buy';
		},
		isSell() {
			return this.actionType === 'sell';
		},
    isSetSL() {
      return this.stopLoss !== null && this.stopLoss !== '' && this.stopLoss !== '0'
    },
    isSetTP() {
      return this.takeProfit !== null && this.takeProfit !== '' && this.takeProfit !== '0'
    },
    isSetTS() {
      return this.trailingStop !== null && this.trailingStop !== '' && this.trailingStop !== '0'
    },
		isAnyAdditionalParamExist() {
      const anyParamExist = this.isSetSL || this.isSetTP || this.isSetTS;
			return anyParamExist && this.isAdditionalParams;
		},
		isMultiplyAdditionalParams() {
			const isFirstAndSecond = this.isSetSL && this.isSetTP;
			const isFirstAndThird = this.isSetSL && this.isSetTS;
			const isSecondAndThird = this.isSetTP && this.isSetTS;
			const isAll = this.isSetSL && this.isSetTP && this.isSetTS;
			return isFirstAndSecond || isFirstAndThird || isSecondAndThird || isAll;
		},
		getTypeColor() {
			if (this.isBuy) return 'success';
			else return 'error';
		},
	},
	methods: {
		confirm() {
			this.$emit('confirm');
		},
	},
};
</script>

<style scoped lang="sass">
.trading-forms-confirm-dialog
	&__add-params-list
		padding-top: 8px
		padding-left: 16px !important
</style>