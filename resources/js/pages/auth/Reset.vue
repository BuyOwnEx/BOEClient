<template>
	<div class="layout-content auth ma-auto">
		<v-card>
			<v-card-title class="justify-center">
				<span class="overline mb-2" style="font-size: 1.25rem !important">
					{{ $t('auth.check.title') }}
				</span>
			</v-card-title>

			<v-card-subtitle>
				<span>{{ $t('auth.forgot.safe_password_alert') }}</span>
			</v-card-subtitle>

			<v-card-text>
				<v-container class="pt-0 pb-0">
					<v-row>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.email"
								append-icon="mdi-email-outline"
								:rules="[rules.required, rules.email]"
								:error-messages="errors.email"
								@input="errors.email = []"
								hide-details
								disabled
								required
							>
								<template #label>
									{{ $t('auth.email') }} <span class="red--text"><b>*</b></span>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.password"
								:type="show ? 'text' : 'password'"
								:append-icon="show ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
								:rules="[rules.required, rules.min8char]"
								:hint="$t('forms_validation.min8char')"
								:error-messages="errors.password"
								counter="255"
								persistent-hint
								required
								@input="errors.password = []"
								@click:append="show = !show"
							>
								<template #label>
									{{ $t('auth.password') }} <span class="red--text"><b>*</b></span>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.password_confirmation"
								:append-icon="show_confirm ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
								:rules="[rules.required, rules.min8char, rules.passMatch]"
								:type="show_confirm ? 'text' : 'password'"
								:hint="$t('auth.forgot.repeat_pass')"
								:error-messages="errors.password_confirmation"
								counter="255"
								persistent-hint
								required
								@input="errors.password_confirmation = []"
								@click:append="show_confirm = !show_confirm"
							>
								<template #label>
									{{ $t('auth.forgot.confirm_pass') }}
									<span class="red--text"><b>*</b></span>
								</template>
							</v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>

			<v-card-actions class="pt-4 pl-6 pr-6 pb-4">
				<v-btn color="primary" :loading="loading" :disabled="!valid || loading" block tile @click="set">
					{{ $t('common.set') }}
				</v-btn>
			</v-card-actions>
		</v-card>

		<v-alert v-if="reset_alert" dense text type="warning" class="mt-4">
			{{ $t('auth.resend_activation_link_text') }}
		</v-alert>
	</div>
</template>

<script>
import formValidationRules from '../../mixins/common/formValidationRules';
import loadingMixin from '../../mixins/common/loadingMixin';

export default {
	name: 'Reset',

	mixins: [formValidationRules, loadingMixin],

	data() {
		return {
			valid: true,
			loading: false,

			show: false,
			show_confirm: false,

			user: {
				email: window.reset.email,
				token: window.reset.token,
				password: '',
				password_confirmation: '',
			},
			errors: {
				email: [],
				password: [],
				password_confirmation: [],
			},
			reset_alert: false,
		};
	},

	methods: {
		set() {
			this.startLoading();
			axios
				.post('/password/reset', this.user)
				.then(response => {
					if (response.data.reset) this.reset_alert = true;
					//else this.$store.commit('snackbars/showSnackbar',{ text: response.data.message, success: false});
				})
				.catch(error => {
					this.reset_alert = false;
					if (error.response.status === 422) {
						let errors = error.response.data.errors;
						if (errors) {
							for (let field in errors) {
								if (errors.hasOwnProperty(field)) {
									this.errors[field] = errors[field];
								}
							}
						}
					} else {
						//this.$store.commit('snackbars/showSnackbar',{ text: error.response.data.message || error.response.statusText, success: false});
					}
				})
				.finally(() => {
					this.stopLoading()
				});
		},
	},
};
</script>
