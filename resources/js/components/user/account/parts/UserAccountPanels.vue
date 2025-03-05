<template>
	<v-expansion-panels class="user-account-tab-panels d-flex flex-column flex-grow-1" style="margin-top: 5px" v-model="panel" multiple>
		<v-expansion-panel class="user-account-tab-panels__actions d-flex flex-column flex-grow-1" readonly>
			<v-expansion-panel-header class="title">
				{{ $t('user.title.actions') }}
			</v-expansion-panel-header>

			<v-expansion-panel-content>
				<v-divider />

        <div :class="isMobile ? 'd-flex flex-column justify-space-between' : 'd-flex justify-space-between'">
          <div class="mt-2 d-flex flex-column justify-space-between">
            <div class="title">{{ $t('user.info.change_email') }}</div>
            <div class="subtitle mb-2">
              {{ $t('user.info.change_email_subtitle') }}
            </div>
            <UserAccountDialogChangeEmail :current-email="user.email" :two-fa="user.g2fa" />
          </div>
          <div :class="{ 'ml-2': !isMobile, 'mt-2 d-flex flex-column justify-space-between': true }" v-if="is_contract_request_enabled">
            <div class="title">{{ $t('user.info.contract_request') }}</div>
            <small class="font-italic text--secondary" v-if="doc_statuses.last_dates.last_contract_date"> {{ $t('user.info.last_date_request') }} : {{ get_date(doc_statuses.last_dates.last_contract_date) }}</small>
            <div class="subtitle mb-2">
              {{ $t('user.info.contract_request_subtitle') }}
            </div>
            <UserAccountDialogContractRequest
                :last_date="doc_statuses.last_dates.last_contract_date"
                :is_verified="verifyStatus"
            />
          </div>
          <div :class="{ 'ml-2': !isMobile, 'mt-2 d-flex flex-column justify-space-between': true }">
            <div class="title">{{ $t('user.info.account_info_request') }}</div>
            <small class="font-italic text--secondary" v-if="doc_statuses.last_dates.last_info_date"> {{ $t('user.info.last_date_request') }} : {{ get_date(doc_statuses.last_dates.last_info_date) }}</small>
            <div class="subtitle mb-2">
              {{ $t('user.info.account_info_request_subtitle') }}
            </div>
            <UserAccountDialogAccountInfoRequest
                :req_count="doc_statuses.info_req_count"
                :has_wallets="doc_statuses.has_wallets"
                :last_date="doc_statuses.last_dates.last_info_date"
            />
          </div>
          <div :class="{ 'ml-2': !isMobile, 'mt-2 d-flex flex-column justify-space-between': true }">
            <div class="title">{{ $t('user.info.statement_request') }}</div>
            <small class="font-italic text--secondary" v-if="doc_statuses.last_dates.last_statement_date"> {{ $t('user.info.last_date_request') }} : {{ get_date(doc_statuses.last_dates.last_statement_date) }}</small>
            <div class="subtitle mb-2">
              {{ $t('user.info.statement_request_subtitle') }}
            </div>
            <UserAccountDialogStatementRequest
                :req_count="doc_statuses.statement_req_count"
                :has_accounts="doc_statuses.has_accounts"
                :last_date="doc_statuses.last_dates.last_statement_date"
            />
          </div>
          <div :class="{ 'ml-2': !isMobile, 'mt-2 d-flex flex-column justify-space-between': true }">
            <div class="title">{{ $t('user.info.account_delete') }}</div>
            <div class="subtitle mb-2">
              {{ $t('user.info.account_delete_subtitle') }}
            </div>
            <UserAccountDialogAccountDelete :two-fa="user.g2fa" />
          </div>
        </div>
			</v-expansion-panel-content>
		</v-expansion-panel>

		<v-expansion-panel class="user-account-tab-panels__metadata d-flex flex-column flex-grow-0" style="margin-top: 5px">
			<v-expansion-panel-header class="title">
				{{ $t('user.title.metadata') }}
			</v-expansion-panel-header>

			<v-expansion-panel-content class="body-2">
				<div>
					<span class="font-weight-bold">{{ $t('user.info.created') }}: </span>
					{{ formatDate(user.created_at) }}
				</div>
				<div>
					<span class="font-weight-bold">{{ $t('user.info.last_sign_in') }}: </span>
					{{ formatDate(user.last_login_at) }}
				</div>
				<div>
					<span class="font-weight-bold">{{ $t('user.info.last_browser') }}: </span>
					{{ user.last_browser }}
				</div>
				<div>
					<span class="font-weight-bold">{{ $t('user.info.last_device') }}: </span>
					{{ user.last_device }}
				</div>
				<div>
					<span class="font-weight-bold">{{ $t('user.info.last_os') }}: </span>
					{{ user.last_os }}
				</div>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script>
import formatDate from '@/mixins/format/formatDate';

import UserAccountDialogChangeEmail from '@/components/user/account/dialog/UserAccountDialogChangeEmail.vue';
import UserAccountDialogStatementRequest from '@/components/user/account/dialog/UserAccountDialogStatementRequest.vue';
import UserAccountDialogAccountInfoRequest
  from '@/components/user/account/dialog/UserAccountDialogAccountInfoRequest.vue';
import UserAccountDialogAccountDelete from '@/components/user/account/dialog/UserAccountDialogAccountDelete.vue';
import UserAccountDialogContractRequest from '@/components/user/account/dialog/UserAccountDialogContractRequest.vue';
import { mapState } from 'vuex';

export default {
	name: 'UserAccountPanels',

	components: {
    UserAccountDialogAccountDelete,
    UserAccountDialogAccountInfoRequest,
    UserAccountDialogStatementRequest,
		UserAccountDialogChangeEmail,
    UserAccountDialogContractRequest
	},

	mixins: [formatDate],

	props: {
		user: {
			type: Object,
			required: true,
		},
    doc_statuses: {
      type: Object,
      required: true,
    },
    is_verified: {
      type: Boolean,
      required: false,
      default: false
    },
	},

  computed: {
    ...mapState('user', ['status','verifyStatus']),
    ...mapState('app', ['product']),
    is_legal() {
      return (this.status & 4) === 4;
    },
    is_contract_request_enabled() {
      return this.product.enabledContactRequest
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

	data() {
		return {
			panel: [0, 1],
		};
	},
  methods: {
    get_date(date) {
      return this.$moment(date).utc().format('YYYY-MM-DD HH:mm:ss')
    },
  }
};
</script>
