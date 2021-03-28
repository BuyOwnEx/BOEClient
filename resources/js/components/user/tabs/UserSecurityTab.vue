<template>
	<v-card class="user-security-tab">
		<v-card-title>
			{{ $t('user.title.security') }}
		</v-card-title>
		<v-card-text>
			<div>
				<div class="user-security-tab__title">
					{{ $t('user.security.title') }}
				</div>
				<div class="user-security-tab__description">
					<p>{{ $t('user.security.description.line_one') }}</p>
					<p>{{ $t('user.security.description.line_two') }}</p>
					<p>{{ $t('user.security.description.line_three') }}</p>
				</div>
			</div>

			<v-row v-if="userData.twoFA">
				<v-col cols="12" md="3" xl="2">
					<!--					<v-img class="mx-auto" width="150" height="150" alt="QR code" src="/" />-->
					<div
						class="mx-auto"
						style="width: 150px; height: 150px; background: rgb(222, 222, 222);"
					/>
				</v-col>

				<v-col cols="12" md="9" xl="10">
					<div class="user-security-tab__header-wrapper">
						<span class="user-security-tab__header">
							{{ $t('user.security.two_factor_auth') }}
						</span>
						<sup class="user-security-tab__status success--text">
							{{ $t('user.security.status.enabled') }}
						</sup>
					</div>

					<div>{{ $t('user.security.secret_key') }}</div>
					<div>
						<code>
							**********
						</code>
					</div>

					<v-form ref="form" @submit.prevent="disable2FA">
						<v-text-field
							v-model="authCode"
							:placeholder="$t('user.security.auth_code')"
							:rules="[rules.required]"
						/>
						<v-btn type="submit">{{ $t('user.security.disable') }}</v-btn>
					</v-form>
				</v-col>
			</v-row>

			<v-row v-else>
				<v-col cols="12" md="3" xl="2">
					<!--					<v-img class="mx-auto" width="150" height="150" alt="QR code" src="/" />-->
					<div
						class="mx-auto"
						style="width: 150px; height: 150px; background: rgb(222, 222, 222);"
					/>
				</v-col>

				<v-col cols="12" md="9" xl="10">
					<div class="user-security-tab__header-wrapper">
						<span class="user-security-tab__header">
							{{ $t('user.security.two_factor_auth') }}
						</span>
						<sup class="user-security-tab__status error--text">
							{{ $t('user.security.status.disabled') }}
						</sup>
					</div>

					<div>{{ $t('user.security.secret_key') }}</div>
					<div>
						<code>
							**********
						</code>
					</div>

					<v-form ref="form" @submit.prevent="enable2FA">
						<v-text-field
							v-model="authCode"
							:placeholder="$t('user.security.auth_code')"
							:rules="[rules.required]"
							outlined
							dense
						/>
						<v-btn type="submit">{{ $t('user.security.enable') }}</v-btn>
					</v-form>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import formValidationRules from '../../../mixins/common/formValidationRules';

export default {
	name: 'UserSecurityTab',

	mixins: [formValidationRules],

	props: {
		user: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			userData: this.user,
			authCode: '',
		};
	},

	methods: {
		async enable2FA() {
			console.log('enable2FA');
			this.$refs.form.reset();
		},
		async disable2FA() {
			console.log('disable2FA');
			this.$refs.form.reset();
		},
	},

	mounted() {
		window.location.hash = '#security';
	}
};
</script>

<style lang="sass" scoped>
.user-security-tab
	&__title
		font-size: 1rem
		font-weight: 500
		text-transform: uppercase
		padding-bottom: 6px
	&__header-wrapper
		padding-bottom: 4px
	&__header
		font-size: 1.2rem
	&__status
		font-size: 10px
		text-transform: uppercase
	p
		margin-bottom: 5px
		line-height: 18px
	::v-deep.v-input
		padding-top: 12px
		&__slot
			min-height: 30px !important
	.v-form
		width: 25%
		@media screen and (max-width: 1264px)
			width: 50%
		@media screen and (max-width: 960px)
			width: 100%
</style>
