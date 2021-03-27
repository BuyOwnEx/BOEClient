<template>
	<v-card class="user-api-list">
		<v-card-title class="justify-space-between">
			<div>API ключи</div>
			<v-btn @click="deleteAllApi">Удалить все API</v-btn>
		</v-card-title>

		<v-card-text>
			<UserApiItem
				class="user-api-list__item"
				v-for="item in api"
				:key="item.id"
				:api-item="item"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import UserApiItem from './UserApiItem';

export default {
	name: 'UserApiList',
	data() {
		return {
			api: []
		};
	},
	components: { UserApiItem },

	methods: {
		async deleteAllApi() {},
	},
	mounted() {
		axios.get('/trader/ext/api_tokens').then(response => {
			this.api = response.data.data;
		});
	},
};
</script>

<style lang="sass" scoped>
.user-api-list
	&__item
		margin-bottom: 5px
		:last-child
			margin-bottom: 0
	::v-deep.v-card
		box-shadow: none
		border: 1px solid #7b7b7b52
</style>
