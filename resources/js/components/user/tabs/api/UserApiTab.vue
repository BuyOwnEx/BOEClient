<template>
	<div class="user-api-tab">
		<UserApiList />
	</div>
</template>

<script>
import UserApiList from './parts/UserApiList';

export default {
	name: 'UserApiTab',

	components: {
		UserApiList,
	},

	mounted() {
		window.location.hash = '#api';
	}
};
</script>

<style lang="sass" scoped>
.user-api-tab
	> ::v-deep.v-card
		margin-bottom: 5px
		&:last-child
			margin-bottom: 0
</style>
