<template>
	<v-expansion-panels class="user-account-tab-panels d-flex flex-column flex-grow-1" style="margin-top: 5px" v-model="panel" multiple>
		<v-expansion-panel class="user-account-tab-panels__actions d-flex flex-column flex-grow-1" readonly>
			<v-expansion-panel-header class="title">
				{{ $t('user.title.actions') }}
			</v-expansion-panel-header>

			<v-expansion-panel-content>
				<v-divider />

        <div class="d-flex justify-space-between">
          <div class="mt-2">
            <div class="title">{{ $t('user.info.change_email') }}</div>
            <div class="subtitle mb-2">
              {{ $t('user.info.change_email_subtitle') }}
            </div>
            <UserAccountDialogChangeEmail :current-email="user.email" :two-fa="user.g2fa" />
          </div>
          <div class="mt-2 ml-2">
            <div class="title">{{ $t('user.info.account_info_request') }}</div>
            <div class="subtitle mb-2">
              {{ $t('user.info.account_info_request_subtitle') }}
            </div>
            <UserAccountDialogAccountInfoRequest />
          </div>
          <div class="mt-2 ml-2">
            <div class="title">{{ $t('user.info.statement_request') }}</div>
            <div class="subtitle mb-2">
              {{ $t('user.info.statement_request_subtitle') }}
            </div>
            <UserAccountDialogStatementRequest />
          </div>
          <div class="mt-2 ml-2">
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

export default {
	name: 'UserAccountPanels',

	components: {
    UserAccountDialogAccountDelete,
    UserAccountDialogAccountInfoRequest,
    UserAccountDialogStatementRequest,
		UserAccountDialogChangeEmail,
	},

	mixins: [formatDate],

	props: {
		user: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			panel: [0, 1],
		};
	},
};
</script>
