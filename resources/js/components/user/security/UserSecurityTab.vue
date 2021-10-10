<template>
	<v-card class="user-security-tab tab-fill-height">
		<v-card-title>
			{{ $t('user.title.security') }}
		</v-card-title>

		<CommonLoading v-if="isPageLoading" page-margin />
		<v-card-text v-else>
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

			<!--if 2fa enabled-->
			<div v-if="g2faStatus" class="user-security-tab__content">
				<div class="user-security-tab__qr-code-wrapper">
					{{ $t('user.security.for_disable') }}
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

					<v-form @submit.prevent="disable2FA">
						<v-text-field
							v-model="totp"
							:placeholder="$t('user.security.auth_code')"
							:disabled="loading"
							maxlength="6"
							counter
							dense
							@input="handleCodeInputDisable"
							@keydown="validate2FA"
							@paste.prevent
						/>
						<v-btn type="submit" :block="isXsBreakpoint" :loading="loading" color="error" small tile>
							{{ $t('user.security.disable') }}
						</v-btn>
					</v-form>
				</div>
			</div>

			<!--if 2fa disabled-->
			<div v-else class="user-security-tab__content">
				<div class="user-security-tab__qr-code-wrapper">
					<div class="user-security-tab__qr-code" v-html="image" />
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
							{{ secret }}
						</code>
					</div>

					<v-form @submit.prevent="enable2FA">
						<v-text-field
							v-model="totp"
							:placeholder="$t('user.security.auth_code')"
							:disabled="loading"
							maxlength="6"
							counter
							dense
							@input="handleCodeInputEnable"
							@keydown="validate2FA"
							@paste.prevent
						/>
						<v-btn type="submit" :block="isXsBreakpoint" :loading="loading" color="success" small tile>
							{{ $t('user.security.enable') }}
						</v-btn>
					</v-form>
				</div>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import CommonLoading from '../../common/CommonLoading';

import loadingMixin from '../../../mixins/common/loadingMixin';
import showNotificationMixin from '../../../mixins/common/showNotificationMixin';
import validateInputMixin from '../../../mixins/common/validateInputMixin';

export default {
	name: 'UserSecurityTab',

	components: {
		CommonLoading,
	},

	mixins: [loadingMixin, showNotificationMixin, validateInputMixin],

	props: {
		g2fa: {
			type: Boolean,
			required: true,
		},
	},

	data() {
		return {
			secret: null,
			image: null,
			totp: '',
			isPageLoading: true,
		};
	},

	computed: {
		isXsBreakpoint() {
			return this.$vuetify.breakpoint.xs;
		},
		g2faStatus() {
			return this.g2fa;
		},
	},

	async created() {
		await this.get2FAStatus();
		this.isPageLoading = false;
	},

	methods: {
		enable2FA() {
			if (!this.totp.trim() || this.totp.length < 6) {
				this.pushErrorNotification(_, 'incorrect');
				return;
			}

			try {
				this.startLoading();
				axios
					.post('/trader/2fa_enable', {
						secret: this.secret,
						totp: this.totp,
					})
					.then(response => {
						this.$store.commit('app/setUser2FA', true);
						this.totp = '';
						this.get2FAStatus();
					});
			} finally {
				this.stopLoading();
			}
		},
		disable2FA() {
			if (!this.totp.trim() || this.totp.length < 6) {
				this.pushErrorNotification(_, 'incorrect');
				return;
			}

			try {
				this.startLoading();
				axios
					.post('/trader/2fa_disable', {
						totp: this.totp,
					})
					.then(response => {
						this.$store.commit('app/setUser2FA', false);
						this.totp = '';
						this.get2FAStatus();
					});
			} finally {
				this.stopLoading();
			}
		},
		get2FAStatus() {
			axios.get('/trader/2fa_generate').then(response => {
				if (_.get(response, 'data.success') === true) {
					if (!this.g2faStatus && _.get(response, 'data.secret') && _.get(response, 'data.image')) {
						this.secret = response.data.secret;
						this.image = response.data.image;
					}
				} else {
					this.$store.commit('snackbar/SHOW_MESSAGE', {
						text: _.get(response, 'data.message'),
					});
				}
			});
		},

		handleCodeInputEnable(data) {
			if (data.length === 6) {
				this.enable2FA();
			}
		},
		handleCodeInputDisable(data) {
			if (data.length === 6) {
				this.disable2FA();
			}
		},
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
	&__qr-code-wrapper
		grid-area: code
	&__qr-code
		height: 200px
		width: 200px
		background-color: white
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
		padding-top: 0
		margin-top: 0
		margin-bottom: 12px
		&__slot
			min-height: 30px !important
	.v-form
		width: 25%
		@media screen and (max-width: 1263px)
			width: 50%
		@media screen and (max-width: 959px)
			width: 100%

	@media screen and (max-width: 599px)
		&__content
			display: flex
			flex-flow: column
		&__qr-code-wrapper
			display: flex
			justify-content: center
			margin-bottom: 32px
</style>
