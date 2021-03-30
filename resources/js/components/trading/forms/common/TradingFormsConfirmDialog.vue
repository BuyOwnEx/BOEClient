<template>
	<CommonDialog
		:confirm-color="getTypeColor"
		:header-color="getTypeColor"
		@confirm="confirm"
	>
		<template #default>
			<slot></slot>
		</template>

		<template #title>
			{{ $t('trading.forms.dialog.title') }}
		</template>

		<template #content>
			<div>
				<span>Вы собираетесь</span>

				<span class="trading-forms-confirm-dialog__important">
					<span v-if="isBuy">купить</span>
					<span v-else-if="isSell">продать</span>
					<span>{{ amount }} {{ currency.toUpperCase() }}</span>
				</span>

				<span v-if="isLimit">
					<span>по цене</span>
					<span class="trading-forms-confirm-dialog__important">
						{{ price }} {{ market.toUpperCase() }}
					</span>
				</span>
				<span v-else-if="isMarket">по рыночной цене</span>

				<span v-if="isAdditionalParams && isAnyAdditionalParamExist">
					со следующими связанными условными ордерами:
				</span>
				<div v-if="isAdditionalParams && isAnyAdditionalParamExist">
					<ul class="trading-forms-confirm-dialog__add-params-list">
						<li v-if="stopLoss">
							<span v-if="isBuy">Продажа</span>
							<span v-else-if="isSell">Покупка</span>
							<span>по рынку в случае, если</span>

							<span
								v-if="isBuy"
								class="trading-forms-confirm-dialog__important"
							>
								Best Bid
							</span>
							<span
								v-else-if="isSell"
								class="trading-forms-confirm-dialog__important"
							>
								Best Ask
							</span>

							достигнет значения
							<span>
								<span class="trading-forms-confirm-dialog__important">
									{{ stopLoss }} {{ market.toUpperCase() }}
								</span>
								<span>
									(
									<span class="trading-forms-confirm-dialog__important">
										SL
									</span>
									<span>{{ $t('trading.forms.dialog.order') }}</span>
									)
								</span>
							</span>
						</li>

						<li v-if="takeProfit">
							<span v-if="isBuy">Продажа</span>
							<span v-else-if="isSell">Покупка</span>
							<span>по рынку в случае, если</span>

							<span
								v-if="isBuy"
								class="trading-forms-confirm-dialog__important"
							>
								Best Bid
							</span>
							<span
								v-else-if="isSell"
								class="trading-forms-confirm-dialog__important"
							>
								Best Ask
							</span>

							достигнет значения
							<span>
								<span class="trading-forms-confirm-dialog__important">
									{{ takeProfit }} {{ market.toUpperCase() }}
								</span>
								<span>
									(
									<span class="trading-forms-confirm-dialog__important">
										TP
									</span>
									<span>{{ $t('trading.forms.dialog.order') }}</span>
									)
								</span>
							</span>
						</li>

						<li v-if="trailingStop">
							<span v-if="isBuy">Продажа</span>
							<span v-else-if="isSell">Покупка</span>
							<span>по рынку в случае, если</span>
							<span>цена актива</span>

							<span v-if="isBuy">упадет</span>
							<span v-else-if="isSell">поднимается</span>

							<span>одномоментно на</span>
							<span class="trading-forms-confirm-dialog__important">
								{{ trailingStop }}
							</span>
							<span>пунктов</span>

							<span>
								(
								<span class="trading-forms-confirm-dialog__important">
									TS
								</span>
								<span>{{ $t('trading.forms.dialog.order') }}</span>
								)
							</span>
						</li>
					</ul>

					<div
						v-if="isMultiplyAdditionalParams"
						class="trading-forms-confirm-dialog__small-text pt-1"
					>
						* Сработает только один из условных ордеров
					</div>
				</div>
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
	},

	methods: {
		confirm() {
			this.$emit('confirm');
		},
	},
};
</script>

<style scoped lang="sass">
//.trading-forms-confirm-dialog
//	&__header
//		font-weight: 600 !important
//		padding: 8px 24px 8px !important
//		&--buy
//			background: var(--v-success-base)
//		&--sell
//			background: var(--v-error-base)
//	&__content
//		padding-top: 8px !important
//
//	&__add-params-list
//		padding-top: 8px
//		padding-left: 16px !important
//	&__small-text
//		font-size: 11px
//		opacity: 0.7
//
//	&__important
//		font-weight: 800
//		font-size: 14px
//.theme--dark
//	.trading-forms-confirm-dialog
//		&__header
//			&--buy
//				background: var(--v-success-darken1)
//			&--sell
//				background: var(--v-error-darken1)
</style>