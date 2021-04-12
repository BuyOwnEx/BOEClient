<template>
	<v-card class="balance flex-grow-1">
		<CommonPageTitle>{{ $t('balance.title') }}</CommonPageTitle>

		<v-tabs v-model="selectedTab" show-arrows>
			<v-tab :key="1">
				{{ $t('balance.headers.own_crypto_balance_list') }}
			</v-tab>

			<v-tab v-if="isUserFiat" :key="2">
				{{ $t('balance.headers.own_fiat_balance_list') }}
			</v-tab>

			<v-tab :key="3">
				{{ $t('balance.headers.own_active_withdraw_list') }}
			</v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab" touchless>
			<v-tab-item :key="1">
				<OwnCryptoBalanceList :state-types="stateTypes" />
			</v-tab-item>

			<v-tab-item v-if="isUserFiat" :key="2">
				<OwnFiatBalanceList :state-types="stateTypes" />
			</v-tab-item>

			<v-tab-item :key="3">
				<OwnWithdrawalList />
			</v-tab-item>
		</v-tabs-items>
	</v-card>
</template>

<script>
import CommonPageTitle from '../../components/common/CommonPageTitle';

import OwnCryptoBalanceList from '../../components/balance/crypto/OwnCryptoBalanceList';
import OwnWithdrawalList from '../../components/balance/OwnWithdrawalList';

import CentrifugeBalanceMixin from '../../mixins/centrifugo-balance';

export default {
	name: 'Balance',

	mixins: [CentrifugeBalanceMixin],

	components: {
		CommonPageTitle,
		OwnCryptoBalanceList,
		OwnWithdrawalList,
		OwnFiatBalanceList: () =>
			import(
				/* webpackPrefetch: true */ '../../components/balance/fiat/OwnFiatBalanceList'
			),
	},

	data() {
		return {
			selectedTab: 0,
		};
	},

	computed: {
		stateTypes() {
			const workIcon = {
				name: 'mdi-toggle-switch',
				color: 'success',
			};
			const notWorkIcon = {
				name: 'mdi-toggle-switch-off',
				color: 'error',
			};
			const syncIcon = {
				name: 'mdi-sync-alert',
				color: 'warning',
			};
			const maintenanceIcon = {
				name: 'mdi-tools',
				color: 'error darken-3',
			};

			return [
				{
					id: 1,
					replenishment: this.$t('balance.state_type.replenishment'),
					withdrawal: this.$t('balance.state_type.withdrawal'),
					replenishmentIcon: workIcon,
					withdrawalIcon: workIcon,
				},
				{
					id: 2,
					replenishment: this.$t('balance.state_type.not_replenishment'),
					withdrawal: this.$t('balance.state_type.withdrawal'),
					replenishmentIcon: notWorkIcon,
					withdrawalIcon: workIcon,
				},
				{
					id: 3,
					replenishment: this.$t('balance.state_type.replenishment'),
					withdrawal: this.$t('balance.state_type.not_withdrawal'),
					replenishmentIcon: workIcon,
					withdrawalIcon: notWorkIcon,
				},
				{
					id: 4,
					replenishment: this.$t('balance.state_type.not_replenishment'),
					withdrawal: this.$t('balance.state_type.not_withdrawal'),
					replenishmentIcon: notWorkIcon,
					withdrawalIcon: notWorkIcon,
				},
				{
					id: 5,
					replenishment: this.$t('balance.state_type.sync'),
					withdrawal: this.$t('balance.state_type.sync'),
					replenishmentIcon: syncIcon,
					withdrawalIcon: syncIcon,
				},
				{
					id: 6,
					replenishment: this.$t('balance.state_type.maintenance'),
					withdrawal: this.$t('balance.state_type.maintenance'),
					replenishmentIcon: maintenanceIcon,
					withdrawalIcon: maintenanceIcon,
				},
			];
		},

		isUserFiat() {
			return this.$store.getters['user/isUserFiat'];
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
