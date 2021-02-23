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
								<label>{{ $t('trading.order.available') }}</label>
								<span class='available_balance' @click='setAmount()'>{{ this.safe_balance.toString() }}</span>
								{{ cryptoObj.currency.toUpperCase() }}
								<v-text-field
									v-model='form.amount'
									label='Amount*'
									:rules='rules.numberRules'
									hint='Enter amount to transfer'
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
	name: 'CryptoTransferTrade',
	props: ['cryptoObj'],
	data() {
		return {
			dialog: false,
			valid: true,
			loading: false,
			formTitle: 'Transfer funds to trade wallet',
			menuTitle: this.$t('balance.transfer_to_trade'),
			actionTitle: 'Transfer',
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
				currency: this.cryptoObj.currency.toUpperCase(),
				amount: '',
			},
		};
	},
	computed: {
		isAuth() {
			return this.$store.getters["app/isLogged"];
		},
		balances() {
			return this.$store.state.user.balances;
		},
		safe_balance() {
			if (this.isAuth) {
				let scale = 8;
				let amount = _.get(this.balances, this.cryptoObj.currency.toUpperCase(), 0);
				if (amount.safe !== undefined) {
					return BigNumber(amount.safe).dp(scale, 1);
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
		setAmount() {
			this.form.amount = this.safe_balance.toString();
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
			axios.post('/trader/ext/transfer/trade', this.form)
				.then((response) => {
					if (response.data.success === true) {
						self.close();
						this.$store.dispatch('user/getBalancesFromServer');
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