<template>
	<v-card class="balance flex-grow-1">
		<v-tabs v-model="selectedTab">
			<v-tab :key="1">
				{{ $t('balance.headers.own_crypto_balance_list') }}
			</v-tab>

			<v-tab :key="2">
				{{ $t('balance.headers.own_fiat_balance_list') }}
			</v-tab>

			<v-tab :key="3">
				{{ $t('balance.headers.own_active_withdraw_list') }}
			</v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab">
			<v-tab-item :key="1">
				<OwnCryptoBalanceList />
			</v-tab-item>

			<v-tab-item :key="2">
				<OwnFiatBalanceList />
			</v-tab-item>

			<v-tab-item :key="3">
				<OwnWithdrawalList />
			</v-tab-item>
		</v-tabs-items>
	</v-card>
</template>

<script>
import CentrifugeBalanceMixin from '../mixins/centrifugo-balance';
import OwnFiatBalanceList from '../components/balance/OwnFiatBalanceList';
import OwnCryptoBalanceList from '../components/balance/OwnCryptoBalanceList';
import OwnWithdrawalList from '../components/balance/OwnWithdrawalList';

export default {
	name: 'Balance',

	mixins: [CentrifugeBalanceMixin],

	components: {
		OwnFiatBalanceList,
		OwnCryptoBalanceList,
		OwnWithdrawalList,
	},

	data() {
		return {
			selectedTab: 0,
		};
	},

	computed: {
		isLogged() {
			return this.$store.getters.isLogged;
		},
	},
};
</script>

<style scoped lang="sass">
.balance
	&__crypto
		margin-top: 5px !important
	&__withdrawal
		margin-top: 5px !important
</style>
