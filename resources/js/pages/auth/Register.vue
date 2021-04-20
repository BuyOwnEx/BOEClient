<template>
	<div class="layout-content auth ma-auto">
		<v-card>
			<v-card-title class="justify-center">
				<span class="overline mb-2" style="font-size: 1.25rem !important">
					{{ $t('auth.register.title') }}
				</span>
			</v-card-title>

			<v-card-subtitle>
				<span>{{ $t('auth.register.subtitle') }}</span>
			</v-card-subtitle>

			<v-card-text>
				<v-container class="pt-0 pb-0">
					<v-row>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.name"
								:rules="[rules.min5char, rules.required, rules.latinAndNumbers]"
								:hint="$t('auth.register.username_rules')"
								:error-messages="errors.name"
								append-icon="mdi-account-outline"
								counter="128"
								persistent-hint
								clearable
								required
								@input="errors.name = []"
							>
								<template #label>
									{{ $t('auth.username') }} <span class="red--text"><b>*</b></span>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.email"
								append-icon="mdi-email-outline"
								counter="255"
								:rules="[rules.required, rules.email]"
								:hint="$t('auth.login.enter_your_email')"
								:error-messages="errors.email"
								persistent-hint
								clearable
								required
								@input="errors.email = []"
							>
								<template #label>
									{{ $t('auth.email') }} <span class="red--text"><b>*</b></span>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.password"
								:append-icon="show ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
								:rules="[rules.required, rules.min8char]"
								:type="show ? 'text' : 'password'"
								counter="255"
								:hint="$t('forms_validation.min_8char')"
								persistent-hint
								:error-messages="errors.password"
								@input="errors.password = []"
								@click:append="show = !show"
								required
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
								:rules="[rules.required, rules.min8char, rules.confirm]"
								:type="show_confirm ? 'text' : 'password'"
								counter="255"
								:hint="$t('auth.forgot.repeat_pass')"
								persistent-hint
								:error-messages="errors.password_confirmation"
								@input="errors.password_confirmation = []"
								@click:append="show_confirm = !show_confirm"
								required
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

			<div class="text-left pl-6 pr-6">
				<small>
					<span class="red--text">
						<b>*</b>
					</span>
					<span class="grey--text text--lighten-1">
						{{ $t('auth.indicates_required_fields') }}
					</span>
				</small>
			</div>

			<v-card-actions class="pt-4 pl-6 pr-6">
				<v-btn color="primary" :loading="loading" :disabled="!valid" block tile @click="register">
					{{ $t('auth.register.register_action') }}
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

		<div class="text-center mt-6" style="position: relative; z-index: 2">
			<div class="caption grey--text darken-4">
				{{ $t('auth.register.account') }}
			</div>
			<v-btn block small text tile href="/login" color="primary darken-1">
				{{ $t('auth.signin') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import formValidationRules from '../../mixins/common/formValidationRules';
import loadingMixin from '../../mixins/common/loadingMixin';

export default {
	name: 'Register',

	mixins: [formValidationRules, loadingMixin],

	data() {
		return {
			valid: true,
			loading: false,

			show: false,
			show_confirm: false,

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

	computed: {
		links() {
			return [
				{
					title: this.$t('auth.register_terms_link'),
					link: '/terms',
				},
				{
					title: this.$t('auth.register_policy_link'),
					link: '/policy',
				},
			];
		},
	},

	methods: {
		register() {
			this.startLoading();
			axios
				.post('/register', this.user)
				.then(response => {
					if (response.data.registered) window.location.href = response.data.intended;
					//else this.$store.commit('snackbars/showSnackbar',{ text: response.data.message, success: false});
				})
				.catch(error => {
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
					this.stopLoading();
				});
		},
	},
};
</script>
