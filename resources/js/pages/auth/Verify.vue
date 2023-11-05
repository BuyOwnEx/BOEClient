<template>
	<div class="layout-content auth ma-auto">
		<v-card>
			<v-card-title class="justify-center">
				<span class="overline mb-2" style="font-size: 1.25rem !important">
					{{ $t('auth.verify.title') }}
				</span>
			</v-card-title>

			<v-card-subtitle>
				<span>{{ $t('auth.verify.subtitle') }}</span>
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
				<small>{{ $t('auth.verify.no_letter') }}</small>
			</div>

			<v-card-actions class="pt-4 pl-6 pr-6 pb-4">
				<v-btn color="primary" :loading="loading" :disabled="!valid" block tile @click="resend">
					{{ $t('common.resend') }}
				</v-btn>
			</v-card-actions>
		</v-card>

		<v-alert v-if="resend_alert" dense text type="warning" class="mt-4">
			{{ $t('auth.verify.resend_activation_link_text') }}
		</v-alert>

		<div class="text-center mt-6" style="position: relative; z-index: 2">
			<div class="caption grey--text darken-4">
				{{ $t('auth.verify.already_activated') }}
			</div>

			<v-btn block small text tile href="/login" :to="this.$spa ? '/login' : null" color="primary darken-1">
				{{ $t('auth.signin') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import formValidationRules from '@/mixins/common/formValidationRules';
import loadingMixin from '@/mixins/common/loadingMixin';

export default {
	name: 'Verify',
	mixins: [formValidationRules, loadingMixin],
	data() {
		return {
			valid: true,
			loading: false,
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
			this.startLoading();
			axios.post('/email/resend', this.user)
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
