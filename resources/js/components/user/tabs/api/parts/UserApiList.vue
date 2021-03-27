<template>
	<v-card class="user-api-list">
		<v-card-title class="user-api-list__title-wrapper">
			<div class="user-api-list__title">API ключи</div>

			<div class="user-api-list__actions">
				<UserApiDialogCreate @create="addCreatedAPI" />
				<UserApiDialogDeleteAll @delete="deleteAllAPI" />
			</div>
		</v-card-title>

		<v-card-text>
			<UserApiItem
				class="user-api-list__item"
				v-for="item in api"
				:key="item.id"
				:api-item="item"
				@delete="deleteAPIByID"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import UserApiItem from './UserApiItem';
import UserApiDialogCreate from './dialog/UserApiDialogCreate';
import UserApiDialogDeleteAll from './dialog/UserApiDialogDeleteAll';

export default {
	name: 'UserApiList',

	data() {
		return {
			api: [],
		};
	},

	components: { UserApiItem, UserApiDialogCreate, UserApiDialogDeleteAll },

	methods: {
		addCreatedAPI(newAPI) {
			this.api.push(newAPI);
		},
		deleteAllAPI() {
			this.api = [];
		},
		deleteAPIByID(id) {
			this.api = this.api.filter(item => item.id !== id);
		},
	},

	async mounted() {
		const { data } = await axios.get('/trader/ext/api_tokens');
		this.api = data.data;
	},
};
</script>

<style lang="sass" scoped>
.user-api-list
	&__title-wrapper
		justify-content: space-between

	&__item
		margin-bottom: 5px
		&:last-child
			margin-bottom: 0
	::v-deep.v-card
		box-shadow: none
		border: 1px solid #7b7b7b52

	@media screen and (max-width: 450px)
		&__title-wrapper
			display: block
		&__actions
			margin-top: 8px
</style>
