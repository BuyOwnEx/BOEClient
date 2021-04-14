<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on }">
			<v-list-item dense v-on="on">
				<v-list-item-title>
					{{ menuTitle }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card class="balance-crypto-dialog-transfer">
			<v-card-title class="common-dialog__title">
				{{ dialogTitle }}
			</v-card-title>

			<v-card-text class="common-dialog__content">
				<div class="clickable non-selectable" @click="setAmount">
					<span>{{ $t('trading.order.available') }}</span>

					<b class="available_balance">
						{{ this.availableBalance.toString() }}
						{{ currencyObj.currency.toUpperCase() }}
					</b>
				</div>

				<v-form v-model="valid">
					<v-text-field
						v-model="form.amount"
						type="number"
						class="pt-0 mt-0"
						:placeholder="$t('common.amount')"
						:rules="[localRules.numberWithPrecision15, rules.positive]"
						:hint="$t('balance.dialog.hint')"
						:suffix="currencyObj.currency"
						persistent-hint
						@keydown="passNumbers"
						@paste.prevent
					/>
				</v-form>
			</v-card-text>

			<v-divider />

			<v-card-actions class="common-dialog__actions">
				<v-spacer />
				<v-btn plain tile text small @click="close">
					{{ $t('common.cancel') }}
				</v-btn>
				<v-spacer />
				<v-btn
					:loading="loading"
					:disabled="!valid"
					color="primary"
					tile
					text
					plain
					small
					@click="apply"
				>
					{{ $t('common.transfer') }}
				</v-btn>
				<v-spacer />
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import loadingMixin from '../../../../mixins/common/loadingMixin';
import formValidationRules from '../../../../mixins/common/formValidationRules';
import showNotificationMixin from '../../../../mixins/common/showNotificationMixin';
import passNumberMixin from '../../../../mixins/common/passNumberMixin';

export default {
	name: 'BalanceCryptoDialogTransfer',

	mixins: [
		loadingMixin,
		formValidationRules,
		showNotificationMixin,
		passNumberMixin,
	],

	props: {
		currencyObj: {
			type: Object,
			required: true,
		},
		type: {
			type: String,
			required: true,
			validator(val) {
				return ['trade', 'safe'].indexOf(val) !== -1;
			},
		},
	},

	data() {
		return {
			dialog: false,
			valid: false,

			localRules: {
				numberWithPrecision15: v =>
					!v ||
					/^-?\d+\.?\d{0,15}$/i.test(v) ||
					this.$t('forms_validation.unsupported_char_numbers_precision_15'),
			},

			form: {
				currency: this.currencyObj.currency.toUpperCase(),
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

		availableBalance() {
			if (!this.isAuth) return BigNumber(0);

			const scale = 8;
			const amount = _.get(
				this.balances,
				this.currencyObj.currency.toUpperCase(),
				0
			);

			if (amount.available && this.type === 'safe') {
				return BigNumber(amount.available).dp(scale, 1);
			} else if (amount.safe && this.type === 'trade') {
				return BigNumber(amount.safe).dp(scale, 1);
			} else {
				return BigNumber(0).dp(scale, 1);
			}
		},

		menuTitle() {
			const path = `balance.dialog.${this.type}.menu_title`;
			return this.$t(path);
		},
		dialogTitle() {
			const path = `balance.dialog.${this.type}.title`;
			return this.$t(path);
		},
	},

	watch: {
		dialog(val) {
			if (val) {
				this.$emit('close-menu');
				this.amount = '';
			}
		},
	},

	methods: {
		async apply() {
			if (this.availableBalance < this.form.amount) {
				this.pushErrorNotification(
					this.$t('balance.dialog.more_available_balance')
				);
				return;
			}

			try {
				this.startLoading();
				await axios.post(`/trader/ext/transfer/${this.type}`, this.form);
				this.close();
				this.$store.dispatch('user/getBalancesFromServer');
			} finally {
				this.stopLoading();
			}
		},

		setAmount() {
			this.form.amount = this.availableBalance.toString();
		},
		close() {
			this.dialog = false;
		},
	},
};
</script>

<style lang="sass" scoped>
.balance-crypto-dialog-transfer
	.v-text-field input
		padding-top: 0
</style>
