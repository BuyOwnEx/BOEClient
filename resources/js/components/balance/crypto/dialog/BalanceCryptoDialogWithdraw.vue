<template>
	<v-dialog v-model="dialog" width="1200" :persistent="step === 3">
		<template v-slot:activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.withdraw') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card class="balance-crypto-dialog-withdraw">
			<v-card-title class="common-dialog__title pb-0">
				<span>
					{{ $t('common.withdrawal_funds') }}
					{{ currency }}
				</span>

				<v-spacer />

				<v-btn icon @click="close">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>

			<v-card-text class="common-dialog__content pb-1 pt-0">
				<v-stepper v-model="step">
					<v-stepper-header>
						<v-stepper-step :complete="step > 1" step="1">
							{{ $t('balance.stepper.address_validation.title') }}
						</v-stepper-step>

						<v-divider />

						<v-stepper-step :complete="step > 2" step="2">
							{{ $t('balance.stepper.withdrawal_params.title') }}
						</v-stepper-step>

						<v-divider />

						<v-stepper-step step="3">
							{{ $t('balance.stepper.confirmation.title') }}
						</v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1">
							<div class="mb-6">
								<div>
									{{
										$t('balance.stepper.address_validation.description', {
											platform: this.currencyObj.platform,
										})
									}}
								</div>

								<v-text-field
									v-model="address"
									:hint="$t('balance.stepper.address_validation.address_hint')"
									:placeholder="$t('balance.stepper.address')"
									persistent-hint
									autofocus
								/>
							</div>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn plain tile text small @click="close">
									{{ $t('common.cancel') }}
								</v-btn>
								<v-spacer />
								<v-btn
									:loading="loading"
									:disabled="!address.trim()"
									color="primary"
									tile
									text
									plain
									small
									@click="validateAddress"
								>
									{{ $t('common.continue') }}
								</v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>

						<v-stepper-content step="2">
							<div class="mb-6">
								<div>
									{{ $t('balance.stepper.withdrawal_params.description') }}
								</div>

								<div class="balance-crypto-dialog-withdraw__address-wrapper subtitle-1 py-1 d-flex align-center">
									<CommonTooltip>
										<v-icon class="d-flex align-center">
											mdi-qrcode
										</v-icon>

										<template #text>
											{{ $t('balance.stepper.address') }}
										</template>
									</CommonTooltip>

									{{ address }}
								</div>

								<div>
									{{ $t('balance.stepper.withdrawal_params.min_withdraw') }}:
									<b class="clickable non-selectable" @click="setMinPossibleAmount">
										<span class="dashed">
											{{ currencyObj.minWithdraw }}
											{{ currency }}
										</span>
									</b>
								</div>

								<div>
									{{ $t('balance.stepper.withdrawal_params.day_limit') }}:
									<b>
										{{ currencyObj.maxWithdraw }}
										{{ currency }}
									</b>
									<small>
										({{ $t('balance.stepper.withdrawal_params.used_day_limit') }}: {{ currencyObj.daily }}
										{{ currency }})
									</small>
								</div>

								<div>
									{{ $t('balance.stepper.withdrawal_params.fee_withdraw') }}:
									<b>
										{{ currencyObj.feeWithdraw }}
										{{ currency }}
									</b>
								</div>

								<div>
									{{ $t('balance.stepper.withdrawal_params.available_amount') }}:
									<b>
										{{ safe.toString() }}
										{{ currency }}
									</b>
								</div>

								<div>
									{{ $t('balance.stepper.withdrawal_params.available_for_withdraw') }}:
									<b class="clickable non-selectable" @click="setAvailableForWithdrawAmount">
										<span class="dashed">
											{{ availableForWithdraw.toString() }}
											{{ currency }}
										</span>
									</b>
								</div>

								<v-form v-model="amountFormValid">
									<v-text-field
										v-model="amount"
										:rules="amountRules"
										:placeholder="$t('balance.amount')"
										:suffix="currency"
										autofocus
										@keydown="validateNumber"
										@paste.prevent
									/>
								</v-form>
							</div>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn plain tile text small @click="back">
									{{ $t('common.back') }}
								</v-btn>
								<v-spacer />
								<v-btn
									:disabled="!amount || !amountFormValid"
									:loading="loading"
									color="primary"
									tile
									text
									plain
									small
									@click="formWithdrawRequest"
								>
									{{ $t('common.continue') }}
								</v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>

						<v-stepper-content step="3">
							<div class="mb-6">
								<div>
									<span v-if="user2FA">
										{{ this.$t('balance.stepper.confirmation.enabled_2fa_description', { email: this.userEmail }) }}
									</span>
									<span v-else>
										{{ this.$t('balance.stepper.confirmation.disabled_2fa_description', { email: this.userEmail }) }}
									</span>
								</div>

								<v-text-field
									v-model="emailCode"
									:hint="$t('balance.stepper.confirmation.code_hint')"
									:placeholder="$t('balance.stepper.confirmation.code')"
									persistent-hint
								/>
								<v-text-field
									v-if="user2FA"
									v-model="twoFACode"
									:hint="$t('balance.stepper.confirmation.two_fa_code_hint')"
									:placeholder="$t('balance.stepper.confirmation.two_fa_code')"
									max-length="6"
									persistent-hint
									@keydown="validate2FA"
								/>
							</div>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn
									:disabled="!emailCode || (user2FA && !twoFACode)"
									:loading="loading"
									color="primary"
									tile
									text
									plain
									small
									@click="finish"
								>
									{{ $t('common.finish') }}
								</v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import CommonTooltip from '../../../common/CommonTooltip';

