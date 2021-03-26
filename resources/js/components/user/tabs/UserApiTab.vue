<template>
	<div class='user-api-tab'>
		<v-card>
			<v-card-title>user api tab</v-card-title>
			<v-card-text id="sumsub-websdk-container"></v-card-text>
		</v-card>
	</div>
</template>

<script>
import snsWebSdk from '@sumsub/websdk'

export default {
	name: 'UserApiTab',
	data() {
		return {
			accessToken: '',
			api: 'https://test-api.sumsub.com',
			flowName: 'scheme',
			email: '',
			phone: null,
			i18n: null
		};
	},
	methods: {
		newAccessToken: async function() {
			let token = await axios.get('/trader/ext/sumsub_token');
			this.accessToken = token.data.token;
			return token.data.token;
		},
		launchWebSdk(apiUrl, flowName, accessToken, applicantEmail, applicantPhone, customI18nMessages) {
			let snsWebSdkInstance = snsWebSdk.Builder(apiUrl, flowName)
				.withAccessToken(accessToken, (newAccessTokenCallback) => {
						// Access token expired
						// get a new one and pass it to the callback to re-initiate the WebSDK
						let newAccessToken = this.newAccessToken(); // get a new token from your backend
						newAccessTokenCallback(newAccessToken)
					}
				)
				.withConf({
					lang: 'en',
					email: applicantEmail,
					phone: applicantPhone,
					i18n: customI18nMessages,
					onMessage: (type, payload) => {
						// see below what kind of messages the WebSDK generates
						console.log('WebSDK onMessage', type, payload)
					},
					uiConf: {
						//customCss: "https://buyownex.com/css/sumsub.css"
						customCssStr: ".content{margin:0 !important;}p{color:yellow !important;}"
						// URL to css file in case you need change it dynamically from the code
						// the similar setting at Applicant flow will rewrite customCss
						// you may also use to pass string with plain styles `customCssStr:`
					},
					onError: (error) => {
						console.error('WebSDK onError', error)
					},
			}).build();
			// you are ready to go:
			// just launch the WebSDK by providing the container element for it
			snsWebSdkInstance.launch('#sumsub-websdk-container')
		},
	},
	async mounted() {
		let self = this;
		let token = await this.newAccessToken();
		this.launchWebSdk(self.api, self.flowName, token, self.email, self.phone, self.i18n)
	},
};
</script>

<style scoped>

</style>