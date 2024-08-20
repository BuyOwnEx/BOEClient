<template>
	<div class="layout-content auth ma-auto">
		<v-card>
			<v-card-title class="justify-center">
				<span class="overline mb-2" style="font-size: 1.25rem !important">
					{{ $t('auth.login.title') }}
				</span>
			</v-card-title>

			<v-card-subtitle>
				<span>{{ $t('auth.login.fill_all_to_login') }}</span>
			</v-card-subtitle>

			<v-card-text>
				<v-container class="pt-0 pb-0">
					<v-row>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.email"
								append-icon="mdi-email-outline"
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
								:rules="[rules.required, rules.min6char]"
								:type="show ? 'text' : 'password'"
								:hint="$t('auth.password')"
								:error-messages="errors.password"
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
						<v-col cols="12" md="12" class="pt-1 pb-0 pl-2 pr-2">
              <v-checkbox dense :ripple="false" hide-details v-model="user.remember">
                <template #label>
                  <small class="grey--text lighten-4">
                    {{ $t('auth.login.remember') }}
                  </small>
                </template>
              </v-checkbox>
						</v-col>
            <v-col cols="12" md="12" class="pt-0 pb-0">
              <div id="captcha"></div>
            </v-col>
					</v-row>
				</v-container>
			</v-card-text>

			<v-card-actions class="pt-2 pl-6 pr-6 pb-2">
				<v-btn color="primary" :loading="loading" :disabled="!valid || !btn_available" tile block @click="verify">
					{{ $t('auth.signin') }}
				</v-btn>
			</v-card-actions>

			<div class="caption grey--text darken-4 pb-1 pl-6 pr-6">
				<v-btn class="text-decoration-underline" color="primary" href="/password/reset" :to="this.$spa ? '/password/reset' : null" small plain>
					{{ $t('auth.login.forgot') }}
				</v-btn>
			</div>

      <div class="text-left pl-5 pr-5 pb-2">
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

    <v-alert v-if="verify_block" dense text type="success" class="mt-4">
			{{ $t('auth.login.verified_text') }}
		</v-alert>

		<v-alert v-if="verify_error" dense text type="error" class="mt-4">
			{{ verify_error }}
		</v-alert>

		<v-alert v-if="errors.captcha.length !== 0" dense text type="error" class="mt-4">
			{{ $t('auth.login.captcha_error') }}
		</v-alert>

		<div class="text-center mt-6" style="position: relative; z-index: 2">
			<div class="caption grey--text darken-4">
				{{ $t('auth.login.noaccount') }}
			</div>

			<v-btn block small text tile href="/register" :to="this.$spa ? '/register' : null" color="primary darken-1">
				{{ $t('auth.login.create') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import formValidationRules from '@/mixins/common/formValidationRules';
import loadingMixin from '@/mixins/common/loadingMixin';
import waves from "@/plugins/hero-canvas";

export default {
	name: 'Login',
	mixins: [formValidationRules, loadingMixin],
	data() {
		return {
			valid: true,
			show: false,
			user: {
				email: '',
				password: '',
				remember: false,
        captcha: window.config.captcha_enabled,
        lot_number: null,
        captcha_output: null,
        pass_token: null,
        gen_time: null
			},
			errors: {
				email: [],
				password: [],
				remember: [],
        captcha: []
			},
      captcha_obj: null,
      captcha_init: false,
			verify_block: window.verified,
			verify_error: window.v_error,
		};
	},
  computed: {
    btn_available() {
      return window.config.captcha_enabled ? (this.captcha_obj !== null) : true;
    }
  },
	created() {
    if (this.user.captcha && !this.$spa)
    {
      this.initCaptcha();
    }
  },
  mounted() {
    waves.ClassicalNoise.prototype.start();
  },
  beforeRouteLeave(to, from, next) {
    waves.ClassicalNoise.prototype.stop();
    next();
  },
  methods: {
    getGeetestLang(lang) {
      switch (lang)
      {
        case 'ar':
          return 'ara';
        case 'de':
          return 'deu';
        case 'en':
          return 'eng';
        case 'es':
          return 'spa';
        case 'fr':
          return 'fra';
        case 'ja':
          return 'jpn';
        case 'ko':
          return 'kor';
        case 'ru':
          return 'rus';
        case 'pt':
          return 'por';
        case 'zh':
          return 'zho';
        default:
          return 'eng';
      }
    },
		initCaptcha: function() {
      let self = this;
      let handler;
      if(window.config.captcha_type.toUpperCase() === 'GEETEST')
      {
        handler = function (captcha_obj) {
          captcha_obj.onReady(function () {
            self.captcha_obj=captcha_obj
          }).onSuccess(function() {
            self.captcha_obj=captcha_obj;
            let result = captcha_obj.getValidate();

            self.user.lot_number = result.lot_number;
            self.user.captcha_output = result.captcha_output;
            self.user.pass_token = result.pass_token;
            self.user.gen_time = result.gen_time;
            self.login()
          }).onError(function () {
            captcha_obj.reset();
          })
        };
      }
      if(window.config.captcha_type.toUpperCase() === 'GEETEST')
      {
        axios.get('/captcha?captcha_type=geetest&t='+(new Date()).getTime()).then( res => {
          initGeetest4({
            captchaId: res.data.captcha_id,
            product: res.data.product,
            language: this.getGeetestLang(self.$i18n.locale),
            protocol: window.location.protocol+'//'
          }, handler);
        })
      }
      else if(window.config.captcha_type.toUpperCase() === 'CLOUDFLARE')
      {
        axios.get('/captcha?captcha_type=cloudflare&t='+(new Date()).getTime()).then( res => {
          turnstile.render('#captcha', {
            sitekey: res.data.captcha_id,
            language: self.$i18n.locale,
            theme: self.$vuetify.theme.isDark ? 'dark' : 'light',
            callback: function(token) {
              self.captcha_obj = token;
              self.user.captcha_output = token;
            },
          });
        })
      }
		},
		verify() {
      if (this.user.captcha)
      {
        if(window.config.captcha_type.toUpperCase() === 'GEETEST')
          this.captcha_obj.showCaptcha();
        else this.login();
      }
      else this.login();
    },
		login() {
			this.startLoading();
			const form = this.user.remember ? this.user : _.omit(this.user, ['remember']);
			axios.post('/login', form).then(response => {
        if (response.data.auth) {
          if(response.data.intended === '/')
          {
            window.location.href = response.data.intended;
          }
          else {
            if(this.$spa)
              this.$router.push(response.data.intended);
            else
              window.location.href = response.data.intended;
          }
        }
      }).catch(error => {
        if (error.response.status === 422) {
          let errors = error.response.data.errors;
          if (errors) {
            for (let field in errors) {
              if (errors.hasOwnProperty(field)) {
                this.errors[field] = errors[field];
              }
            }
          }
        }
      }).finally(() => {
        this.stopLoading();
      });
		},
	},
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        if(to.name === 'login')
        {
          if (this.captcha_obj === null && window.config.captcha_enabled)
            this.initCaptcha();
        }
      }
    },
  },
};
</script>
