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
					<label>{{ $t('trading.order.available') }}</label>
					<small v-if="side">
						<span class="available_balance" @click="setCurrencyAmount()">
							{{ this.currencyBalance.toString() }}
						</span>
						{{ currency.toUpperCase() }}
					</small>

					<small v-else>
						<span class="available_balance" @click="setMarketAmount()">
							{{ this.marketBalance.toString() }}
						</span>
						{{ market.toUpperCase() }}
					</small>

					<v-text-field
						v-model="form.amount"
						class="pt-0 mt-0"
						:rules="rules.numberRules"
						:placeholder="$t('common.amount')"
						:hint="$t('trading.position.deposit_amount')"
						:suffix="currency"
						persistent-hint
					/>
				</v-card-text>

				<v-card-actions class="common-dialog__actions">
					<v-spacer />
					<v-btn small tile text plain @click="close">
						{{ $t('common.cancel') }}
					</v-btn>
					<v-spacer />
					<v-btn :loading="loading" :disabled="loading" color="primary" small tile text plain @click="apply">
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

import loadingMixin from '../../../../mixins/common/loadingMixin';
import dialogMethodsMixin from '../../../../mixins/common/dialogMethodsMixin';

export default {
	name: 'TradingUserDialogPositionClose',

	mixins: [loadingMixin, dialogMethodsMixin],

	props: {
		id: {
			type: Number,
			required: true,
			default: 'mock',
		},
		currency: {
			type: String,
			required: true,
			default: 'mock c',
		},
		market: {
			type: String,
			required: true,
			default: 'mock m',
		},
		side: {
			type: Boolean,
			required: true,
			default: 'mock',
		},
	},

	data() {
		return {
			valid: true,
			rules: {
				required: v => !!v || 'The field is required',
				numberRules: [
					v => !!v || 'The field is required',
					v =>
						(v && /^-?\d+\.?\d{0,15}$/i.test(v)) || 'Unsupported characters. Must be decimal number with precision 15',
					v => (!!v && v > 0) || 'The field must be positive number',
				],
			},
			form: {
				position: this.id,
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
				amount: '',
			},
		};
	},

	computed: {
		isAuth() {
			return this.$store.getters['app/isLogged'];
		},
		balances() {
			return this.$store.state.user.balances;
		},
		currencyBalance() {
			if (this.isAuth) {
				let scale = 8;
				let amount = _.get(this.balances, this.currency.toUpperCase(), 0);
				if (amount.available !== undefined) {
					return BigNumber(amount.available).dp(scale, 1);
				}
				return BigNumber(0).dp(scale, 1);
			} else return BigNumber(0);
		},
		marketBalance() {
			if (this.isAuth) {
				let scale = 8;
				let amount = _.get(this.balances, this.market.toUpperCase(), 0);
				if (amount.available !== undefined) {
					return BigNumber(amount.available).dp(scale, 1);
				}
				return BigNumber(0).dp(scale, 1);
			} else return BigNumber(0);
		},
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

		setCurrencyAmount() {
			this.form.amount = this.currencyBalance.toString();
		},
		setMarketAmount() {
			this.form.amount = this.marketBalance.toString();
		},
		clearData() {
			this.$refs.form.reset();
		},
	},
};
</script>
