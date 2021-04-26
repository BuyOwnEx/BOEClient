<template>
	<v-form ref="form" v-model="valid">
		<v-dialog v-model="dialog" max-width="500px">
			<template v-slot:activator="{ on }">
				<v-list-item dense v-on="on">
					<v-list-item-title>{{ menuTitle }}</v-list-item-title>
				</v-list-item>
			</template>
			<v-card>
				<v-card-title class="common-dialog__title">
					<span class="headline">{{ formTitle }}</span>
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
						label="Amount"
						:rules="rules.numberRules"
						hint="Enter deposit amount"
						persistent-hint
					/>
				</v-card-text>

				<v-card-actions class="common-dialog__actions">
					<v-spacer />
					<v-btn color="blue darken-1" text @click="close">
						{{ cancelTitle }}
					</v-btn>
					<v-spacer />
					<v-btn :loading="loading" :disabled="loading" color="blue darken-1" text @click="apply">
						{{ actionTitle }}
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
			loading: false,
			formTitle: 'Deposit funds for position',
			menuTitle: this.$t('trading.deposit_margin'),
			actionTitle: 'Apply',
			cancelTitle: 'Close',
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
