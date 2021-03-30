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

			<!--if 2fa enabled-->
			<div v-if="userData.g2fa" class="user-security-tab__content">
				<div class="user-security-tab__qr-code">
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

					<v-form ref="form" @submit.prevent="disable2FA">
						<v-text-field
							v-model="authCode"
							type="number"
							:placeholder="$t('user.security.auth_code')"
							@keydown="handleCodeInput"
						/>
						<v-btn
							type="submit"
							:block="isXsBreakpoint"
							:loading="loading"
							color="error"
							small
							tile
						>
							{{ $t('user.security.disable') }}
						</v-btn>
					</v-form>
				</div>
			</div>

			<!--if 2fa disabled-->
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
							{{ authCode }}
						</code>
					</div>

					<v-form ref="form" @submit.prevent="enable2FA">
						<v-text-field
							v-model="totp"
							type="number"
							:placeholder="$t('user.security.auth_code')"
							:disabled="loading"
							dense
							@keydown="handleCodeInput"
						/>
						<v-btn
							type="submit"
							:block="isXsBreakpoint"
							:loading="loading"
							color="success"
							small
							tile
						>
							{{ $t('user.security.enable') }}
						</v-btn>
					</v-form>
				</div>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import loadingMixin from '../../../../mixins/common/loadingMixin';

export default {
	name: 'UserSecurityTab',

	mixins: [loadingMixin],

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
			totp: null,
		};
	},

	computed: {
		isXsBreakpoint() {
			return this.$vuetify.breakpoint.xs;
		},
	},

	methods: {
		async enable2FA() {
			try {
				if (this.totp.trim() === '') return;
				this.startLoading();

				await axios.post('/trader/2fa_enable', {
					secret: this.authCode,
					totp: this.totp,
				});

				this.userData.twoFA = true;
				this.totp = '';
			} catch (e) {
				console.error(e);
			} finally {
				this.stopLoading();
			}
		},
		async disable2FA() {
			try {
				if (this.totp.trim() === '') return;
				this.startLoading();

				await axios.post('/trader/2fa_disable', {
					totp: this.totp,
				});

				this.userData.twoFA = false;
				this.totp = '';
			} catch (e) {
				console.error(e);
			} finally {
				this.stopLoading();
			}
		},

		handleCodeInput(event) {
			const keyCode = event.keyCode ? event.keyCode : event.which;

			console.log(event.target.value.length);

			const isNumber =
				(keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105);
			const isFuncKey = keyCode === 8 || keyCode === 46 || keyCode === 13;
			const isLengthMoreThan6 = event.target.value.length > 6;

			if (isFuncKey) return;
			if (!isNumber || isLengthMoreThan6) event.preventDefault();
			if (event.target.value.length === 6) {
				this.enable2FA();
			}
		},
	},

	created() {
		if (!this.userData.g2fa) {
			axios.get('/trader/2fa_generate').then(response => {
				if (_.get(response, 'data.success') === true) {
					this.authCode = response.data.secret;
					this.image = response.data.image;
				}
			});
		}
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
