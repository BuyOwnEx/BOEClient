<template>
	<div class="user-api-tab">
		<UserApiCreate @created="addApiToLocalApiData" />
		<UserApiList :api="apiData" />

		<div id="sumsub-websdk-container"></div>
	</div>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';

import UserApiCreate from './parts/UserApiCreate';
import UserApiList from './parts/UserApiList';

export default {
	name: 'UserApiTab',

	components: {
		UserApiCreate,
		UserApiList,
	},

	data() {
		return {
			apiData: [
				{
					id: 1,
					name: 'apiname',
					public: 'f23f23fdf',
					secret: 'g34g34gasd',
					abilities: ['trading'],
					created_at: '2021-03-26T09:37:07.005Z',
					updated_at: '2021-03-26T09:37:07.005Z',
					last_used_at: '2021-03-26T09:37:07.005Z',
				},
				{
					id: 2,
					name: 'apiname',
					public: 'f23f23fdf',
					secret: 'g34g34gasd',
					abilities: ['withdraw'],
					created_at: '2021-03-26T09:37:07.005Z',
					updated_at: '2021-03-26T09:37:07.005Z',
					last_used_at: '2021-03-26T09:37:07.005Z',
				},
				{
					id: 3,
					name: 'apiname',
					public: 'f23f23fdf',
					secret: 'g34g34gasd',
					abilities: ['trading', 'withdraw'],
					created_at: '2021-03-26T09:37:07.005Z',
					updated_at: '2021-03-26T09:37:07.005Z',
					last_used_at: '2021-03-26T09:37:07.005Z',
				},
			],

			accessToken: '',
			api: 'https://test-api.sumsub.com',
			flowName: 'scheme',
			email: '',
			phone: null,
			i18n: null,
		};
	},
	methods: {
		addApiToLocalApiData(newAPI) {
			this.apiData.push(newAPI);
		},

		newAccessToken: async function() {
			let token = await axios.get('/trader/ext/sumsub_token');
			this.accessToken = token.data.token;
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
				.withAccessToken(accessToken, newAccessTokenCallback => {
					// Access token expired
					// get a new one and pass it to the callback to re-initiate the WebSDK
					let newAccessToken = this.newAccessToken(); // get a new token from your backend
					newAccessTokenCallback(newAccessToken);
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
								--success-color: #06d6a0;
								--red-color: #ef476f;
							}

							input, select, textarea {
								color: #404254;
								background: none
							}

							.input-field span, .radio-group span {
								font-size: 11px;
							}
							.phone-input .phone {
								box-shadow: none !important;
							}
							.content {
								background: none;
							}
							.input-field span, .radio-group span {
								color: #404254;
							}
							`,
						// URL to css file in case you need change it dynamically from the code
						// the similar setting at Applicant flow will rewrite customCss
						// you may also use to pass string with plain styles `customCssStr:`
					},
					onError: error => {
						console.error('WebSDK onError', error);
					},
				})
				.build();
			// you are ready to go:
			// just launch the WebSDK by providing the container element for it
			snsWebSdkInstance.launch('#sumsub-websdk-container');
		},
	},
	async mounted() {
		let self = this;
		let token = await this.newAccessToken();
		this.launchWebSdk(
			self.api,
			self.flowName,
			token,
			self.email,
			self.phone,
			self.i18n
		);
	},
};
</script>

<style lang="sass" scoped>
.user-api-tab
	> ::v-deep.v-card
		margin-bottom: 5px
		&:last-child
			margin-bottom: 0
</style>
