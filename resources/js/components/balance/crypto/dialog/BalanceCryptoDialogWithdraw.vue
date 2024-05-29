<template>
	<v-dialog v-model="dialog" width="1200" :persistent="step === 4">
		<template #activator="{ on, attrs }">
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
					{{ currencyObj.currency }}
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
							{{ $t('balance.select_network') }}
						</v-stepper-step>

						<v-divider />

						<v-stepper-step :complete="step > 2" step="2">
							{{ $t('balance.stepper.address_validation.title') }}
						</v-stepper-step>

						<v-divider />

            <v-stepper-step :complete="step > 3" step="3">
              {{ $t('balance.stepper.withdrawal_params.title') }}
            </v-stepper-step>

            <v-divider />

						<v-stepper-step step="4">
							{{ $t('common.confirmation') }}
						</v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
            <v-stepper-content step="1">
              <BalanceCryptoDialogSelectSystem
                  class="mb-2"
                  :platforms="currencyObj.platforms"
                  type="withdraw"
                  @select="selectPlatform"
              />

              <v-divider />

              <div class="common-dialog__actions d-flex pt-1">
                <v-spacer />
                <v-btn plain tile text small @click="close">
                  {{ $t('common.close') }}
                </v-btn>
              </div>
            </v-stepper-content>
						<v-stepper-content step="2">
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

						<v-stepper-content step="3">
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

								<CommonAvailable
									:available="selectedPlatform !== null ? selectedPlatform.minWithdraw : '-'"
									:currency="currency"
									:available-text="$t('balance.stepper.withdrawal_params.min_withdraw')"
									@set="setMinPossibleAmount"
								/>

								<CommonAvailable
									:available="currencyObj.maxWithdraw"
									:currency="currency"
									:available-text="$t('balance.max_amount')"
									:small-text="$t('balance.stepper.withdrawal_params.used_day_limit')"
									:small="currencyObj.daily"
									non-clickable
								/>

								<CommonAvailable
									:available="selectedPlatform !== null ? selectedPlatform.feeWithdraw: '-'"
									:currency="currency"
									:available-text="$t('balance.stepper.withdrawal_params.fee_withdraw')"
									non-clickable
								/>

								<CommonAvailable
									:available="safe.toString()"
									:currency="currency"
									:available-text="$t('balance.stepper.withdrawal_params.available_amount')"
									non-clickable
								/>

								<CommonAvailable
									:available="availableForWithdraw"
									:currency="currency"
									:available-text="$t('balance.stepper.withdrawal_params.available_for_withdraw')"
									@set="setAvailableForWithdrawAmount"
								/>

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

                  <v-text-field
                      v-if="needTagField"
                      v-model="memo"
                      :rules="memoRules"
                      :placeholder="$t('balance.memo')"
                      @paste.prevent
                  />

                  <v-select v-if="is_legal && is_reason_enabled"
                      v-model="reason_id"
                      :items="all_reasons"
                      item-text="name"
                      item-value="value"
                      :label="$t('balance.withdraw_reason')"
                      :hint="$t('balance.withdraw_reason_hint')"
                      persistent-hint
                      hide-details="auto"
                      required
                      class="required"
                  ></v-select>
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
									:disabled="form_withdraw_disabled"
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

						<v-stepper-content step="4">
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
									:hint="$t('user.code_hint')"
									:placeholder="$t('user.code')"
									persistent-hint
								/>
								<v-text-field
									v-if="user2FA"
									v-model="twoFACode"
									:hint="$t('user.two_fa_code_hint')"
									:placeholder="$t('user.two_fa_code')"
									maxlength="6"
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

