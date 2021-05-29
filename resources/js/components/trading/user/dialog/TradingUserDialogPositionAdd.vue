<template>
	<v-form ref="form" v-model="valid">
		<v-dialog v-model="dialog" max-width="500px">
			<template #activator="{ on }">
				<v-list-item dense v-on="on">
					<v-list-item-title>{{ $t('trading.position.deposit_position') }}</v-list-item-title>
				</v-list-item>
			</template>

			<v-card>
				<v-card-title class="common-dialog__title">
					{{ $t('trading.position.deposit_position') }}
				</v-card-title>

				<v-card-text class="common-dialog__content">
					<CommonAvailable :available="availableBalance" :currency="side ? currency : market" @set="setAmount" />

					<v-text-field
						ref="amount"
						v-model="form.amount"
						class="pt-0 mt-0"
						:rules="[rules.required, rules.positive, localRules.lessAvailable, localRules.numberWithScalePrecision]"
						:placeholder="$t('common.amount')"
						:hint="$t('trading.position.deposit_amount')"
						:suffix="side ? currency : market"
						persistent-hint
						autofocus
						@keydown="validateNumber"
						@paste.prevent
					/>
				</v-card-text>

				<v-card-actions class="common-dialog__actions">
					<v-spacer />
					<v-btn small tile text plain @click="close">
						{{ $t('common.cancel') }}
					</v-btn>
					<v-spacer />
					<v-btn :loading="loading" :disabled="!valid" color="primary" small tile text plain @click="apply">
						{{ $t('common.apply') }}
					</v-btn>
					<v-spacer />
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-form>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import CommonAvailable from '../../../common/CommonAvailable';

import loadingMixin from '../../../../mixins/common/loadingMixin';
import dialogMethodsMixin from '../../../../mixins/common/dialogMethodsMixin';
import formValidationRules from '../../../../mixins/common/formValidationRules';
import validateInputMixin from '../../../../mixins/common/validateInputMixin';

export default {
	name: 'TradingUserDialogPositionAdd',

	components: { CommonAvailable },

	mixins: [loadingMixin, dialogMethodsMixin, formValidationRules, validateInputMixin],

	props: {
		id: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
		side: {
			type: Boolean,
			required: true,
		},
	},

	data() {
		return {
			valid: true,
			localRules: {
				numberWithScalePrecision: v =>
					!v || this.isCorrectPrecision(v) || this.$t('forms_validation.unsupported_precision'),
				lessAvailable: v =>
					!v || BigNumber(v).lte(BigNumber(this.availableBalance)) || this.$t('balance.more_available'),
			},

			form: {
				position: this.id,
				currency: this.currency,
				market: this.market,
				amount: '',
			},
		};
	},

	computed: {
		availableBalance() {
			const balance = this.side ? this.currencyBalance : this.marketBalance;
			return balance.toFixed(this.currencyScale);
		},

		currencyBalance() {
			if (this.isAuth) {
				const scale = 8;
				const amount = _.get(this.balances, this.currency, 0);
				if (amount.available !== undefined) {
					return BigNumber(amount.available)
						.dp(scale, 1)
						.toNumber();
				}
				return BigNumber(0)
					.dp(scale, 1)
					.toNumber();
			} else return BigNumber(0).toNumber();
		},
		marketBalance() {
			if (this.isAuth) {
				const scale = 8;
				const amount = _.get(this.balances, this.market, 0);
				if (amount.available !== undefined) {
					return BigNumber(amount.available)
						.dp(scale, 1)
						.toNumber();
				}
				return BigNumber(0)
					.dp(scale, 1)
					.toNumber();
			} else return BigNumber(0).toNumber();
		},

		isAuth() {
			return this.$store.getters['app/isLogged'];
		},
		balances() {
			return this.$store.state.user.balances;
		},
		currencyScale() {
			const defaultScale = 2;
			const currency = this.side ? this.currency : this.market;
			const isCurrency = currency in this.balances;

			if (isCurrency) return this.balances[currency].scale;
			else return defaultScale;
		},
	},

	watch: {
		'form.amount'(newAmount, oldAmount) {
			if (this.isNumeric(newAmount) || newAmount === '') {
				const leadZero = new RegExp('^0+(?=\\d)', 'i');
				if (leadZero.test(newAmount)) {
					this.form.amount = oldAmount;
					this.$refs.amount.lazyValue = oldAmount;
				} else {
					const isUnavailableScale = new RegExp('\\d+\\.\\d{' + (this.currencyScale + 1) + ',}', 'i');
					if (isUnavailableScale.test(newAmount)) {
						this.form.amount = oldAmount;
						this.$refs.amount.lazyValue = oldAmount;
					}
				}
			} else {
				this.form.amount = 0;
			}
		},
	},

	mounted() {
		this.clearData();
	},

	methods: {
		apply() {
			this.startLoading();
			axios
				.post('/trader/ext/position/deposit', this.form)
				.then(response => {
					if (response.data.success === true) {
						this.close();
					}
				})
				.finally(() => {
					this.stopLoading();
				});
		},
		setAmount() {
			this.form.amount = this.availableBalance;
		},

		isNumeric(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		isCorrectPrecision(v) {
			return !new RegExp('\\d+\\.\\d{' + (this.currencyScale + 1) + ',}', 'i').test(v);
		},
		clearData() {
			this.form.amount = '';
			this.$refs.form.resetValidation();
		},
	},
};
</script>
