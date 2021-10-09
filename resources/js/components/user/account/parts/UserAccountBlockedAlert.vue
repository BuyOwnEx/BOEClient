<template>
	<v-card class="user-account-tab-blocked-alert">
		<v-card-title>{{ $t('user.disabled_alert.title') }}</v-card-title>
		<v-card-subtitle> {{ blockReason }} {{ $t('user.disabled_alert.support') }} </v-card-subtitle>
	</v-card>
</template>

<script>
export default {
	name: 'UserAccountBlockedAlert',

	props: {
		status: {
			type: Number,
			required: true,
		},
	},

	computed: {
		blockReason() {
			const isTradingBlock = this.status === 1;
			const isWithdrawalBlock = this.status === 2;
			const isTradingAndWithdrawalBlock = this.status === 3;

			if (isTradingBlock) return this.$t('user.disabled_alert.trading_block');
			else if (isWithdrawalBlock) return this.$t('user.disabled_alert.withdrawal_block');
			else if (isTradingAndWithdrawalBlock) return this.$t('user.disabled_alert.trading_and_withdrawal_block');
		},
	},
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
