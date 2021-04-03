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
								v-model="user.name"
								append-icon="mdi-account-outline"
								:rules="rules.nameRules"
								counter="128"
								hint="Min. characters: 5. Available: [a-zA-Z0-9-_]"
								:error-messages="errors.name"
								@input="errors.name = []"
								persistent-hint
								clearable
								required
							>
								<template #label>
									Login <span class="red--text"><strong>*</strong></span>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.email"
								append-icon="mdi-email-outline"
								:rules="[rules.required, rules.email]"
								counter="255"
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

			<v-card-actions class="pt-4 pl-6 pr-6">
				<v-btn
					color="primary"
					:loading="loading"
					:disabled="!valid || loading"
					block
					tile
					@click="register"
				>
					{{ applyButton }}
				</v-btn>
			</v-card-actions>

			<div class="text-left pl-6 pb-4 pr-6">
				<small class="grey--text lighten-4">
					{{ $t('auth.register_text1') }}
					<a :href="links[0].link">
						<span>{{ links[0].title }}</span>
					</a>
					{{ $t('auth.and') }}
					<a :href="links[1].link">
						<span>{{ links[1].title }}</span>
					</a>
					{{ $t('auth.register_text2') }}
				</small>
			</div>
		</v-card>

		<!--<snackbar position="relative"></snackbar>-->

		<div class="text-center mt-6" style="position: relative; z-index: 2">
			<div class="caption grey--text darken-4">
				{{ $t('auth.register.account') }}
			</div>
			<v-btn block small text tile href="/login" color="primary darken-1">
				{{ $t('auth.register.signin') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Register',

	data() {
		return {
			links: [
				{
					title: this.$t('auth.register_terms_link'),
					link: '/terms',
				},
				{
					title: this.$t('auth.register_policy_link'),
					link: '/policy',
				},
			],
			valid: true,
			loading: false,
			formTitle: this.$t('auth.register.title'),
			formSubTitle: 'Fill the below fields to register as a trader',
			applyButton: 'Register',
			show: false,
			show_confirm: false,
			rules: {
				required: v => !!v || 'The field is required',
				min: v => (v && v.length >= 8) || 'Min 8 characters',
				confirm: v =>
					(v && v === this.user.password) || 'Passwords do not match',
				email: v => (v && /.+@.+\..+/.test(v)) || 'E-mail must be valid',
				nameRules: [
					v => !!v || 'The field is required',
					v => (v && v.length >= 5) || 'Min 5 characters',
					v =>
						(v && /^[a-zA-Z0-9-_]+$/g.test(v)) ||
						'Unsupported characters. Must be in range [a-zA-Z0-9-_]',
				],
			},
			user: {
				name: '',
				email: '',
				password: '',
				password_confirmation: '',
			},
			errors: {
				name: [],
				email: [],
				password: [],
				password_confirmation: [],
			},
		};
	},

	methods: {
		register() {
			let self = this;
			this.loading = true;
			axios
				.post('/register', this.user)
				.then(response => {
					if (response.data.registered)
						window.location.href = response.data.intended;
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
