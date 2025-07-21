<template>
	<v-card class="balance flex-grow-1">
		<CommonPageTitle>{{ $t('balance.title') }}</CommonPageTitle>

		<v-tabs v-model="selectedTab" class='small-tabs' :key="$i18n.locale" show-arrows>
			<v-tab :key="1">
				{{ $t('balance.headers.own_crypto_balance_list') }}
			</v-tab>

			<v-tab :key="2">
				{{ $t('balance.headers.own_active_withdraw_list') }}
			</v-tab>

      <v-tab :key="3">
        {{ $t('balance.headers.own_active_fiat_withdraw_list') }}
      </v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab" touchless>
			<v-tab-item :key="1">
				<BalanceList v-if="!isLoading" :is_verified="this.verifyStatus" :block_status="this.blockStatus" :trader_status="this.status" />
			</v-tab-item>

			<v-tab-item :key="2">
				<BalanceWithdrawalList :list="withdrawalList" />
			</v-tab-item>

      <v-tab-item :key="3">
        <BalanceFiatWithdrawalList :list="withdrawalFiatList" />
      </v-tab-item>
		</v-tabs-items>
	</v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import CommonPageTitle from '@/components/common/CommonPageTitle.vue';
import BalanceList from '@/components/balance/common/BalanceList.vue';
import BalanceWithdrawalList from '@/components/balance/withdrawal/BalanceWithdrawalList.vue';
import BalanceFiatWithdrawalList from '@/components/balance/withdrawal/BalanceFiatWithdrawalList.vue';

import CentrifugeBalanceMixin from '@/mixins/centrifugo-balance';

export default {
	name: 'Balance',

	mixins: [CentrifugeBalanceMixin],

	components: {
		CommonPageTitle,
		BalanceList,
		BalanceWithdrawalList,
    BalanceFiatWithdrawalList
	},

	data() {
		return {
			selectedTab: 0,
      isLoading: true,
		};
	},

	computed: {
		...mapState({
			withdrawalList: state => state.balance.withdrawals || [],
		}),
    ...mapState({
      withdrawalFiatList: state => state.balance.fiat_withdrawals || [],
    }),
    ...mapState('user', ['blockStatus','verifyStatus','status']),
	},

  async created() {
    //this.$store.commit('app/setAuthUser', { user: this.$user, vm: this });
    await Promise.all([this.getVerificationStatusStore(), this.getBlockStatusStore(), this.getStatusStore(), this.fetchWithdrawals(), this.fetchFiatWithdrawals()]);
    this.isLoading = false;
	},

	methods: {
		...mapActions({
			fetchWithdrawalsStore: 'balance/fetchWithdrawals',
      fetchFiatWithdrawalsStore: 'balance/fetchFiatWithdrawals',
      getBlockStatusStore: 'user/getBlockStatus',
      getVerificationStatusStore: 'user/getVerifyStatus',
      getStatusStore: 'user/getStatus'
		}),

		async fetchWithdrawals() {
			await this.fetchWithdrawalsStore();
		},
    async fetchFiatWithdrawals() {
      await this.fetchFiatWithdrawalsStore();
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
