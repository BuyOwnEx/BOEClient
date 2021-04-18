<template>
	<CommonDialog :confirm-color="getTypeColor" :header-color="getTypeColor" @confirm="confirm">
		<template #default>
			<slot></slot>
		</template>

		<template #title>
			{{ $t('trading.forms.dialog.title') }}
		</template>

		<template #content>
			<div>
				<div v-if="isBuy && isLimit" v-html="buyLimitText" />
				<div v-else-if="isBuy && isMarket" v-html="buyMarketText" />
				<div v-else-if="isBuy && isLimit && isAnyAdditionalParamExist" v-html="buyLimitParamsText" />
				<div v-else-if="isBuy && isLimit && isAnyAdditionalParamExist" v-html="buyMarketParamsText" />

				<div v-if="isSell && isLimit" v-html="sellLimitText" />
				<div v-else-if="isSell && isMarket" v-html="sellMarketText" />
				<div v-else-if="isSell && isLimit && isAnyAdditionalParamExist" v-html="sellLimitParamsText" />
				<div v-else-if="isSell && isMarket && isAnyAdditionalParamExist" v-html="sellMarketParamsText" />

				<ul v-if="isAnyAdditionalParamExist" class="trading-forms-confirm-dialog__add-params-list">
					<li v-if="isBuy && stopLoss" v-html="buyStopLossText" />
					<li v-if="isBuy && takeProfit" v-html="buyTakeProfitText" />
					<li v-if="isBuy && trailingStop" v-html="buyTrailingStopText" />

					<li v-if="isSell && stopLoss" v-html="sellStopLossText" />
					<li v-if="isSell && takeProfit" v-html="sellTakeProfitText" />
					<li v-if="isSell && trailingStop" v-html="sellTrailingStopText" />
				</ul>

				<small v-if="isMultiplyAdditionalParams" class="text--secondary pt-1">
					* {{ $t('trading.order.only_one_conditional_orders_trigger') }}
				</small>
			</div>
		</template>
	</CommonDialog>
</template>

<script>
import CommonDialog from '../../../common/CommonDialog';

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
			required: false,
		},
		takeProfit: {
			type: [Number, String],
			required: false,
		},
		trailingStop: {
			type: [Number, String],
			required: false,
		},
	},

	computed: {
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
		isAnyAdditionalParamExist() {
			return this.stopLoss || this.takeProfit || this.trailingStop;
		},
		isMultiplyAdditionalParams() {
			const isFirstAndSecond = this.stopLoss && this.takeProfit;
			const isFirstAndThird = this.stopLoss && this.trailingStop;
			const isSecondAndThird = this.takeProfit && this.trailingStop;
			const isAll = this.stopLoss && this.takeProfit && this.trailingStop;

			return isFirstAndSecond || isFirstAndThird || isSecondAndThird || isAll;
		},

		getTypeColor() {
			if (this.isBuy) return 'success';
			else return 'error';
		},

		buyLimitText() {
			return this.$t('trading.order.buy_limit_order', {
				amount: this.amount,
				price: this.price,
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
			});
		},
		buyMarketText() {
			return this.$t('trading.order.buy_market_order', {
				amount: this.amount,
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
			});
		},
		buyLimitParamsText() {
			return this.$t('trading.order.buy_limit_order_with_params', {
				amount: this.amount,
				price: this.price,
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
			});
		},
		buyMarketParamsText() {
			return this.$t('trading.order.buy_market_order_with_params', {
				amount: this.amount,
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
			});
		},

		buyStopLossText() {
			return this.$t('trading.order.buy_stop_loss_text', {
				stopLoss: this.stopLoss,
				market: this.market.toUpperCase(),
			});
		},
		buyTakeProfitText() {
			return this.$t('trading.order.buy_take_profit_text', {
				takeProfit: this.takeProfit,
				market: this.market.toUpperCase(),
			});
		},
		buyTrailingStopText() {
			return this.$t('trading.order.buy_trailing_stop_text', {
				trailingStop: this.trailingStop,
				market: this.market.toUpperCase(),
			});
		},

		sellLimitText() {
			return this.$t('trading.order.sell_limit_order', {
				amount: this.amount,
				price: this.price,
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
			});
		},
		sellMarketText() {
			return this.$t('trading.order.sell_market_order', {
				amount: this.amount,
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
			});
		},
		sellLimitParamsText() {
			return this.$t('trading.order.sell_limit_order_with_params', {
				amount: this.amount,
				price: this.price,
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
			});
		},
		sellMarketParamsText() {
			return this.$t('trading.order.sell_market_order_with_params', {
				amount: this.amount,
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
			});
		},

		sellStopLossText() {
			return this.$t('trading.order.sell_stop_loss_text', {
				stopLoss: this.stopLoss,
				market: this.market.toUpperCase(),
			});
		},
		sellTakeProfitText() {
			return this.$t('trading.order.sell_take_profit_text', {
				takeProfit: this.takeProfit,
				market: this.market.toUpperCase(),
			});
		},
		sellTrailingStopText() {
			return this.$t('trading.order.sell_trailing_stop_text', {
				trailingStop: this.trailingStop,
				market: this.market.toUpperCase(),
			});
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
	&__important
		font-weight: 800
		font-size: 14px
</style>
