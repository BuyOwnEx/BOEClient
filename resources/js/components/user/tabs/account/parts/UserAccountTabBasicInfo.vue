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

					<div class="mt-1 mb-2">
						<div>Реферальная ссылка</div>
						<CopyLabel :text="refLink" />
					</div>

					<div class="d-flex flex-column">
						<v-checkbox
							class="mt-0"
							:ripple="false"
							:input-value="true"
							readonly
							hide-details
							dense
							label="Email Verified"
						/>
						<v-checkbox
							class="mt-0"
							v-model="user.g2fa"
							:ripple="false"
							label="2FA Protected"
							readonly
							hide-details
							dense
						/>
						<v-checkbox
							class="mt-0"
							v-model="user.verify_status"
							:ripple="false"
							label="KYC status"
							readonly
							hide-details
							dense
						/>
					</div>
				</div>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import CopyLabel from '../../../../common/CopyLabel';

export default {
	name: 'UserAccountTabBasicInfo',

	components: { CopyLabel },

	props: {
		user: {
			type: Object,
			required: true,
		},
	},

	computed: {
		generatedAvatar() {
			return this.$store.getters['user/getGeneratedAvatar']();
		},
		refLink() {
			return `${window.location.hostname}?ref=${user.id}`;
		},
	},
};
</script>

<style lang="sass" scoped>
.user-account-tab-basic-info
	&__avatar
		background: #cfd8dc
	::v-deep.v-input--checkbox:first-child
		padding-top: 0
.theme--dark
	.user-account-tab-basic-info__avatar
		background: #687479
</style>
