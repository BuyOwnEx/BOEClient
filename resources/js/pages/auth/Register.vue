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
								:rules="[rules.required, rules.min8char, rules.passMatch]"
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

			<div class="text-left pl-5 pr-5" v-if="product.force_agree">
        <small class="grey--text lighten-4">
          {{ $t('auth.register.agree') }}
          <Link :path="links[0].link" :title="links[0].title">
            <span>{{ links[0].title }}</span>
          </Link>
          {{ $t('auth.and') }}
          <Link :path="links[1].link" :title="links[1].title">
            <span>{{ links[1].title }}</span>
          </Link>
        </small>
			</div>
      <div class="text-left pl-4 pr-5" v-else>
        <v-checkbox dense :ripple="false" hide-details v-model="term_agree">
          <template #label>
            <small class="grey--text lighten-4">
              {{ $t('auth.register.checkbox_agree_terms') }}
              <Link :path="links[0].link" :title="links[0].title">
                <span>{{links[0].title }}</span>
              </Link>
            </small>
          </template>
        </v-checkbox>
        <v-checkbox dense :ripple="false" hide-details v-model="policy_agree">
          <template #label>
            <small class="grey--text lighten-4">
              {{ $t('auth.register.checkbox_agree_policy') }}
              <Link :path="links[1].link" :title="links[1].title">
                <span>{{links[1].title }}</span>
              </Link>
            </small>
          </template>
        </v-checkbox>
      </div>

			<v-card-actions class="pt-4 pl-6 pr-6">
				<v-btn color="primary" :loading="loading" :disabled="!valid || (!product.force_agree && (!term_agree || !policy_agree))" block tile @click="register">
					{{ $t('auth.register.register_action') }}
				</v-btn>
			</v-card-actions>

			<div class="text-left pl-5 pb-2 pr-5">
        <small style="font-size: 60%">
					<span class="red--text">
						<b>*</b>
					</span>
          <span class="grey--text text--lighten-1">
						{{ $t('auth.indicates_required_fields') }}
					</span>
        </small>
			</div>
		</v-card>

		<div class="text-center mt-6" style="position: relative; z-index: 2">
			<div class="caption grey--text darken-4">
				{{ $t('auth.register.account') }}
			</div>
            <v-btn block small text tile href="/login" :to="this.$spa ? '/login' : null" color="primary darken-1">
                {{ $t('auth.signin') }}
            </v-btn>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import formValidationRules from '@/mixins/common/formValidationRules';
import loadingMixin from '@/mixins/common/loadingMixin';
import Link from "@/components/common/Link.vue";
import waves from '@/plugins/hero-canvas';

export default {
	name: 'Register',
    components: {Link},
    mixins: [formValidationRules, loadingMixin],
	data() {
		return {
			valid: true,
			show: false,
			show_confirm: false,
      term_agree: false,
      policy_agree: false,

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
    ...mapState('app', ['product']),
		links() {
			return [
				{
					title: this.$t('auth.register.terms_link'),
					link: '/terms',
				},
				{
					title: this.$t('auth.register.policy_link'),
					link: '/policy',
				},
			];
		},
	},
  mounted() {
    waves.ClassicalNoise.prototype.start();
  },
  beforeRouteLeave(to, from, next) {
    waves.ClassicalNoise.prototype.stop();
    next();
  },
	methods: {
		register() {
			this.startLoading();
			axios
				.post('/register', this.user)
				.then(response => {
					if (response.data.registered) window.location.href = response.data.intended;
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
