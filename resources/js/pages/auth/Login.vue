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
								hint="Enter your email"
								:error-messages="errors.email"
								@input="errors.email = []"
								persistent-hint
								clearable
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
								hint="Enter your password"
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
							<v-checkbox v-model="user.remember" label="Remember me" />
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>

			<div class="text-left pl-6 pr-6">
				<small>
					<span class="red--text">
						<strong>*</strong>
					</span>
					<span class="grey--text text--lighten-1">
						indicates required field
					</span>
				</small>
			</div>

			<v-card-actions class="pt-4 pl-6 pr-6 pb-4">
				<v-btn
					color="primary"
					:loading="loading"
					:disabled="!valid || loading"
					tile
					block
					@click="login"
				>
					{{ applyButton }}
				</v-btn>
			</v-card-actions>

			<div class="caption grey--text darken-4 pb-4 pl-6 pr-6">
				<v-btn
					class="text-decoration-underline"
					color="primary"
					href="/password/reset"
					small
					plain
				>
					{{ $t('auth.login.forgot') }}
				</v-btn>
			</div>
		</v-card>

		<v-alert v-if="verify_block" dense text type="success" class="mt-4">
			{{ $t('auth.login.verified_text') }}
		</v-alert>

		<v-alert v-if="verify_error" dense text type="error" class="mt-4">
			{{ verify_error }}
		</v-alert>

		<div class="text-center mt-6" style="position: relative; z-index: 2">
			<div class="caption grey--text darken-4">
				{{ $t('auth.login.noaccount') }}
			</div>
			<v-btn block small text tile href="/register" color="primary darken-1">
				{{ $t('auth.login.create') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Login',

	data() {
		return {
			valid: true,
			loading: false,
			formTitle: 'Login',
			formSubTitle: 'Fill in the fields to log in',
			applyButton: 'Login',
			show: false,
			rules: {
				required: v => !!v || 'The field is required',
				min: v => (v && v.length >= 6) || 'Min 6 characters',
				email: v => (v && /.+@.+\..+/.test(v)) || 'E-mail must be valid',
			},
			user: {
				email: '',
				password: '',
				remember: false,
			},
			errors: {
				email: [],
				password: [],
				remember: [],
			},
			verify_block: window.verified,
			verify_error: window.v_error,
		};
	},

	methods: {
		login() {
			let self = this;
			this.loading = true;
			let form = this.user.remember
				? this.user
				: _.omit(this.user, ['remember']);
			axios
				.post('/login', form)
				.then(response => {
					console.log(response);
					if (response.data.auth) window.location.href = response.data.intended;
					//else this.$store.commit('snackbars/showSnackbar',{ text: response.data.message, success: false});
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
