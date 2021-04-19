<template>
	<div class="layout-content auth ma-auto">
		<v-card>
			<v-card-title class="justify-center">
				<span class="overline mb-2" style="font-size: 1.25rem !important">
					{{ formTitle }}
				</span>
			</v-card-title>

			<v-card-subtitle>
				<span>{{ formSubTitle }}</span>
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
					</v-row>
				</v-container>
			</v-card-text>

			<div class="caption grey--text darken-4 pl-6 pr-6">
				<small>{{ $t('auth.no_letter') }}</small>
			</div>

			<v-card-actions class="pt-4 pl-6 pr-6 pb-4">
				<v-btn color="primary" :loading="loading" :disabled="!valid" block tile @click="resend">
					{{ applyButton }}
				</v-btn>
			</v-card-actions>
		</v-card>

		<v-alert v-if="resend_alert" dense text type="warning" class="mt-4">
			{{ $t('auth.resend_activation_link_text') }}
		</v-alert>

		<div class="text-center mt-6" style="position: relative; z-index: 2">
			<div class="caption grey--text darken-4">
				{{ $t('auth.already_activated') }}
			</div>

			<v-btn block small text tile href="/login" color="primary darken-1">
				{{ $t('auth.login_btn_text') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import formValidationRules from '../../mixins/common/formValidationRules';

export default {
	name: 'Verify',

	mixins: [formValidationRules],

	data() {
		return {
			valid: true,
			loading: false,
			formTitle: this.$t('auth.verify.title'),
			formSubTitle: this.$t('auth.verify.subtitle'),
			applyButton: this.$t('common.resend'),
			user: {
				email: window.activation.email,
			},
			errors: {
				email: [],
			},
			resend_alert: false,
		};
	},

	methods: {
		resend() {
			let self = this;
			this.loading = true;
			axios
				.post('/email/resend', this.user)
				.then(response => {
					if (response.data.resend) this.resend_alert = true;
					//else this.$store.commit('snackbars/showSnackbar',{ text: response.data.message, success: false});
				})
				.catch(error => {
					this.resend_alert = false;
					if (error.response.status === 422) {
						let errors = error.response.data.errors;
						if (errors) {
							for (let field in errors) {
								if (errors.hasOwnProperty(field)) {
									self.errors[field] = errors[field];
								}
							}
						}
					} else {
						//this.$store.commit('snackbars/showSnackbar',{ text: error.response.data.message || error.response.statusText, success: false});
					}
				})
				.finally(function() {
					self.loading = false;
				});
		},
	},
};
</script>
