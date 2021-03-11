<template>
	<v-container class="balance fill-height pa-0" fluid>
		<v-row class="balance__fiat" align="start" justify="center" no-gutters>
			<v-col cols="12" class="text-center">
				<own-fiat-balance-list />
			</v-col>
		</v-row>

		<v-row class="balance__crypto" align="start" justify="center" no-gutters>
			<v-col cols="12" class="text-center">
				<own-crypto-balance-list />
			</v-col>
		</v-row>

		<v-row
			class="balance__withdrawal"
			align="start"
			justify="center"
			no-gutters
		>
			<v-col cols="12" class="text-center">
				<own-withdrawal-list />
			</v-col>
		</v-row>
	</v-container>
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
		return {};
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
