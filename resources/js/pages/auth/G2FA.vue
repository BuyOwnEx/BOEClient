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
								v-model="form.totp"
								append-icon="mdi-schield"
								:rules="[rules.required]"
								:error-messages="errors.totp"
								@input="errors.totp = []"
								required
							>
								<template #label>
									{{ $t('auth.g2fa.code') }} <span class="red--text"><b>*</b></span>
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
				<v-btn color="primary" :loading="loading" :disabled="!valid" block tile @click="verify">
					{{ applyButton }}
				</v-btn>
			</v-card-actions>
		</v-card>

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
	name: 'G2FA',

	mixins: [formValidationRules],

	data() {
		return {
			valid: true,
			loading: false,
			formTitle: this.$t('auth.g2fa.title'),
			formSubTitle: this.$t('auth.g2fa.subtitle'),
			applyButton: this.$t('auth.g2fa.verify'),
			form: {
				totp: '',
			},
			errors: {
				totp: [],
			},
		};
	},

	methods: {
		verify() {
			let self = this;
			this.loading = true;
			axios
				.post('/2fa_validate', this.form)
				.then(response => {
					console.log(response.data);
					if (response.data.auth) window.location.href = response.data.intended;
					else this.$store.commit('snackbars/showSnackbar', { text: response.data.message, success: false });
				})
				.catch(error => {
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