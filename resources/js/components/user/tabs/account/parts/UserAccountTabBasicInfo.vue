<template>
	<v-card>
		<v-card-title>Basic Information</v-card-title>

		<v-card-text>
			<div class="d-flex flex-column flex-sm-row">
				<div>
					<span>
						<v-img
							v-if="user.avatar"
							:src="user.avatar"
							aspect-ratio="1"
							class="blue-grey lighten-4 rounded elevation-3"
							max-width="90"
							max-height="90"
						/>
						<v-img
							v-else
							aspect-ratio="1"
							class="blue-grey lighten-4 rounded elevation-3"
							max-width="90"
							max-height="90"
							v-html="generatedAvatar"
						/>
					</span>
				</div>

				<div class="flex-grow-1 pt-2 pa-sm-2">
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

<style scoped></style>
