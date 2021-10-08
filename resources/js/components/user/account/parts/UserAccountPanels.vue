<template>
	<v-expansion-panels class="user-account-tab-panels" v-model="panel" multiple>
		<v-expansion-panel class="user-account-tab-panels__actions" readonly>
			<v-expansion-panel-header class="title">
				{{ $t('user.title.actions') }}
			</v-expansion-panel-header>

			<v-expansion-panel-content>

				<v-divider />

				<div class="mt-2">
					<div class="title">{{ $t('user.info.change_email') }}</div>
					<div class="subtitle mb-2">
						{{ $t('user.info.change_email_subtitle') }}
					</div>
					<UserAccountDialogChangeEmail :current-email="user.email" :two-fa="user.g2fa" />
				</div>
			</v-expansion-panel-content>
		</v-expansion-panel>

		<v-expansion-panel class="user-account-tab-panels__metadata">
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
					{{ formatDate(user.lastLoginAt) }}
				</div>
				<div>
					<span class="font-weight-bold">{{ $t('user.info.last_browser') }}: </span>
					{{ user.lastBrowser }}
				</div>
				<div>
					<span class="font-weight-bold">{{ $t('user.info.last_device') }}: </span>
					{{ user.lastDevice }}
				</div>
				<div>
					<span class="font-weight-bold">{{ $t('user.info.last_os') }}: </span>
					{{ user.lastOS }}
				</div>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script>
import { mapActions } from 'vuex';
import formatDate from '../../../../mixins/format/formatDate';

import UserAccountDialogChangeEmail from '../dialog/UserAccountDialogChangeEmail';

export default {
	name: 'UserAccountPanels',

	components: {
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
			changeEmailLoading: false,
		};
	},

	methods: {
		...mapActions({
			changeEmailStore: 'user/changeEmail',
		}),

		async changeEmail() {
			try {
				this.changeEmailLoading = true;
				await this.changeEmailStore();
			} finally {
				this.changeEmailLoading = false;
			}
		},
	},
};
</script>

<style lang="sass" scoped>
.user-account-tab-panels
	::v-deep.v-expansion-panel--active
		margin-top: 5px
		+ .v-expansion-panel
			margin-top: 5px

	&__actions
		::v-deep.v-expansion-panel-header
			cursor: default !important
		::v-deep.v-expansion-panel-header__icon
			display: none
</style>
