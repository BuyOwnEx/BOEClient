<template>
	<v-card>
		<v-data-table
			class="px-2"
			:calculate-widths="true"
			:headers="headers"
			:items="fiatBalances"
			:items-per-page="itemsPerPage"
			:footer-props="footer_props"
			dense
		>
			<template v-slot:top>
				<v-toolbar flat dense>
					<v-toolbar-title>{{ tableCaption }}</v-toolbar-title>

					<v-spacer />

					<v-switch
						v-model="showOnlyNotNullBalances"
						class="mr-3"
						:label="$t('trading.show_only_not_null_balances')"
						hide-details
						left
						dense
						inset
					/>
				</v-toolbar>
			</template>

			<template v-slot:item.action="{ item }">
				<v-menu
					close-on-click
					offset-y
					v-model="item.menu"
					transition="slide-y-transition"
					bottom
				>
					<template v-slot:activator="{ on }">
						<v-btn x-small color="success" dense v-on="on">
							{{ $t('trading.actions') }}
							<v-icon right>mdi-chevron-down</v-icon>
						</v-btn>
					</template>

					<v-list dense>
						<fiat-deposit
							v-if="menuItemExist('deposit')"
							:fiatObj="item"
							v-on:closeMenu="closeMenu(item)"
						/>

						<fiat-withdraw
							v-if="menuItemExist('withdraw')"
							:fiat_id="item"
							v-on:closeMenu="closeMenu(item)"
						/>

						<fiat-transfer-trade
							v-if="menuItemExist('transfer_to_trade')"
							:fiat_id="item"
							v-on:closeMenu="closeMenu(item)"
						/>

						<fiat-transfer-safe
							v-if="menuItemExist('transfer_to_safe')"
							:fiat_id="item"
							v-on:closeMenu="closeMenu(item)"
						/>
					</v-list>
				</v-menu>
			</template>

			<template v-slot:item.currency="{ item }">
				<v-avatar :color="item.color" size="22" v-if="!item.logo">
					<v-img v-if="item.logo" class="elevation-6" :src="item.logo"></v-img>
					<span v-else class="white--text subtitle-2">
						{{ item.currency.charAt(0) }}
					</span>
				</v-avatar>
				<v-img
					v-else
					class="elevation-0 d-inline-flex"
					style="vertical-align: middle"
					:src="item.logo"
					max-height="22"
					max-width="22"
				/>
				<span class="ml-1">{{ item.currency }}</span>
			</template>

			<template v-slot:item.safe="{ item }">
				{{ BigNumber(item.safe).toString() }}
			</template>

			<template v-slot:item.trade="{ item }">
				{{ BigNumber(item.available).toString() }}
			</template>

			<template v-slot:item.withdraw="{ item }">
				{{ BigNumber(item.withdraw).toString() }}
			</template>

			<template v-slot:item.blocked="{ item }">
				{{ BigNumber(item.blocked).toString() }}
			</template>

			<template v-slot:item.state="{ item }">
				<span>{{ item.state }}</span>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import FiatDeposit from '../dialogs/balance/fiat/FiatDeposit';
import FiatWithdraw from '../dialogs/balance/fiat/FiatWithdraw';
import FiatTransferTrade from '../dialogs/balance/fiat/FiatTransferTrade';
import FiatTransferSafe from '../dialogs/balance/fiat/FiatTransferSafe';

export default {
	name: 'OwnFiatBalanceList',

	components: {
		FiatDeposit,
		FiatWithdraw,
		FiatTransferTrade,
		FiatTransferSafe,
	},

	data() {
		return {
			showOnlyNotNullBalances: false,
			tableCaption: this.$t('balance.headers.own_fiat_balance_list'),
			itemsPerPage: 10,
			headers: [
				{
					text: this.$t('balance.currency'),
					align: 'start',
					sortable: true,
					value: 'currency',
				},
				{ text: this.$t('balance.name'), value: 'name' },
				{ text: this.$t('balance.safe'), value: 'safe' },
				{
					text: this.$t('balance.trade'),
					value: 'trade',
				},
				{
					text: this.$t('balance.withdraw'),
					value: 'withdraw',
				},
				{
					text: this.$t('balance.blocked'),
					value: 'blocked',
				},
				{
					text: this.$t('balance.state'),
					value: 'state',
				},
				{
					text: this.$t('balance.actions'),
					value: 'action',
					sortable: false,
				},
			],
			footer_props: {
				'items-per-page-options': [5, 10, 30, 100, 500],
				'items-per-page-all-text': '500',
			},
			closeOnContentClick: true,
			actions: [
				{
					title: this.$t('balance.action.deposit'),
					name: 'deposit',
				},
				{
					title: this.$t('balance.action.withdraw'),
					name: 'withdraw',
				},
				{
					title: this.$t('balance.action.transfer_to_trade'),
					name: 'transfer_to_trade',
				},
				{
					title: this.$t('balance.action.transfer_to_safe'),
					name: 'transfer_to_safe',
				},
			],
		};
	},

	computed: {
		balances() {
			return this.$store.state.user.balances;
		},
		fiatBalances() {
			return this.showOnlyNotNullBalances
				? _.filter(this.balances, function(item) {
						return (
							item.type === 'fiat' &&
							(!BigNumber(item.safe).isZero() ||
								!BigNumber(item.available).isZero() ||
								!BigNumber(item.blocked).isZero() ||
								!BigNumber(item.withdraw).isZero())
						);
				  })
				: _.filter(this.balances, { type: 'fiat' });
		},
	},

	methods: {
		BigNumber(item) {
			return BigNumber(item);
		},
		menuItemExist(func) {
			return _.findIndex(this.actions, action => action.name === func) !== -1;
		},
		closeMenu(item) {
			item.menu = false;
		},
	},
};
</script>

<style scoped></style>