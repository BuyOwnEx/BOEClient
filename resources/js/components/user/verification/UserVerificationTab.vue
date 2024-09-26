<template>
	<v-card class="user-verification-tab tab-fill-height">
		<v-card-title>{{ $t('user.title.verification') }}</v-card-title>

		<div id="sumsub" class="fill-height" />
	</v-card>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';

export default {
	name: 'UserVerificationTab',

	data: () => ({
		SumSubToken: '',
		api: 'https://api.sumsub.com',

		email: null,
		phone: null,

		customCss: `
							:root {
								--v-primary-base: #03a4c2;
								--primary-color: #9395a9;
								--accent-color: #2fc3dfd9;
								--success-color: #06d6a0;
								--red-color: #ef476f;
							}

							input, select, textarea {
								background: none;
								border-bottom: 2px solid #7a7a7a2e !important;
							}
							.phone-input {
								border-bottom: 2px solid #7a7a7a2e !important;
							}
							input:focus, select:focus, textarea:focus {
								border-bottom-color: var(--primary-color);
								outline: none;
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
							::-webkit-calendar-picker-indicator {
								color: rgba(0, 0, 0, 0);
								opacity: 1;
								background-image: url('data:image/svg+xml;charset=utf8,%3Csvg fill="%23000" fill-opacity=".54" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/%3E%3Cpath d="M0 0h24v24H0z" fill="none"/%3E%3C/svg%3E');
								cursor: pointer;
								margin-right: -8px;
							}
							select	{
								appearance: none;
							}
							.line-form-item span {
								color: #7a7a7aab;
							}
							.welcome-input.phone-input {
								background: transparent !important;
								border: 1px solid #8888883b !important;
							}
							.row .welcome-input.phone-input > input {
								background-color: transparent !important;
								color: #9395a9 !important;
							}
							.welcome-input.phone-input .fa-icon {
								fill: #9395a9;
							}
							.calling-code {
								color: #9395a9 !important;
							}
							.list {
								background: #f9f9f9 !important;
								border: none !important;
								padding: 16px 0;
								box-shadow: 0px 5px 30px -3px rgb(85 85 85 / 8%), 0px 8px 30px 1px rgb(85 85 85 / 6%), 0px 3px 30px 2px rgb(85 85 85 / 3%);
							}
							.list li {
								padding: 8px 12px !important;
							}
							.fields-list .phone {
								border: none !important;
							}
							input[type="date"] {
								font-family: Arial;
   							opacity: 0.6;
							}
							.select-placeholder {
								color: var(--primary-color) !important;
								opacity: 0.6 !important;
							}
							.input-field:nth-child(10) .select-placeholder {
								display: none;
							}

							.show-hide {
								top: 5px !important;
								right: 3px !important;
							}
							.fields-list .success-icon {
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
							button.submit, button.continue {
								border-radius: 5px;
								border: none !important;
								background: var(--v-primary-base) !important;
								color: white;
							}
							button.submit:hover, button.continue:hover {
								background: #0baecc !important;
							}
							button.submit:active, button.continue:active {
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
  						  padding-top: 0 !important;
							}
							.transparent.desktop {
								display: none;
							}
							.iframe2 {
								margin: 0;
							}.
							.row {
								margin-top: 0 !important;
							}
							`,
		customCssDark: `
							:root {
								--v-primary-base: #03a4c2;
								--primary-color: #9395a9;
								--accent-color: #2fc3dfd9;
								--success-color: #06d6a0;
								--red-color: #ef476f;
							}

							input, select, textarea {
								background: none;
								border-bottom: 2px solid #7a7a7a2e !important;
							}
							.phone-input {
								border-bottom: 2px solid #7a7a7a2e !important;
							}
							input:focus, select:focus, textarea:focus {
								border-bottom-color: var(--primary-color);
								outline: none;
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
							::-webkit-calendar-picker-indicator {
								color: gray;
								opacity: 1;
								background-image: url('data:image/svg+xml;charset=utf8,%3Csvg fill="lightgray" fill-opacity="1" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/%3E%3Cpath d="M0 0h24v24H0z" fill="none"/%3E%3C/svg%3E');
								cursor: pointer;
								margin-right: -8px;
							}
							select	{
								appearance: none;
								background-color: #1e1e1e;
							}
							select:-moz-focusring {
								outline: none;
								border: none;
							}
							select:focus {
								outline: none;
								border: none;
							}
							.line-form-item span {
								color: #7a7a7aab;
							}
							.welcome-input.phone-input {
								background: transparent !important;
								border: 1px solid #8888883b !important;
							}
							.row .welcome-input.phone-input > input {
								background-color: transparent !important;
								color: #9395a9 !important;
							}
							.welcome-input.phone-input .fa-icon {
								fill: #9395a9;
							}
							.calling-code {
								color: #9395a9 !important;
							}
							.list {
								background: #1e1e1e !important;
								padding: 16px 0;
								box-shadow: 0 0 3px 0 rgb(85 85 85 / 8%), 0 0 3px 0 rgb(85 85 85 / 6%), 0 0 3px 0 rgb(85 85 85 / 3%) !important;
    						border: 1px solid #4b4b4b3b !important;
							}
							.list li {
								padding: 8px 12px !important;
							}
							.list li:hover {
								background: #383838 !important;
							}
							.fields-list .phone {
								border: none !important;
							}
							input[type="date"] {
								font-family: Arial;
   							opacity: 0.6;
							}
							.select-placeholder {
								color: var(--primary-color) !important;
								opacity: 0.6 !important;
							}
							.input-field:nth-child(10) .select-placeholder {
								display: none;
							}

							.show-hide {
								top: 5px !important;
								right: 3px !important;
							}
							.fields-list .success-icon {
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
							button.submit, button.continue {
								border-radius: 5px;
								border: none !important;
								background: var(--v-primary-base) !important;
								color: white;
							}
							button.submit:hover, button.continue:hover {
								background: #0baecc !important;
							}
							button.submit:active, button.continue:active {
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
  						  padding-top: 0 !important;
							}
							.transparent.desktop {
								display: none;
							}
							.iframe2 {
								margin: 0;
							}
							.row {
								margin-top: 0 !important;
							}
							`,
	}),

	computed: {
		userLang() {
			return this.$store.state.app.trader.language;
		},
	},

	methods: {
		async newSumSubToken() {
			const token = await axios.get('/trader/ext/sumsub_token');
			this.SumSubToken = token.data.token;
			return token.data.token;
		},
		launchWebSdk(accessToken, applicantEmail, applicantPhone) {
      let snsWebSdkInstance = snsWebSdk
          .init(accessToken, () => this.newSumSubToken())
          .withConf({
            lang: this.userLang,
            email: applicantEmail,
            phone: applicantPhone,
            theme: this.$vuetify.theme.dark ? 'dark' : 'light',
          })
          .withOptions({ addViewportTag: false, adaptIframeHeight: true })
          // see below what kind of messages WebSDK generates
          .on("idCheck.onStepCompleted", (payload) => {
            console.log("onStepCompleted", payload);
          })
          .on("idCheck.onError", (error) => {
            console.log("onError", error);
          })
				  .build();
			snsWebSdkInstance.launch('#sumsub');
		},

		getDarkStyles() {
			this.customCss = this.customCssDark;
		},
	},

	async mounted() {
		if (this.$vuetify.theme.dark) this.getDarkStyles();
		const token = await this.newSumSubToken();
		this.launchWebSdk(token, this.email, this.phone);
	},
};
</script>
