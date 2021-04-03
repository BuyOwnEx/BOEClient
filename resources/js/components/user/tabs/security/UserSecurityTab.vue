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
							:rules="[rules.numbers, rules.counter]"
							counter
							maxlength="6"
							dense
							@input="handleCodeInputDisable"
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
							:rules="[rules.numbers, rules.counter]"
							counter
							maxlength="6"
							dense
							@input="handleCodeInputEnable"
						/>
						<v-btn
							type="submit"
							:block="isXsBreakpoint"
							:loading="loading"
							color="success"
							small
							tile
							:disabled="!valid"
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
			rules: {
				counter: value => value.length <= 6 || 'Max 6 numbers',
				numbers: value =>
					/^\d{0,6}$/i.test(value) ||
					'Unsupported characters. Must be only digits',
			},
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

	methods: {
		enable2FA() {
			try {
				this.startLoading();
				let self = this;
				axios
					.post('/trader/2fa_enable', {
						secret: this.secret,
						totp: this.totp,
					})
					.then(response => {
						if (_.get(response, 'data.success') === true) {
							this.$store.commit('app/setUser2FA', true);
							this.totp = '';
							this.get2FAStatus();
						} else {
							this.$store.commit('snackbar/addNotification', {
								text: self.$t('error.occurred'),
							});
						}
					});
			} finally {
				this.stopLoading();
			}
		},
		disable2FA() {
			try {
				this.startLoading();
				let self = this;
				axios
					.post('/trader/2fa_disable', {
						totp: this.totp,
					})
					.then(response => {
						if (_.get(response, 'data.success') === true) {
							this.$store.commit('app/setUser2FA', false);
							this.totp = '';
							this.get2FAStatus();
						} else {
							this.$store.commit('snackbar/addNotification', {
								text: self.$t('error.occurred'),
							});
						}
					});
			} finally {
				this.stopLoading();
			}
		},
		get2FAStatus() {
			axios.get('/trader/2fa_generate').then(response => {
				if (_.get(response, 'data.success') === true) {
					if (
						!this.g2faStatus &&
						_.get(response, 'data.secret') &&
						_.get(response, 'data.image')
					) {
						this.secret = response.data.secret;
						this.image = response.data.image;
					}
				} else {
					this.$store.commit('snackbar/addNotification', {
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
	created() {
		this.get2FAStatus();
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
