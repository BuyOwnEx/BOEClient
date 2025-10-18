<template>
	<v-card class="user-api-item">
		<v-card-title class="user-api-item__title">
			<div class="user-api-item__name">{{ api.name }}</div>

			<div :class="[$vuetify.rtl ? 'mr-1' : 'ml-1']">
				<UserApiDialogEdit :api-item="api" @edit="editAPI" />
				<UserApiDialogDeleteOne :id="api.id" :name="api.name" @delete="deleteAPI" />
			</div>
		</v-card-title>

		<v-divider />

		<div class="user-api-item__content pa-2">
			<div class="user-api-item__icon-wrapper">
        <v-avatar class="user-api-item__icon" size="150">
          <img :src="generatedAvatar(api.name)" :alt="api.name" />
        </v-avatar>
			</div>

			<div class="user-api-item__info-wrapper">
				<div class="user-api-item__api-key-wrapper">
					<div class="user-api-item__header">
						{{ $t('user.api.headers.hash') }}
					</div>
					<CommonCopyLabel :text="api.token" />
				</div>

				<div class="user-api-item__secret-key-wrapper">
					<div class="user-api-item__header">
						{{ $t('user.api.headers.secret_key') }}
					</div>
					<div class="user-api-item__secret-key">***************</div>
				</div>

				<div class="user-api-item__header">
					{{ $t('user.api.headers.abilities') }}
				</div>

				<div class="user-api-item__abilities-key-wrapper">
          <v-checkbox
              class="mt-0"
              v-model="infoItemValue"
              :label="$t('common.info')"
              hide-details
              disabled
              dense
          />
					<v-checkbox
              class="mt-0"
              v-model="tradingItemValue"
              :label="$t('menu.trading')"
              hide-details
              disabled
              dense
          />
					<v-checkbox
              class="mt-0"
						  v-model="withdrawItemValue"
              :label="$t('common.withdrawal_funds')"
              hide-details
              disabled
              dense
					/>

				</div>

				<div class="user-api-item__created-key-wrapper">
					<div class="user-api-item__header">
						{{ $t('user.api.headers.created') }}
					</div>
					<div class="user-api-item__created">
						{{ formatDate(api.created_at) }}
					</div>
				</div>
				<div class="user-api-item__updated-key-wrapper">
					<div class="user-api-item__header">
						{{ $t('user.api.headers.updated') }}
					</div>
					<div class="user-api-item__updated">
						{{ formatDate(api.updated_at) }}
					</div>
				</div>
				<div class="user-api-item__used-key-wrapper">
					<div class="user-api-item__header">
						{{ $t('user.api.headers.last_usage') }}
					</div>
					<div class="user-api-item__used">
						{{ formatDate(api.last_used_at) }}
					</div>
				</div>
			</div>
		</div>
	</v-card>
</template>

<script>

import UserApiDialogEdit from '@/components/user/api/dialog/UserApiDialogEdit.vue';
import UserApiDialogDeleteOne from '@/components/user/api/dialog/UserApiDialogDeleteOne.vue';
import CommonCopyLabel from '@/components/common/CommonCopyLabel.vue';

import formatDate from '@/mixins/format/formatDate';

export default {
	name: 'UserApiItem',

	components: { UserApiDialogEdit, UserApiDialogDeleteOne, CommonCopyLabel },

	mixins: [formatDate],

	props: {
		apiItem: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			api: this.apiItem,
		};
	},

	computed: {
    infoItemValue() {
      return this.api.abilities.indexOf('info') !== -1;
    },
		tradingItemValue() {
			return this.api.abilities.indexOf('trading') !== -1;
		},
		withdrawItemValue() {
			return this.api.abilities.indexOf('withdraw') !== -1;
		},
	},

	methods: {
    generatedAvatar(name) {
      return this.$store.getters['user/getGeneratedAvatar'](import.meta.env.VITE_API_ICON_TYPE || 'identicon', name);
    },

		editAPI(newAbilities) {
			this.api.abilities = newAbilities;
			this.api.updated_at = new Date().toISOString();
		},
		deleteAPI() {
			this.$emit('delete', this.api.id);
		},
	},
};
</script>

<style lang="sass" scoped>
.user-api-item
	&__title
		flex-wrap: nowrap
		white-space: nowrap
		justify-content: space-between
	&__header
		font-size: 1rem
		font-weight: 500
		padding-top: 16px

	&__name
		text-overflow: ellipsis
		overflow: hidden

	&__content
		display: grid
		grid-template-columns: 180px 1fr
		grid-template-areas: 'icon info'

	&__icon-wrapper
		display: flex
		grid-area: icon
	&__info-wrapper
		grid-area: info
		overflow: hidden

	&__icon
		padding: 8px
		border: 1px solid #a9a8a838
		border-radius: 0

	&__abilities-key-wrapper
		margin-left: -4px

	&__api-key-wrapper
		.user-api-item__header
			padding-top: 0
	::v-deep.CommonCopyLabel
		font-size: 1rem

	&__secret-key
		font-size: 1.1rem
		font-weight: bold

	@media screen and (max-width: 599px)
		&__content
			display: flex
			flex-flow: column
		&__icon-wrapper
			justify-content: center
			margin-bottom: 32px

.v-application--is-rtl
	.user-api-item
		&__abilities-key-wrapper
			margin-left: 0
			margin-right: -4px
</style>