import loadingMixin from '../../../../mixins/common/loadingMixin';
import showNotificationMixin from '../../../../mixins/common/showNotificationMixin';
import validateInputMixin from '../../../../mixins/common/validateInputMixin';
import dialogMethodsMixin from '../../../../mixins/common/dialogMethodsMixin';

export default {
	name: 'BalanceCryptoDialogWithdraw',

	components: { CommonTooltip },

	mixins: [loadingMixin, showNotificationMixin, validateInputMixin, dialogMethodsMixin],

	props: {
		currencyObj: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			address: '',

			amount: '',
			amountFormValid: false,
			amountRules: [
				v => !v || v >= this.minWithdraw || this.$t('balance.less_min'),
				v => !v || v <= this.maxWithdraw || this.$t('balance.more_max'),
				v => !v || v <= this.availableForWithdraw || this.$t('balance.more_withdraw_available'),
				v => !v || this.isCorrectPrecision(v) || this.$t('forms_validation.unsupported_precision'),
			],

			emailCode: '',
			twoFACode: '',

			isSuccessWithdraw: false,
			step: 1,
		};
	},

	computed: {
		safe() {
			return this.currencyObj.safe ? BigNumber(this.currencyObj.safe).dp(this.currencyObj.scale || 2, 1) : BigNumber(0);
		},
		fee() {
			return BigNumber(this.currencyObj.feeWithdraw);
		},
		daily() {
			return BigNumber(this.currencyObj.daily);
		},
		availableForUser() {
			return this.safe.minus(this.fee).gt(0) ? this.safe.minus(this.fee) : BigNumber(0);
		},
		maxAvailable() {
			return BigNumber(this.maxWithdraw).minus(this.daily);
		},
		availableForWithdraw() {
			return BigNumber.min(this.availableForUser, this.maxAvailable);
		},
		minWithdraw() {
			return this.currencyObj.minWithdraw;
		},
		maxWithdraw() {
			return this.currencyObj.maxWithdraw;
		},
		currency() {
			return this.currencyObj.currency.toUpperCase();
		},
		user2FA() {
			return this.$store.state.app.trader.g2fa;
		},
		userEmail() {
			const dividedEmail = this.$store.state.app.trader.email.split('@');
			const encryptedName = dividedEmail[0].slice(0, 2) + '***';
			const domain = dividedEmail[1];

			return `${encryptedName}@${domain}`;
		},
	},

	mounted() {
		this.$store.subscribe(mutation => {
			const type = mutation.type;
			const { address, currency } = mutation.payload;
			const setAddressValidation = type === 'user/setAddressValidation';

			if (setAddressValidation && currency === this.currency) {
				if (address === true) {
					this.step = 2;
					this.stopLoading();
				} else if (address === false) {
					this.stopLoading();
					this.pushErrorNotification(_, 'incorrect');
				}
			}
		});
	},

	methods: {
		...mapActions({
			getBalancesFromServerStore: 'user/getBalancesFromServer',

			validateAddressStore: 'balance/validateAddress',
			formCryptoWithdrawRequestStore: 'balance/formCryptoWithdrawRequest',
			confirmCryptoWithdrawStore: 'balance/confirmCryptoWithdraw',
			fetchWithdrawalsStore: 'balance/fetchWithdrawals',
		}),

		async validateAddress() {
			if (!this.address.trim()) {
				this.pushErrorNotification();
				return;
			}

			this.startLoading();
			const payload = {
				currency: this.currency,
				address: this.address,
			};

			await this.validateAddressStore(payload);
		},

		async formWithdrawRequest() {
			try {
				this.startLoading();

				const payload = {
					currency: this.currency.toUpperCase(),
					amount: this.amount,
					address: this.address,
				};
				const isSuccess = await this.formCryptoWithdrawRequestStore(payload);

				if (isSuccess) {
					this.step++;
					this.getBalancesFromServerStore();
				}
			} finally {
				this.stopLoading();
			}
		},

		async finish() {
			try {
				this.startLoading();

				const payload = {
					code: this.emailCode,
					totp: this.user2FA ? this.twoFACode : null,
				};
				const isSuccess = await this.confirmCryptoWithdrawStore(payload);

				if (isSuccess) {
					this.isSuccessWithdraw = true;
					this.close();
				}
			} finally {
				this.stopLoading();
			}
		},

		setMinPossibleAmount() {
			this.amount = this.currencyObj.minWithdraw.toString();
		},
		setAvailableForWithdrawAmount() {
			this.amount = this.availableForWithdraw.toString();
		},

		refreshWithdrawalDataIfConfirmCodeError() {
			const confirmCodeStep = 3;
			const neededStep = this.step === confirmCodeStep;
			const unsuccessfulWithdraw = !this.isSuccessWithdraw;

			if (neededStep && unsuccessfulWithdraw) {
				this.fetchWithdrawalsStore();
			}
		},
		isCorrectPrecision(v) {
			return !new RegExp('\\d+\\.\\d{' + (this.currencyObj.scale + 1) + ',}', 'i').test(v);
		},
		clearData() {
			this.address = '';
			this.amount = '';
			this.emailCode = '';
			this.twoFACode = '';
			this.step = 1;
			this.isSuccessWithdraw = false;
		},
		close() {
			this.dialog = false;
			this.refreshWithdrawalDataIfConfirmCodeError();
		},
		back() {
			this.step--;
		},
	},
};
</script>

<style lang="sass" scoped>
.balance-crypto-dialog-withdraw__address-wrapper
	gap: 4px
</style>
