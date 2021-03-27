<template>
	<v-card class="user-api-item">
		<v-card-title class="user-api-item__title">
			<div class="user-api-item__name">{{ apiItem.name }}</div>

			<div :class="[$vuetify.rtl ? 'mr-1' : 'ml-1']">
					<UserApiDialogEdit :api-item="apiItem" @edit="editAPI" />
					<UserApiDialogDeleteOne
						:id="apiItem.id"
						:name="apiItem.name"
						@delete="deleteAPI"
					/>
			</div>
		</v-card-title>

		<v-divider />

		<div class="user-api-item__content pa-2">
			<div class="user-api-item__icon-wrapper">
				<v-avatar
					class="user-api-item__icon"
					size="150"
					v-html="generatedIcon(apiItem.name)"
				/>
			</div>

			<div class="user-api-item__info-wrapper">
				<div class="user-api-item__api-key-wrapper">
					<div class="user-api-item__header">API Key Hash (SHA 256)</div>
					<div class="user-api-item__api-key">{{ apiItem.token }}</div>
				</div>

				<div class="user-api-item__secret-key-wrapper">
					<div class="user-api-item__header">Secret Key (Hidden)</div>
					<div class="user-api-item__secret-key">***************</div>
				</div>

				<div class="user-api-item__header">Разрешения API</div>

				<div class="user-api-item__abilities-key-wrapper">
					<v-checkbox
						class="mt-0"
						label="Торговля"
						:value="tradingItemValue"
						hide-details
						dense
						disabled
					/>
					<v-checkbox
						class="mt-0"
						label="Вывод средств"
						:value="withdrawItemValue"
						hide-details
						dense
						disabled
					/>
				</div>

				<div class="user-api-item__created-key-wrapper">
					<div class="user-api-item__header">Создан</div>
					<div class="user-api-item__created">
						{{ formatDate(apiItem.created_at) }}
					</div>
				</div>
				<div class="user-api-item__updated-key-wrapper">
					<div class="user-api-item__header">Обновлен</div>
					<div class="user-api-item__updated">
						{{ formatDate(apiItem.updated_at) }}
					</div>
				</div>
				<div class="user-api-item__used-key-wrapper">
					<div class="user-api-item__header">Последнее использование</div>
					<div class="user-api-item__used">
						{{ formatDate(apiItem.last_used_at) }}
					</div>
				</div>
			</div>
		</div>
	</v-card>
</template>

<script>
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-jdenticon-sprites';

import UserApiDialogEdit from './dialog/UserApiDialogEdit';
import UserApiDialogDeleteOne from './dialog/UserApiDialogDeleteOne';

import formatDate from '../../../../../mixins/format/formatDate';

export default {
	name: 'UserApiItem',

	components: { UserApiDialogEdit, UserApiDialogDeleteOne },

	mixins: [formatDate],

	props: {
		apiItem: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {};
	},

	computed: {
		tradingItemValue() {
			return this.apiItem.abilities.indexOf('trading') !== -1;
		},
		withdrawItemValue() {
			return this.apiItem.abilities.indexOf('withdraw') !== -1;
		},
	},

	methods: {
		generatedIcon(name) {
			const options = {};
			const avatars = new Avatars(sprites, options);
			return avatars.create(name);
		},

		editAPI(newAbilities) {
			this.apiItem.abilities = newAbilities;
		},
		deleteAPI() {
			this.$emit('delete', this.apiItem.id);
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
		padding-bottom: 4px

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
		border: 1px solid rgba(103,103,103,0.32)
		border-radius: 0

	&__abilities-key-wrapper
		margin-left: -4px

	&__api-key-wrapper
		.user-api-item__header
			padding-top: 0
	&__api-key
		font-size: 1.1rem

	&__secret-key
		font-size: 1.1rem
		font-weight: bold

	@media screen and (max-width: 600px)
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
