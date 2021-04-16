<template>
	<v-card class="user-verification-tab tab-fill-height">
		<v-card-title>{{ $t('user.title.verification') }}</v-card-title>

		<div id="sumsub" />
	</v-card>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';

export default {
	name: 'UserVerificationTab',

	data: () => ({
		SumSubToken: '',
		api: 'https://test-api.sumsub.com',
		flowName: 'scheme',

		email: '',
		phone: null,
		i18n: null,

		customCssLink: 'https://buyownex.com/css/sumsub.css',
		customCssDarkLink: 'https://buyownex.com/css/sumsubDark.css',
	}),

	methods: {
		async newSumSubToken() {
			const token = await axios.get('/trader/ext/sumsub_token');
			this.SumSubToken = token.data.token;
			return token.data.token;
		},

		launchWebSdk(
			apiUrl,
			flowName,
			accessToken,
			applicantEmail,
			applicantPhone,
			customI18nMessages
		) {
			const snsWebSdkInstance = snsWebSdk
				.Builder(apiUrl, flowName)
				.withAccessToken(accessToken, newSumSubTokenCallback => {
					let newSumSubToken = this.newSumSubToken();
					newSumSubTokenCallback(newSumSubToken);
				})
				.withConf({
					lang: 'en',
					email: applicantEmail,
					phone: applicantPhone,
					i18n: customI18nMessages,
					onMessage: (type, payload) => {
						console.log('WebSDK onMessage', type, payload);
					},
					onError: error => {
						console.error('WebSDK onError', error);
					},
					uiConf: {
						customCss: this.customCssLink,
					},
				})
				.build();
			snsWebSdkInstance.launch('#sumsub');
		},

		getDarkStyles() {
			this.customCssLink = this.customCssDarkLink;
		},
	},

	async created() {
		if (this.$vuetify.theme.dark) this.getDarkStyles();

		const token = await this.newSumSubToken();
		this.launchWebSdk(
			this.api,
			this.flowName,
			token,
			this.email,
			this.phone,
			this.i18n
		);
	},
};
</script>
