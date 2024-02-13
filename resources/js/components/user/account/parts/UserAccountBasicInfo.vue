<template>
	<v-card class="user-account-tab-basic-info d-flex flex-column">
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
						:label="$t('user.info.display_name')"
						hide-details
						readonly
					/>
					<v-text-field
						class="mb-2"
						v-model="user.email"
						:label="$t('user.info.email')"
						hide-details
						readonly
					/>
					<v-text-field
						class="mb-2"
						v-model="user.rate_limit"
						:label="$t('user.info.rate')"
						hide-details
						readonly
					/>

					<div class="mt-1 mb-2">
						<div>{{ $t('user.info.ref_link') }}</div>
						<CommonCopyLabel :text="refLink" />
					</div>

					<div class="d-flex flex-column">
						<v-checkbox
							class="mt-0"
							:ripple="false"
							:input-value="true"
							:label="$t('user.info.email_verified')"
							readonly
							hide-details
							dense
						/>
						<v-checkbox
							class="mt-0"
							v-model="user.g2fa"
							:ripple="false"
							:label="$t('user.info.protected')"
							readonly
							hide-details
							dense
						/>
						<v-checkbox
							class="mt-0"
							v-model="verifyStatus"
							:ripple="false"
							:label="$t('user.info.kyc_status')"
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
import { mapState } from 'vuex';
import CommonCopyLabel from '@/components/common/CommonCopyLabel.vue';

export default {
	name: 'UserAccountBasicInfo',

	components: { CommonCopyLabel },

	props: {
		user: {
			type: Object,
			required: true,
		},
	},

	computed: {
		...mapState('user', ['verifyStatus']),
		generatedAvatar() {
			return this.$store.getters['user/getGeneratedAvatar']();
		},
		refLink() {
      return `${window.location.origin}?ref=${this.user.id}`;
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
