<template>
	<v-card class="user-account-tab-basic-info">
		<v-card-title>Basic Information</v-card-title>

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

				<div class="flex-grow-1 pt-2 pt-sm-0 pa-sm-2">
					<v-text-field
						v-model="user.name"
						label="Display name"
						placeholder="name"
						readonly
					/>
					<v-text-field
						v-model="user.email"
						label="Email"
						readonly
						hide-details
					/>

					<div class="d-flex flex-column">
						<v-checkbox
							:ripple="false"
							:input-value="true"
							readonly
							dense
							label="Email Verified"
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
