<template>
	<v-card class="user-account-tab-basic-info">
		<v-card-title>{{ $t('user.title.basic_info') }}</v-card-title>

		<v-card-text>
			<div class="d-flex flex-column flex-sm-row">
				<div>
					<span>
						<v-avatar
							class="user-account-tab-basic-info__avatar rounded"
							size="90"
							v-html="generatedAvatar"
						/>
					</span>
				</div>

				<div class="flex-grow-1 pt-2 pt-sm-0 px-sm-2">
					<v-text-field
						class="mb-2"
						v-model="user.name"
						label="Display name"
						hide-details
						readonly
					/>
					<v-text-field
						class="mb-2"
						v-model="user.email"
						label="Email"
						hide-details
						readonly
					/>
					<v-text-field
							class="mb-2"
							v-model="user.rate_limit"
							label="Rate API limit"
							hide-details
							readonly
					/>

					<div class="d-flex flex-column">
						<v-checkbox
							:ripple="false"
							:input-value="true"
							readonly
							hide-details
							dense
							label="Email Verified"
						/>

						<v-checkbox
								:ripple="false"
								v-model="user.g2fa"
								label="2FA Protected"
								readonly
								hide-details
								dense
						/>
						<div>
							<v-btn>
								<v-icon left small>mdi-email</v-icon>
								Change Email Request
							</v-btn>
						</div>
					</div>
				</div>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'UserAccountTabBasicInfo',

	props: {
		user: {
			type: Object,
			required: true,
		},
	},

	computed: {
		generatedAvatar() {
			return this.$store.getters['user/generatedAvatar'];
		},
	},
};
</script>

<style lang="sass" scoped>
.user-account-tab-basic-info
	&__avatar
		background: #cfd8dc
.theme--dark
	.user-account-tab-basic-info__avatar
		background: #687479
</style>