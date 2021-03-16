<template>
	<v-dialog v-model="dialog" content-class="confirm-dialog">
		<template v-slot:activator="{ on, attrs }">
			<div v-bind="attrs" v-on="on">
				<slot></slot>
			</div>
		</template>

		<v-card>
			<v-card-title
				class="trading-forms-confirm-dialog__header"
				:class="{
					'trading-forms-confirm-dialog__header--buy': isBuy,
					'trading-forms-confirm-dialog__header--sell': isSell,
				}"
			>
				<slot name="header">Подтверждение сделки</slot>
			</v-card-title>

			<v-card-text class="trading-forms-confirm-dialog__content">
				<slot name="text">
					<span>Вы собираетесь</span>

					<span v-if="isBuy">купить</span>
					<span v-else-if="isSell">продать</span>

					<span class="trading-forms-confirm-dialog__important">
						{{ amount }} {{ currency.toUpperCase() }}
					</span>

					<span v-if="isLimit">по цене</span>
					<span v-else-if="isMarket">по рыночной цене</span>

					<span v-if="isAdditionalParams && isAnyAdditionalParamExist">
						со следующими параметрами дальнейшей продажи:
					</span>
					<div v-if="isAdditionalParams && isAnyAdditionalParamExist">
						<ul class="trading-forms-confirm-dialog__add-params-list">
							<li v-if="stopLoss">
								<span v-if="isBuy">Купить</span>
								<span v-else-if="isSell">Продать</span>

								<span v-if="isMarket">по рыночной цене</span>
								в случае, если

								<span v-if="isBuy">Best Bid</span>
								<span v-else-if="isSell">Best Ask</span>

								достигнет значения
								<span class="trading-forms-confirm-dialog__important">
									{{ stopLoss }}
								</span>
							</li>

							<li v-if="takeProfit">
								<span v-if="isBuy">Купить</span>
								<span v-else-if="isSell">Продать</span>

								<span v-if="isMarket">по рыночной цене</span>
								в случае, если

								<span v-if="isBuy">Best Ask</span>
								<span v-else-if="isSell">Best Bid</span>

								достигнет значения
								<span class="trading-forms-confirm-dialog__important">
									{{ takeProfit }}
								</span>
							</li>

							<li v-if="trailingStop">
								<span v-if="isBuy">Купить</span>
								<span v-else-if="isSell">Продать</span>

								<span v-if="isMarket">по рыночной цене</span>
								в случае, если цена актива

								<span v-if="isBuy">поднимается</span>
								<span v-else-if="isSell">упадет</span>

								одномоментно на
								<span class="trading-forms-confirm-dialog__important">
									{{ trailingStop }}
								</span>
								пунктов
							</li>
						</ul>

						<div
							v-if="isMultiplyAdditionalParams"
							class="trading-forms-confirm-dialog__small-text text-right"
						>
							* Сработает только один из условных ордеров
						</div>
					</div>

					<span
						v-else-if="!isAdditionalParams && isLimit"
						class="trading-forms-confirm-dialog__important"
					>
						{{ price }} {{ market.toUpperCase() }}
					</span>
				</slot>
			</v-card-text>

			<v-card-actions>
				<slot name="actions">
					<v-spacer />
					<v-btn
						class="text-uppercase"
						style="letter-spacing: 1px"
						color="grey"
						text
						tile
						plain
						@click="closeDialog"
					>
						Отмена
					</v-btn>
					<v-spacer />
					<v-btn
						class="text-uppercase"
						style="letter-spacing: 1px"
						color="success"
						text
						tile
						plain
						@click="confirm"
					>
						Подтвердить
					</v-btn>
					<v-spacer />
				</slot>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import confirmDialog from '../../../../mixins/trading/confirmDialog';

export default {
	name: 'TradingFormsConfirmDialog',

	mixins: [confirmDialog],

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
	},
};
</script>

<style scoped lang="sass">
.trading-forms-confirm-dialog
	&__header
		font-weight: 600 !important
		padding: 8px 24px 8px !important
		&--buy
			background: var(--v-success-base)
		&--sell
			background: var(--v-error-base)
	&__content
		padding-top: 8px !important

	&__add-params-list
		padding-top: 8px
		padding-left: 16px !important
	&__small-text
		font-size: 11px
		opacity: 0.7

	&__important
		font-weight: 600
.theme--dark
	.trading-forms-confirm-dialog
		&__header
			&--buy
				background: var(--v-success-darken1)
			&--sell
				background: var(--v-error-darken1)
</style>
