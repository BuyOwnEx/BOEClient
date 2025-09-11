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
            <v-col cols="12" md="12" class="pt-2 pb-0">
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
				<v-btn class="text-decoration-underline" color="primary" href="/password/reset" :to="'/password/reset'" small plain>
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

		<v-alert v-if="errors.captcha_output.length !== 0" dense text type="error" class="mt-4">
			{{ $t('auth.login.captcha_error') }}
		</v-alert>

		<div class="text-center mt-6" style="position: relative; z-index: 2">
			<div class="caption grey--text darken-4">
				{{ $t('auth.login.noaccount') }}
			</div>

			<v-btn block small text tile href="/register" :to="'/register'" color="primary darken-1">
				{{ $t('auth.login.create') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import formValidationRules from '@/mixins/common/formValidationRules';
import loadingMixin from '@/mixins/common/loadingMixin';
import waves from "@/plugins/hero-canvas";
import { mapState } from 'vuex';

export default {
	name: 'Login',
  props: {
    isCaptchaEnabled: {
      type: Boolean,
      required: true,
    },
    captchaType: {
      type: String,
      required: false
    },
  },
  head: {
    script: function () {
      return this.isCaptchaEnabled ?
          (this.captchaType.toUpperCase() === 'CLOUDFLARE' ? [{src:'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=_turnstileCb' }] :
              this.captchaType.toUpperCase() === 'YANDEX' ? [{src:'https://smartcaptcha.yandexcloud.net/captcha.js?render=onload&onload=_yandexCb' }] :
              [{src: 'https://static.geetest.com/v4/gt4.js'}]) : []
    },
  },
	mixins: [formValidationRules, loadingMixin],
	data() {
		return {
			valid: true,
			show: false,
			user: {
				email: '',
				password: '',
				remember: false,
        lot_number: null,
        captcha_output: null,
        pass_token: null,
        gen_time: null
			},
			errors: {
				email: [],
				password: [],
				remember: [],
        captcha_output: []
			},
      captcha_obj: null,
      captcha_init: false,
			verify_block: window.verified,
			verify_error: window.flash,
      widgetId: null,
		};
	},
  computed: {
    ...mapState('app', ['product']),
    btn_available() {
      return this.product.captcha_enabled ? (this.captcha_obj !== null) : true;
    },
    theme() {
      return this.$vuetify.theme.isDark ? 'dark' : 'light'
    },
    captcha_id() {
      return this.product.captcha_id
    }
  },
  mounted() {
    waves.ClassicalNoise.prototype.start();
    if(this.isCaptchaEnabled && this.product.captcha_type.toUpperCase() === 'CLOUDFLARE')
    {
      let self = this;
      window._turnstileCb = function() {
        self.widgetId = window.turnstile.render('#captcha', {
          sitekey: import.meta.env.VITE_CAPTCHA_ID,
          language: self.$i18n.locale,
          theme: self.$vuetify.theme.isDark ? 'dark' : 'light',
          callback: function(token) {
            self.captcha_obj = token;
            self.user.captcha_output = token;
          },
        });
      }
    }
    else if(this.isCaptchaEnabled && this.product.captcha_type.toUpperCase() === 'YANDEX')
    {
      let self = this;
      window._yandexCb = function() {
        self.widgetId = window.smartCaptcha.render('captcha', {
          sitekey: import.meta.env.VITE_CAPTCHA_ID,
          hl: self.$i18n.locale,
          theme: self.$vuetify.theme.isDark ? 'dark' : 'light',
          callback: function(token) {
            self.captcha_obj = token;
            self.user.captcha_output = token;
          },
        });
      }
    }
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
		initCaptcha() {
      let self = this;
      let handler;
      if(this.product.captcha_type.toUpperCase() === 'GEETEST')
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
      if(this.product.captcha_type.toUpperCase() === 'GEETEST')
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
		},
		verify() {
      if (this.product.captcha_enabled)
      {
        if(this.product.captcha_type.toUpperCase() === 'GEETEST')
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
          this.$store.commit('app/setAuthUser', { user: response.data.user, vm: this });
        }
        if(response.data.intended === 'verify')
          this.$router.push({ name: response.data.intended, params: { email: response.data.email } });
        else
          this.$router.push({ path: '/'+response.data.intended});
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
        if(this.product.captcha_enabled && this.product.captcha_type.toUpperCase() === 'CLOUDFLARE')
          window.turnstile.reset(this.widgetId);
        else if(this.product.captcha_enabled && this.product.captcha_type.toUpperCase() === 'YANDEX')
          window.smartCaptcha.reset(this.widgetId);
      });
		},
	},
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        if(to.name === 'login')
        {
          if (this.captcha_obj === null && this.product.captcha_enabled && this.product.captcha_type.toUpperCase() === 'GEETEST')
            this.initCaptcha();
        }
      }
    },
  },
};
</script>
