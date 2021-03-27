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
