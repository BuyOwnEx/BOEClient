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

								<div class="subtitle-1 py-1">
									<CommonTooltip>
										<v-icon>
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
									<b
										class="clickable non-selectable px-1"
										@click="setMinPossibleAmount"
									>
										<span class="dashed">
											{{ currencyObj.minWithdraw }}
											{{ currency }}
										</span>
									</b>
								</div>
								<div>
									{{ $t('balance.stepper.withdrawal_params.day_limit') }}:
									<b
										class="clickable non-selectable px-1"
										@click="setMaxPossibleAmount"
									>
										<span class="dashed">
											{{ currencyObj.maxWithdraw }}
											{{ currency }}
										</span>
									</b>
								</div>
								<div>
									{{ $t('balance.stepper.withdrawal_params.fee_withdraw') }}:
									<b class="px-1">
										{{ currencyObj.feeWithdraw }}
										{{ currency }}
									</b>
								</div>
								<div>
									{{
										$t('balance.stepper.withdrawal_params.available_amount')
									}}:
									<b
										class="clickable non-selectable px-1"
										@click="setSafeAmount"
									>
										<span class="dashed">
											{{ safe }}
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
									@click="step++"
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
										{{
											this.$t(
												'balance.stepper.confirmation.enabled_2fa_description',
												{ email: this.userEmail }
											)
										}}
									</span>
									<span v-else>
										{{
											this.$t(
												'balance.stepper.confirmation.disabled_2fa_description',
												{ email: this.userEmail }
											)
										}}
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

export default {
	name: 'BalanceCryptoDialogWithdraw',

	components: { CommonTooltip },

	mixins: [loadingMixin, showNotificationMixin, validateInputMixin],

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
				v =>
					!v ||
					this.isCorrectPrecision(v) ||
					this.$t('forms_validation.unsupported_precision'),
			],

			emailCode: '',
			twoFACode: '',

			dialog: false,
			step: 1,
		};
	},

	computed: {
		safe() {
			const item = this.currencyObj;
			const scale = item.scale || 2;

			if (item.safe) {
				return BigNumber(item.safe)
					.dp(scale, 1)
					.toString();
			} else {
				return BigNumber(0)
					.dp(0)
					.toString();
			}
		},

		minWithdraw() {
			return this.currencyObj.minWithdraw;
		},
		maxWithdraw() {
			return Math.min(this.currencyObj.maxWithdraw, this.currencyObj.safe);
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

	watch: {
		dialog(val) {
			if (val) {
				this.closeMenu();
				this.resetData();
			}
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
			validateAddressStore: 'balance/validateAddress',
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
		async finish() {
			try {
				this.startLoading();

				// await axios.post()

				this.close();
			} finally {
				this.stopLoading();
			}
		},

		setMinPossibleAmount() {
			this.amount = this.currencyObj.minWithdraw;
		},
		setMaxPossibleAmount() {
			this.amount = this.currencyObj.maxWithdraw;
		},
		setSafeAmount() {
			this.amount = this.safe;
		},

		isCorrectPrecision(v) {
			return !new RegExp(
				'\\d+\\.\\d{' + (this.currencyObj.scale + 1) + ',}',
				'i'
			).test(v);
		},
		resetData() {
			this.address = '';
			this.amount = '';
			this.emailCode = '';
			this.twoFACode = '';
			this.step = 1;
		},
		close() {
			this.dialog = false;
		},
		back() {
			this.step--;
		},
		closeMenu() {
			this.$emit('close-menu');
		},
	},
};
</script>
