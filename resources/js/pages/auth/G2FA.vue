<template>
	<div class="layout-content auth ma-auto">
		<v-card>
			<v-card-title class="justify-center">
				<span class="overline mb-2" style="font-size: 1.25rem !important">
					{{ $t('auth.g2fa.title') }}
				</span>
			</v-card-title>

			<v-card-subtitle>
				<span>{{ $t('auth.g2fa.subtitle') }}</span>
			</v-card-subtitle>

			<v-card-text>
				<v-container class="pt-0 pb-0">
					<v-row>
						<v-col cols="12" md="12" class="pt-0 pb-0">
              <v-otp-input
                  v-model="form.totp"
                  length="6"
                  type="number"
                  :disabled="loading"
                  autofocus
                  :rules="[rules.required]"
                  :error-messages="errors.totp"
                  @input="errors.totp = []"
                  @keydown="validate2FA"
                  @finish="verify"
              ></v-otp-input>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>

			<v-card-actions class="pt-4 pl-6 pr-6 pb-4">
				<v-btn color="primary" :loading="loading" :disabled="!valid" block tile @click="verify">
					{{ $t('auth.g2fa.verify') }}
				</v-btn>
			</v-card-actions>
		</v-card>

		<div class="text-center mt-6" style="position: relative; z-index: 2">
			<div class="caption grey--text darken-4">
				{{ $t('auth.g2fa.problem') }}
			</div>

			<v-btn block small text tile href="/contacts" :to="'/contacts'" color="primary darken-1">
				{{ $t('auth.g2fa.contact') }}
			</v-btn>
		</div>
    <CommonSnackbar />
	</div>
</template>

<script>
import formValidationRules from '@/mixins/common/formValidationRules';
import validateInputMixin from '@/mixins/common/validateInputMixin';
import loadingMixin from '@/mixins/common/loadingMixin';
import waves from '@/plugins/hero-canvas';
import CommonSnackbar from '@/components/common/CommonSnackbar.vue';

export default {
	name: 'G2FA',
  components: {
    CommonSnackbar
  },
	mixins: [formValidationRules, loadingMixin, validateInputMixin],
	data() {
		return {
			valid: true,
			form: {
				totp: '',
			},
			errors: {
				totp: [],
			},
		};
	},
  mounted() {
    waves.ClassicalNoise.prototype.start();
  },
  beforeRouteLeave(to, from, next) {
    waves.ClassicalNoise.prototype.stop();
    next();
  },
	methods: {
		verify() {
			this.startLoading()
			axios.post('/2fa_validate', this.form)
            .then(response => {
                if (response.data.auth)
                {
                  this.$store.commit('app/setAuthUser', { user: response.data.user, vm: this });
                  this.$router.push({ name: response.data.intended});
                }
                else this.$store.commit('snackbars/showSnackbar', { text: response.data.message, success: false });
            })
            .catch(error => {
                if (error.response.status === 422) {
                    let errors = error.response.data.errors;
                    if (errors) {
                        for (let field in errors) {
                          if(field === 'totp')
                            this.$store.commit('snackbar/SHOW_MESSAGE', {
                              text: errors[field][0],
                              color: 'error',
                              timeout: 3000,
                            });
                          if (errors.hasOwnProperty(field)) {
                            this.errors[field] = errors[field];
                          }
                        }
                    }
                }
                else if (error.response.status === 409)
                {
                    this.errors.totp=[error.response.data.message];
                }
                else {
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
