<template>
	<v-card class="balance flex-grow-1">
		<CommonPageTitle>{{ $t('balance.title') }}</CommonPageTitle>

		<v-tabs v-model="selectedTab" class='small-tabs' :key="$i18n.locale" show-arrows>
			<v-tab :key="1">
				{{ $t('balance.headers.own_crypto_balance_list') }}
			</v-tab>

<!--			<v-tab v-if="isUserFiat" :key="2">
				{{ $t('balance.headers.own_fiat_balance_list') }}
			</v-tab>-->

			<v-tab :key="2">
				{{ $t('balance.headers.own_active_withdraw_list') }}
			</v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab" touchless>
			<v-tab-item :key="1">
				<BalanceCryptoList />
			</v-tab-item>

<!--			<v-tab-item v-if="isUserFiat" :key="2">
				<BalanceFiatList />
			</v-tab-item>-->

			<v-tab-item :key="2">
				<BalanceWithdrawalList :list="withdrawalList" />
			</v-tab-item>
		</v-tabs-items>
	</v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import config from '../../configs';
import CommonPageTitle from '../../components/common/CommonPageTitle';
import BalanceCryptoList from '../../components/balance/crypto/BalanceCryptoList';
import BalanceWithdrawalList from '../../components/balance/withdrawal/BalanceWithdrawalList';

import CentrifugeBalanceMixin from '../../mixins/centrifugo-balance';

export default {
	name: 'Balance',

	mixins: [CentrifugeBalanceMixin],

	components: {
		CommonPageTitle,
		BalanceCryptoList,
		BalanceWithdrawalList,
		BalanceFiatList: () => import(/* webpackPrefetch: true */ '../../components/balance/fiat/BalanceFiatList'),
	},

	data() {
		return {
			selectedTab: 0,
		};
	},

	computed: {
		...mapState({
			withdrawalList: state => state.balance.withdrawals || [],
		}),
	},

	created() {
		this.fetchWithdrawals();
	},

	methods: {
		...mapActions({
			fetchWithdrawalsStore: 'balance/fetchWithdrawals',
		}),

		async fetchWithdrawals() {
			await this.fetchWithdrawalsStore();
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
