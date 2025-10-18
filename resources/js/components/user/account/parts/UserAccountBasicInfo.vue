<template>
	<v-card class="user-account-tab-basic-info d-flex flex-column">
		<v-card-title>{{ $t('user.title.basic_info') }}</v-card-title>

		<v-card-text>
			<div class="d-flex flex-column flex-sm-row">
				<div>
					<span>
            <v-avatar class="user-account-tab-basic-info__avatar rounded" size="90">
              <img :src="generatedAvatar" alt="Avatar" />
            </v-avatar>
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

					<div class="mt-1 mb-2" v-if="is_ref_enabled">
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
              :messages="getVerifiedLabel"
							readonly
              :hide-details="'auto'"
              error-count="2"
							dense
            >
              <template #message="{ key, message }">
                <span class="text-lowercase caption ml-4">{{message}}</span>
              </template>
            </v-checkbox>
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
		...mapState('user', ['verifyStatus','status']),
    ...mapState('app', ['product']),
		generatedAvatar() {
			return this.$store.getters['user/getGeneratedAvatar'](import.meta.env.VITE_USER_ICON_TYPE || 'initials');
		},
    is_ref_enabled() {
      return this.product.enabledReferral
    },
		refLink() {
      return `${window.location.origin}?ref=${this.user.id}`;
		},
    isIndividual() {
      return (this.status & 2) > 0;
    },
    isLegal() {
      return (this.status & 4) > 0;
    },
    isResident() {
      return (this.status & 32) > 0;
    },
    isNonResident() {
      return (this.status & 64) > 0;
    },
    getVerifiedLabel() {
      if(this.verifyStatus)
      {
        if(this.isLegal) {
          if(this.isResident) return [this.$t('common.legal'), this.$t('common.resident')];
          else return [this.$t('common.legal'), this.$t('common.non_resident')];
        }
        else
        {
          if(this.isResident) return [this.$t('common.individual'), this.$t('common.resident')];
          else return [this.$t('common.individual'), this.$t('common.non_resident')];
        }
      }
      else return [];
    }
	},
};
</script>

<style lang="sass" scoped>
.user-account-tab-basic-info
	::v-deep.v-input--checkbox:first-child
		padding-top: 0
</style>
