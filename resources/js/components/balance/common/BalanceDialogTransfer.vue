<template>
	<v-dialog v-model="dialog" width="500">
		<template #activator="{ on }">
			<v-list-item dense v-on="on">
				<v-list-item-title>
					{{ menuTitle }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card class="balance-dialog-transfer">
			<v-card-title class="common-dialog__title">
				{{ dialogTitle }}
			</v-card-title>

			<v-card-text class="common-dialog__content">
				<CommonAvailable :available="availableBalance" :currency="currencyObj.currency" @set="setAmount" />

				<v-form v-model="valid">
					<v-text-field
						v-model="form.amount"
						class="pt-0 mt-0"
						:placeholder="$t('balance.amount')"
						:rules="[localRules.numberWithScalePrecision, localRules.lessAvailable, rules.positive]"
						:hint="$t('balance.dialog.hint')"
						:suffix="currencyObj.currency"
						persistent-hint
						autofocus
						@keydown="validateNumber"
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
					:disabled="!valid || !form.amount"
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
import { mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import CommonAvailable from '../../common/CommonAvailable';

import loadingMixin from '../../../mixins/common/loadingMixin';
import formValidationRules from '../../../mixins/common/formValidationRules';
import showNotificationMixin from '../../../mixins/common/showNotificationMixin';
import validateInputMixin from '../../../mixins/common/validateInputMixin';
import dialogMethodsMixin from '../../../mixins/common/dialogMethodsMixin';

export default {
	name: 'BalanceDialogTransfer',

	components: { CommonAvailable },

	mixins: [loadingMixin, formValidationRules, showNotificationMixin, validateInputMixin, dialogMethodsMixin],

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
		wallet: {
			type: String,
			required: true,
			validator(val) {
				return ['crypto', 'fiat'].indexOf(val) !== -1;
			},
		},
	},

	data() {
		return {
			valid: false,

			localRules: {
				numberWithScalePrecision: v =>
					!v || this.isCorrectPrecision(v) || this.$t('forms_validation.unsupported_precision'),
				lessAvailable: v => !v || BigNumber(v).lte(this.availableBalance) || this.$t('balance.more_available'),
			},

			form: {
				currency: this.currencyObj.currency.toUpperCase(),
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

		availableBalance() {
			if (!this.isAuth) return 0;

			const scale = this.currencyObj.scale;

			const isCrypto = this.wallet === 'crypto';
			const safeAvailable = isCrypto
				? BigNumber(this.currencyObj.available).dp(scale, 1)
				: BigNumber(this.currencyObj.available);
			const tradeAvailable = isCrypto
				? BigNumber(this.currencyObj.safe).dp(scale, 1)
				: BigNumber(this.currencyObj.safe);

			if (this.type === 'safe') return safeAvailable.toString();
			else if (this.type === 'trade') return tradeAvailable.toString();
			else return 0;
		},

		menuTitle() {
			const path = `balance.dialog.${this.type}.menu_title`;
			return this.$t(path);
		},
		dialogTitle() {
			const path = `balance.dialog.${this.type}.title`;
			const currency = this.currencyObj.currency;

			return this.$t(path, { currency });
		},
	},

	methods: {
		...mapActions({
			getBalancesFromServerStore: 'user/getBalancesFromServer',
		}),

		async apply() {
			try {
				this.startLoading();

				await axios.post(`/trader/ext/transfer/${this.type}`, this.form);

				this.close();
				this.getBalancesFromServerStore();
			} finally {
				this.stopLoading();
			}
		},

		isCorrectPrecision(v) {
			return !new RegExp('\\d+\\.\\d{' + (this.currencyObj.scale + 1) + ',}', 'i').test(v);
		},
		setAmount() {
			this.form.amount = this.availableBalance;
		},
		clearData() {
			this.amount = '';
		},
	},
};
</script>

<style lang="sass" scoped>
.balance-dialog-transfer
	.v-text-field input
		padding-top: 0
</style>
