<template>
	<v-card class="user-api-tab tab-fill-height">
		<v-card-title class="user-api-tab__title-wrapper">
			<div class="user-api-tab__title">{{$t('user.api.title')}}</div>

			<div class="user-api-tab__actions">
				<UserApiDialogCreate @create="addCreatedAPI" />
				<UserApiDialogDeleteAll @delete="deleteAllAPI" />
			</div>
		</v-card-title>

		<CommonLoading v-if="!api" />
		<div v-else-if="api && !api.length" class="user-api-tab__empty">
			<span>{{$t('user.api.api_empty')}}</span>
		</div>

		<v-card-text v-else>
			<UserApiItem
				class="user-api-tab__item"
				v-for="item in api"
				:key="item.id"
				:api-item="item"
				@delete="deleteAPIByID"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import UserApiItem from './parts/UserApiItem';
import UserApiDialogCreate from './parts/dialog/UserApiDialogCreate';
import UserApiDialogDeleteAll from './parts/dialog/UserApiDialogDeleteAll';
import CommonLoading from '../../../common/CommonLoading';

export default {
	name: 'UserApiTab',

	components: {
		UserApiItem,
		UserApiDialogCreate,
		UserApiDialogDeleteAll,
		CommonLoading,
	},

	data() {
		return {
			api: null,
		};
	},

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

	created() {
		axios.get('/trader/ext/api_tokens').then(res => {
			this.api = res.data.data;
		});
	},
};
</script>

<style lang="sass" scoped>
.user-api-tab
	display: flex
	flex-flow: column

	&__title-wrapper
		justify-content: space-between

	&__empty
		display: flex
		justify-content: center
		align-items: center
		opacity: 0.8
		margin: auto
		span
			margin-bottom: 64px

	&__item:not(:last-child)
		margin-bottom: 5px
	::v-deep.v-card
		box-shadow: none
		border: 1px solid #7b7b7b52
	> ::v-deep.v-card:not(:last-child)
		margin-bottom: 5px

	@media screen and (max-width: 450px)
		&__title-wrapper
			display: block
		&__actions
			margin-top: 8px
</style>
