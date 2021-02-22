<template>
	<v-form ref='form' v-model='valid'>
		<v-dialog v-model='dialog' max-width='500px'>
			<template v-slot:activator='{ on }'>
				<v-list-item dense v-on='on'>
					<v-list-item-title>{{ menuTitle }}</v-list-item-title>
				</v-list-item>
			</template>
			<v-card>
				<v-card-title>
					<span class='headline'>{{ formTitle }}</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols='12' md='12'>
								<label>{{ $vuetify.lang.translator('trading.order.available') }}</label>
								<small v-if='side'>
									<span class='available_balance' @click='setCurrencyAmount()'>{{ this.currency_balance.toString() }}</span>
									{{ currency.toUpperCase() }}
								</small>
								<small v-else>
									<span class='available_balance' @click='setMarketAmount()'>{{ this.market_balance.toString() }}</span>
									{{ market.toUpperCase() }}
								</small>
								<v-text-field
									v-model='form.amount'
									label='Amount*'
									:rules='rules.numberRules'
									hint='Enter deposit amount'
									:error-messages='errors.amount'
									@input='errors.amount = []'
									persistent-hint
									clearable
									required
								>
								</v-text-field>
							</v-col>
						</v-row>
					</v-container>
					<small>* indicates required field</small>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color='blue darken-1' text @click='close'>{{ cancelTitle }}</v-btn>
					<v-btn color='blue darken-1' text @click='apply' :loading='loading' :disabled='loading'>{{ actionTitle }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-form>
</template>

<script>
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
export default {
	name: 'PositionAddFunds',
	props: ['id', 'currency', 'market', 'side'],
	data() {
		return {
			dialog: false,
			valid: true,
			loading: false,
			formTitle: 'Deposit funds for position',
			menuTitle: this.$vuetify.lang.translator('trading.deposit_margin'),
			actionTitle: 'Apply',
			cancelTitle: 'Close',
			rules: {
				required: v => !!v || 'The field is required',
				numberRules: [
					v => !!v || 'The field is required',
					v => (v && /^-?\d+\.?\d{0,15}$/i.test(v)) || 'Unsupported characters. Must be decimal number with precision 15',
					v => !!v && v > 0 || 'The field must be positive number',
				],
			},
			errors: {
				amount: [],
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
			return this.$store.getters.isLogged;
		},
		balances() {
			return this.$store.state.user.balances;
		},
		currency_balance() {
			if (this.isAuth) {
				let scale = 8;
				let amount = _.get(this.balances, this.currency.toUpperCase(), 0);
				if (amount.available !== undefined) {
					return BigNumber(amount.available).dp(scale, 1);
				}
				return BigNumber(0).dp(scale, 1);
			} else return BigNumber(0);
		},
		market_balance() {
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
	watch: {
		dialog(val) {
			if (val) this.$emit('closeMenu');
			else this.close();
		},
	},
	methods: {
		setCurrencyAmount() {
			this.form.amount = this.currency_balance.toString();
		},
		setMarketAmount() {
			this.form.amount = this.market_balance.toString();
		},
		reset() {
			this.$refs.form.reset();
		},
		close() {
			this.dialog = false;
			this.reset();
		},
		apply() {
			let self = this;
			this.loading = true;
			axios.post('/trader/ext/position/deposit', this.form)
				.then((response) => {
					if (response.data.success === true) {
						self.close();
					}
				}).finally(function() {
				self.loading = false;
			});
		},
	},
};
</script>

<style scoped>

</style>