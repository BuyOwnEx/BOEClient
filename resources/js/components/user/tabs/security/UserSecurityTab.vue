<template>
	<v-card class="user-security-tab tab-fill-height">
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

			<div v-if="userData.twoFA" class="user-security-tab__content">
				<div class="user-security-tab__qr-code">
					<div v-html="image" />
				</div>

				<div class="user-security-tab__form">
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
						<v-btn type="submit" :block="isXsBreakpoint" :loading="loading">
							{{ $t('user.security.disable') }}
						</v-btn>
					</v-form>
				</div>
			</div>

			<div v-else class="user-security-tab__content">
				<div class="user-security-tab__qr-code">
					<div v-html="image" />
				</div>

				<div class="user-security-tab__form">
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
						<v-btn type="submit" :block="isXsBreakpoint" :loading="loading">
							{{ $t('user.security.enable') }}
						</v-btn>
					</v-form>
				</div>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import formValidationRules from '../../../../mixins/common/formValidationRules';
import loadingMixin from '../../../../mixins/common/loadingMixin';

export default {
	name: 'UserSecurityTab',

	mixins: [formValidationRules, loadingMixin],

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
			image: '',
		};
	},

	computed: {
		isXsBreakpoint() {
			return this.$vuetify.breakpoint.xs;
		},
	},

	methods: {
		async enable2FA() {
			console.log('enable2FA');
			try {
				this.startLoading();

				// await axios.post()

				this.userData.twoFA = true;
			} catch (e) {
				console.error(e);
			} finally {
				this.stopLoading();
			}
		},
		async disable2FA() {
			console.log('disable2FA');
			try {
				this.startLoading();

				// await axios.post()

				this.userData.twoFA = false;
			} catch (e) {
				console.error(e);
			} finally {
				this.stopLoading();
			}
		},
	},

	created() {
		axios.get('/trader/2fa_generate').then(response => {
			if (_.get(response, 'data.success') === true) {
				this.authCode = response.data.secret;
				this.image = response.data.image;
			}
		});
	},
};
</script>

<style lang="sass" scoped>
.user-security-tab
	&__content
		display: grid
		grid-template-columns: 250px 1fr
		grid-template-areas: 'code form'
		margin-top: 32px
	&__qr-code
		grid-area: code
		height: 200px
	&__form
		grid-area: form

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

	@media screen and (max-width: 600px)
		&__content
			display: flex
			flex-flow: column
		&__qr-code
			display: flex
			justify-content: center
			margin-bottom: 32px
</style>
