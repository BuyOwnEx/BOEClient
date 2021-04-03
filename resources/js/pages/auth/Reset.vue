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
									Email <span class="red--text"><strong>*</strong></span>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.password"
								:append-icon="show ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
								:rules="[rules.required, rules.min]"
								:type="show ? 'text' : 'password'"
								counter="255"
								hint="At least 8 characters"
								persistent-hint
								:error-messages="errors.password"
								@input="errors.password = []"
								@click:append="show = !show"
								required
							>
								<template #label>
									Password <span class="red--text"><strong>*</strong></span>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.password_confirmation"
								:append-icon="
									show_confirm ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
								"
								:rules="[rules.required, rules.min, rules.confirm]"
								:type="show_confirm ? 'text' : 'password'"
								counter="255"
								hint="Repeat password"
								persistent-hint
								:error-messages="errors.password_confirmation"
								@input="errors.password_confirmation = []"
								@click:append="show_confirm = !show_confirm"
								required
							>
								<template #label>
									Confirm password
									<span class="red--text"><strong>*</strong></span>
								</template>
							</v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>

			<v-card-actions class="pt-4 pl-6 pr-6 pb-4">
				<v-btn
					color="primary"
					:loading="loading"
					:disabled="!valid || loading"
					block
					tile
					@click="set"
				>
					{{ applyButton }}
				</v-btn>
			</v-card-actions>
		</v-card>

		<v-alert v-if="reset_alert" dense text type="warning" class="mt-4">
			{{ $t('auth.resend_activation_link_text') }}
		</v-alert>
	</div>
</template>

<script>
export default {
	name: 'Reset',

	//components: {Snackbar},

	data() {
		return {
			valid: true,
			loading: false,
			formTitle: this.$t('auth.check.title'),
			formSubTitle:
				'Please, store your password in a safe place and do not give it to other persons',
			applyButton: 'Set',
			show: false,
			show_confirm: false,
			rules: {
				required: v => !!v || 'The field is required',
				min: v => (v && v.length >= 8) || 'Min 8 characters',
				confirm: v =>
					(v && v === this.user.password) || 'Passwords do not match',
				email: v => (v && /.+@.+\..+/.test(v)) || 'E-mail must be valid',
			},
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
			let self = this;
			this.loading = true;
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