import { mapActions, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import CommonTooltip from '@/components/common/CommonTooltip.vue';
import CommonAvailable from '@/components/common/CommonAvailable.vue';
import BalanceCryptoDialogSelectSystem from '@/components/balance/crypto/dialog/parts/BalanceCryptoDialogSelectSystem.vue';

import loadingMixin from '@/mixins/common/loadingMixin';
import showNotificationMixin from '@/mixins/common/showNotificationMixin';
import validateInputMixin from '@/mixins/common/validateInputMixin';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin';

export default {
	name: 'BalanceCryptoDialogWithdraw',

	components: { BalanceCryptoDialogSelectSystem, CommonTooltip, CommonAvailable },

	mixins: [loadingMixin, showNotificationMixin, validateInputMixin, dialogMethodsMixin],

	props: {
		currencyObj: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
      selectedPlatform: null,
			address: '',
			amount: '',
      memo: '',
      reason_id: null,
			amountFormValid: false,
			amountRules: [
				v => !v || BigNumber(v).gte(this.minWithdraw) || this.$t('balance.less_min'),
				v => !v || BigNumber(v).lte(this.maxWithdraw) || this.$t('balance.more_max'),
				v => !v || BigNumber(v).lte(this.availableForWithdraw) || this.$t('balance.more_withdraw_available'),
				v => !v || this.isCorrectPrecision(v) || this.$t('forms_validation.unsupported_precision'),
			],
      memoRules: [
        v => !v || v.length <= 64 || this.$t('forms_validation.max_64char'),
        v => !v || (v && /^[a-zA-Z0-9-_]+$/g.test(v)) || this.$t('forms_validation.unsupported_char_latinAndNumbers'),
      ],
			emailCode: '',
			twoFACode: '',
			isSuccessWithdraw: false,
			step: 1,
      all_reasons: [
        { value: 1, name: this.$t('balance.withdraw_reasons.invest') },
        { value: 2, name: this.$t('balance.withdraw_reasons.supplier') }
      ]
		};
	},

	computed: {
    ...mapState('user', ['status']),
    ...mapState('app', ['product']),
    is_legal() {
      return (this.status & 4) === 4;
    },
    is_reason_enabled() {
      return this.product.enabledLegalWithdrawReason
    },
    form_withdraw_disabled() {
      return (!this.amount || !this.amountFormValid) || (this.is_legal && this.is_reason_enabled && !this.reason_id)
    },
		safe() {
			return this.currencyObj.safe ? BigNumber(this.currencyObj.safe).dp(this.currencyObj.scale || 2, 1) : BigNumber(0);
		},
		fee() {
			return this.selectedPlatform ? BigNumber(this.selectedPlatform.feeWithdraw) : 0;
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
			return BigNumber.min(this.availableForUser, this.maxAvailable).toString();
		},
		minWithdraw() {
			return this.selectedPlatform ? this.selectedPlatform.minWithdraw : 0;
		},
    needTagField() {
      return this.selectedPlatform ? this.selectedPlatform.base_currency === 'TON' : false;
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
            if (mutation.type === 'user/setAddressValidation') {
                const { address, currency, platform } = mutation.payload;
                if (currency === this.currency && platform.toLowerCase() === this.selectedPlatform.base_currency.toLowerCase()) {
                    if (address === true) {
                        this.step = 3;
                        this.stopLoading();
                    } else if (address === false) {
                        this.stopLoading();
                        this.pushErrorNotification(_, 'incorrect');
                    }
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
    selectPlatform(platform) {
      this.selectedPlatform = platform;
      this.step++;
    },
		async validateAddress() {
			if (!this.address.trim()) {
				this.pushErrorNotification();
				return;
			}

			this.startLoading();
			const payload = {
				currency: this.currency,
				address: this.address,
        platform_id: this.selectedPlatform.id
			};

			await this.validateAddressStore(payload);
		},

		async formWithdrawRequest() {
			try {
				this.startLoading();

				let payload = {
					currency: this.currency.toUpperCase(),
					amount: this.amount,
          reason_id: this.reason_id,
					address: this.memo !== ''? this.address + ':' + this.memo : this.address,
          platform_id: this.selectedPlatform.id
				};
				const isSuccess = await this.formCryptoWithdrawRequestStore(this.is_legal ? payload : _.omit(payload, ['reason_id']));

				if (isSuccess) {
					this.step++;
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
          await this.getBalancesFromServerStore();
					this.close();
				}
			} finally {
				this.stopLoading();
			}
		},

		setMinPossibleAmount() {
			this.amount = BigNumber(this.selectedPlatform.minWithdraw).toString();
		},
		setAvailableForWithdrawAmount() {
			this.amount = this.availableForWithdraw;
		},

		refreshWithdrawalDataIfConfirmCodeError() {
			const confirmCodeStep = 4;
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
      this.reason_id = null;
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
