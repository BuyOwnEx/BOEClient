<template>
	<div class="user-verification-tab">
		<v-card>
			<v-card-title>User Verification</v-card-title>

			<v-card-text>
				<v-form>
					<v-row>
						<v-col cols="12" md="6">
							<v-text-field
								value="First and two on el street"
								label="Address Line 1"
							/>
							<v-text-field value="" label="Address Line 2" />
							<v-text-field value="1231" label="Zip Code" />
							<v-text-field value="Los Angeles" label="City" />
							<v-text-field value="California" label="State" />
							<v-text-field value="United States" label="Country" />
						</v-col>

						<v-col cols="12" md="6">
							<v-text-field value="+8484548112" label="Phone"></v-text-field>
							<v-menu
								ref="menu"
								v-model="menu"
								:close-on-content-click="false"
								transition="scale-transition"
								offset-y
								min-width="290px"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model="date"
										label="Birthday date"
										readonly
										v-bind="attrs"
										v-on="on"
									/>
								</template>
								<v-date-picker
									ref="picker"
									v-model="date"
									:max="new Date().toISOString().substr(0, 10)"
									min="1950-01-01"
									@change="save"
								/>
							</v-menu>
							<v-text-field value="https://" label="Website"></v-text-field>
							<v-radio-group v-model="gender" label="Gender">
								<v-radio label="Male" value="male" />
								<v-radio label="Female" value="female" />
								<v-radio label="Other" value="other" />
							</v-radio-group>
						</v-col>
					</v-row>

					<div class="d-flex">
						<v-btn>Reset</v-btn>
						<v-spacer />
						<v-btn color="primary">Save</v-btn>
					</div>
				</v-form>
			</v-card-text>
		</v-card>

		<v-card class="mt-4" id="sumsub-websdk-container"></v-card>
	</div>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';

export default {
	name: 'UserVerificationTab',

	data: () => ({
		date: '1990-10-09',
		menu: false,
		gender: 'male',

		SumSubToken: '',
		api: 'https://test-api.sumsub.com',
		flowName: 'scheme',
		email: '',
		phone: null,
		i18n: null,
	}),

	watch: {
		menu(val) {
			val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
		},
	},

	methods: {
		save(date) {
			this.$refs.menu.save(date);
		},

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
							input::placeholder, textarea::placeholder {
								color: (--primary-color) !important;
								// opacity: 0.9 !important;
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
							button:active:not(:disabled):not(.disabled), button:hover:not(:disabled):not(.disabled):not(:active) {
								box-shadow: none;
								transform: none;
							}
							radio:checked ~ .checkmark {
								border: 2px solid var(--v-primary-color) !important;
							}
							.checkmark {
								border: 2px solid var(--v-primary-base);
							}
							.radio-item .checkmark:after {
								background-color: var(--accent-color);
							}
							.show-hide {
								top: 5px !important;
								right: 3px !important;
							}
							.success-icon {
								top: 2px !important;
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

							.content {
								background: none;
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
		window.location.hash = '#verification';
		let self = this;
		let token = await this.newSumSubToken();
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

<style scoped></style>
