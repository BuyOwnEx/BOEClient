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
	}),

	methods: {
		newSumSubToken: async function() {
			let token = await axios.get('/trader/ext/sumsub_token');
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
			let snsWebSdkInstance = snsWebSdk
				.Builder(apiUrl, flowName)
				.withAccessToken(accessToken, newSumSubTokenCallback => {
					// Access token expired
					// get a new one and pass it to the callback to re-initiate the WebSDK
					let newSumSubToken = this.newSumSubToken(); // get a new token from your backend
					newSumSubTokenCallback(newSumSubToken);
				})
				.withConf({
					lang: 'en',
					email: applicantEmail,
					phone: applicantPhone,
					i18n: customI18nMessages,
					onMessage: (type, payload) => {
						// see below what kind of messages the WebSDK generates
						console.log('WebSDK onMessage', type, payload);
					},
					uiConf: {
						//customCss: "https://buyownex.com/css/sumsub.css"
						customCssStr: `
							:root {
								--v-primary-base: #03a4c2;
								--primary-color: #9395a9;
								--accent-color: #2fc3dfd9;
								--success-color: #06d6a0;
								--red-color: #ef476f;
							}

							input, select, textarea {
								background: none;
								border-bottom: 1px solid #7a7a7aab !important;
							}
							input:focus, select:focus, textarea:focus {
								border-bottom-color: var(--primary-color);
							}
							::placeholder {
								color: var(--primary-color) !important;
								opacity: 0.6 !important;
							}
							.input-field span, .radio-group span {
								font-size: 11px;
							}
							.input-field path {
								fill: #9395a9;
							}
							.input-field .success-icon path {
								fill: var(--success-color);
							}
							.phone-input .phone {
								box-shadow: none !important;
							}
							input[type="radio"]:checked ~ .checkmark {
								border: 2px solid var(--v-primary-base) !important;
							}
							.checkmark {
								border: 2px solid var(--v-primary-base);
							}
							.radio-item .checkmark:after {
								background-color: var(--v-primary-base);
							}

							.show-hide {
								top: 5px !important;
								right: 3px !important;
							}
							.success-icon {
								top: -2px !important;
								right: 0 !important;
							}
							.step.active .bullet {
								box-shadow: 0 4px 16px 0 #e7e7e72e;
							}

							button {
								height: 35px !important;
    						padding: 0 15px !important;
							}
							button.back {
								border-radius: 5px;
   							background: none;
							}
							button.back:hover {
								background: #88888814;
							}
							button.back:active {
								background: #88888836;
							}
							button.back .arrow {
								display: none;
							}
							button.submit {
								border-radius: 5px;
								border: none !important;
								background: var(--v-primary-base) !important;
							}
							button.submit:hover {
								background: #0baecc !important;
							}
							button.submit:active {
								background: #11b6d4 !important;
							}
							button.submit .arrow {
								margin-left: 4px;
							}
							button:active:not(:disabled):not(.disabled), button:hover:not(:disabled):not(.disabled):not(:active) {
								box-shadow: none;
								transform: none;
							}

							.upload-item {
								background-color: #8a8a8a08 !important;
								box-shadow: 0px 5px 9px 0px #61677a2b !important;
   							border: 1px solid #e3e3e314 !important;
							}
							.drag-drop {
								background-color: transparent !important
							}
							.mobile-button {
								background-color: #8a8a8a08 !important;
								box-shadow: 0px 5px 9px 0px #61677a2b !important;
   							border: 1px solid #e3e3e314 !important;
							}

							.content {
								background: none;
								margin: 0;
  						  min-width: 100vw;
  						  padding: 16px !important;
  						  border-radius: 0;
  						  box-shadow: none;
							}
							.transparent.desktop {
								display: none;
							}
							.iframe2 {
								margin: 0;
							}
							`,
					},
					onError: error => {
						console.error('WebSDK onError', error);
					},
				})
				.build();
			snsWebSdkInstance.launch('#sumsub');
		},
	},

	async created() {
		let token = await this.newSumSubToken();
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

<style scoped></style>
