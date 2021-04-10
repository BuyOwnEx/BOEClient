<template>
	<v-card class="info-page status-page flex-grow-1">
		<CommonPageTitle>Состояние системы</CommonPageTitle>

		<StatusSupportCurrencyText :user-fiat='isUserFiat'/>
		<v-divider />

		<v-card-text>
			<StatusDefinitionText />

			<StatusTables
				:fiat-data="fiatCurrencies"
				:crypto-data="cryptoCurrencies"
				:user-fiat='isUserFiat'
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import CommonPageTitle from '../../components/common/CommonPageTitle';

import StatusSupportCurrencyText from '../../components/info/status/StatusSupportCurrencyText';
import StatusDefinitionText from '../../components/info/status/StatusDefinitionText';
import StatusTables from '../../components/info/status/StatusTables';

export default {
	name: 'Status',

	components: {
		CommonPageTitle,
		StatusSupportCurrencyText,
		StatusDefinitionText,
		StatusTables,
	},

	data() {
		return {
			fiatCurrencies: [
				{
					currency: 'USD',
					name: 'US Dollar',
					depositStatus: 'active',
					withdrawalStatus: 'active',
					tradingStatus: 'unavailable',
					payment: [
						{
							name: 'Payeer',
							minDeposit: 10,
							minWithdraw: 1,
							depositFee: 1,
							withdrawFee: 2,
							noVerifyDayLimit: 1000,
							verifyDayLimit: 10000,
						},
					],
				},
				{
					currency: 'EUR',
					name: 'Euro',
					depositStatus: 'unavailable',
					withdrawalStatus: 'unavailable',
					tradingStatus: 'unavailable',
					payment: null,
				},
				{
					currency: 'RUB',
					name: 'Ruble',
					depositStatus: 'active',
					withdrawalStatus: 'active',
					tradingStatus: 'active',
					payment: [
						{
							name: 'Payeer',
							minDeposit: 100,
							minWithdraw: 100,
							depositFee: 1,
							withdrawFee: 2,
							noVerifyDayLimit: 10000,
							verifyDayLimit: 200000,
						},
					],
				},
			],
			cryptoCurrencies: [
				{
					currency: 'BIP',
					name: 'Minter',
					type: 'coin',
					depositStatus: 'maintenance',
					withdrawalStatus: 'maintenance',
					tradingStatus: 'active',
					minDeposit: 10,
					minWithdrawal: 0.1,
					depositFee: 0,
					withdrawalFee: 0.05,
					noVerifyDayLimit: 1000,
					verifyDayLimit: 10000,
				},
				{
					currency: 'ETH',
					name: 'Etherium',
					type: 'coin',
					depositStatus: 'maintenance',
					withdrawalStatus: 'maintenance',
					tradingStatus: 'active',
					minDeposit: 0.008,
					minWithdrawal: 0.01,
					depositFee: 0,
					withdrawalFee: 0.002,
					noVerifyDayLimit: 1,
					verifyDayLimit: 10,
				},
				{
					currency: 'BTC',
					name: 'Bitcoin',
					type: 'coin',
					depositStatus: 'maintenance',
					withdrawalStatus: 'maintenance',
					tradingStatus: 'active',
					minDeposit: 0.001,
					minWithdrawal: 0.005,
					depositFee: 0,
					withdrawalFee: 0.0003,
					noVerifyDayLimit: 0.5,
					verifyDayLimit: 1,
				},
				{
					currency: 'USDT',
					name: 'Tether',
					type: 'token',
					depositStatus: 'offline',
					withdrawalStatus: 'offline',
					tradingStatus: 'active',
					minDeposit: 1,
					minWithdrawal: 1,
					depositFee: 0,
					withdrawalFee: 0.1,
					noVerifyDayLimit: 100,
					verifyDayLimit: 1000,
				},
			],
		};
	},

	computed: {
		isUserFiat() {
			return this.$store.getters['user/isUserFiat'];
		},
	}
};
</script>

<style scoped lang="sass"></style>
