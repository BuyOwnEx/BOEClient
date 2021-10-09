<template>
	<v-dialog v-model="dialog" width="600" :persistent="step === 3">
		<template #activator="{ on, attrs }">
			<v-btn class="mb-2" v-bind="attrs" v-on="on">
				<v-icon left small>mdi-email</v-icon>
				{{ $t('common.change') }}
			</v-btn>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title pb-0">
				{{ $t('user.info.change_email') }}

				<v-spacer />

				<v-btn icon @click="close">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>

			<v-card-text class="common-dialog__content pb-1 pt-0">
				<v-stepper v-model="step">
					<v-stepper-header>
						<v-stepper-step :complete="step > 1" step="1">
							{{ $t('common.request') }}
						</v-stepper-step>

						<v-divider />

						<v-stepper-step :complete="step > 2" step="2">
							{{ $t('common.confirmation') }}
						</v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1">
							<v-form v-model="isValidRequestForm">
								<v-text-field
									class="mb-6 pt-1"
									v-model="newEmail"
									:label="$t('user.info.new_email')"
									:rules="[rules.required, rules.email]"
									validate-on-blur
									autofocus
									outlined
								/>
							</v-form>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn plain tile text small @click="close">
									{{ $t('common.cancel') }}
								</v-btn>
								<v-spacer />
								<v-btn
									:loading="loading"
									:disabled="!newEmail.trim()"
									color="primary"
									tile
									text
									plain
									small
									@click="sendEmailCodes"
								>
									{{ $t('common.continue') }}
								</v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>

						<v-stepper-content step="2">
							<v-form class="mb-6" v-model="isValidConfirmForm">
								<v-text-field
									v-model="oldEmailCode"
									:rules="[rules.required]"
									:hint="$t('user.info.old_email_code_hint')"
									:placeholder="$t('user.info.old_email_code')"
									persistent-hint
									validate-on-blur
								/>
								<v-text-field
									v-model="newEmailCode"
									:rules="[rules.required]"
									:hint="$t('user.info.new_email_code_hint')"
									:placeholder="$t('user.info.new_email_code')"
									persistent-hint
									validate-on-blur
								/>
								<v-text-field
									v-if="twoFa"
									v-model="twoFaCode"
									:rules="[rules.required]"
									:hint="$t('user.two_fa_code_hint')"
									:placeholder="$t('user.two_fa_code')"
									maxlength="6"
									persistent-hint
									validate-on-blur
									@keydown="validate2FA"
									@input="handleCodeInput"
								/>
							</v-form>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn plain tile text small @click="back">
									{{ $t('common.back') }}
								</v-btn>
								<v-spacer />
								<v-btn
									:disabled="!oldEmailCode || !newEmailCode || (!twoFaCode && twoFa)"
									:loading="loading"
									color="primary"
									tile
									text
									plain
									small
									@click="validateEmailCodes"
								>
									{{ $t('common.continue') }}
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
import { mapMutations, mapActions } from 'vuex';

import CommonTooltip from '../../../common/CommonTooltip';

import loadingMixin from '../../../../mixins/common/loadingMixin';
import showNotificationMixin from '../../../../mixins/common/showNotificationMixin';
import validateInputMixin from '../../../../mixins/common/validateInputMixin';
import dialogMethodsMixin from '../../../../mixins/common/dialogMethodsMixin';
import formValidationRules from '../../../../mixins/common/formValidationRules';

export default {
	name: 'UserAccountDialogChangeEmail',

	components: {
		CommonTooltip,
	},

	mixins: [loadingMixin, showNotificationMixin, validateInputMixin, dialogMethodsMixin, formValidationRules],

	props: {
		currentEmail: {
			type: String,
			required: true,
		},
		twoFa: {
			type: Boolean,
			required: true,
		},
	},

	data() {
		return {
			newEmail: '',

			oldEmailCode: '',
			newEmailCode: '',
			twoFaCode: '',

			isValidRequestForm: false,
			isValidConfirmForm: false,
			step: 1,
		};
	},

	methods: {
		...mapMutations({
			setUserEmailStore: 'app/setUserEmail',
		}),
		...mapActions({
			formChangeEmailRequestStore: 'user/formChangeEmailRequest',
			formChangeEmailConfirmStore: 'user/formChangeEmailConfirm',
		}),
		async sendEmailCodes() {
			if (!this.isValidRequestForm) return;

			try {
				this.startLoading();

				const payload = {
					email: this.newEmail,
				};
				await this.formChangeEmailRequestStore(payload);

				this.step++;
			} finally {
				this.stopLoading();
			}
		},
		async validateEmailCodes() {
			if (!this.isValidConfirmForm) return;

			try {
				this.startLoading();

				const payload = {
					code_old_email: this.oldEmailCode,
					code_new_email: this.newEmailCode,
					totp: this.twoFa ? this.twoFaCode : null,
				};
				const success = await this.formChangeEmailConfirmStore(payload);
				if (success) {
					this.setUserEmailStore(this.newEmail);
					this.pushNotification(this.$t('user.info.email_changed'), 'success');
				}

				this.close();
			} finally {
				this.stopLoading();
			}
		},

		handleCodeInput(value) {
			if (value.length === 6 && this.oldEmailCode && this.newEmailCode) this.validateEmailCodes();
		},

		clearData() {
			this.newEmail = '';
			this.oldEmailCode = '';
			this.newEmailCode = '';
			this.twoFaCode = '';
			this.step = 1;
		},
		close() {
			this.dialog = false;
		},
		back() {
			this.step--;
		},
	},
};
</script>
