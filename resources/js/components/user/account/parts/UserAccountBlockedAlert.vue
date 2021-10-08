<template>
	<v-card class="user-account-tab-blocked-alert">
		<v-card-title>{{ $t('user.disabled_alert.title') }}</v-card-title>
		<v-card-subtitle>
			{{ $t('user.disabled_alert.content') }}
		</v-card-subtitle>
	</v-card>
</template>

<script>
export default {
	name: 'UserAccountBlockedAlert',
};
</script>

<style lang="sass" scoped>
.user-account-tab-blocked-alert
	color: white !important
	margin-bottom: 5px
	background: #ff7365d6
	::v-deep.v-card__subtitle
		color: white !important
</style>
