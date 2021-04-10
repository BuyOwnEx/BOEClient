<template>
	<v-card>
		<v-data-table
			:calculate-widths="true"
			:headers="headers"
			:items="withdrawals"
			:items-per-page="itemsPerPage"
			:footer-props="footer_props"
			dense
		>
			<template v-slot:top>
				<v-toolbar flat dense>
					<div class="component-title">{{ componentTitle }}</div>
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
						<v-btn color="#A6A6A6" v-on="on" text tile small>
							{{ $t('trading.actions') }}
							<v-icon right>mdi-chevron-down</v-icon>
						</v-btn>
					</template>

					<v-list dense>
<!--						<crypto-deposit-->
<!--							v-if="menuItemExist('cancel_withdraw')"-->
<!--							:withdrawObj="item"-->
<!--							v-on:closeMenu="closeMenu(item)"-->
<!--						/>-->
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

			<template v-slot:item.amount="{ item }">
				{{ BigNumber(item.amount).toString() }}
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import WithdrawCancel from '../dialogs/balance/withdraw/WithdrawCancel';

export default {
	name: 'OwnWithdrawalList',

	components: {
		WithdrawCancel,
	},

	data() {
		return {
			withdrawals: [],
			componentTitle: this.$t('balance.headers.own_active_withdraw_list'),
			itemsPerPage: 5,
			headers: [
				{
					text: 'ID',
					align: 'start',
					sortable: true,
					value: 'id',
				},
				{ text: this.$t('balance.date'), value: 'date' },
				{
					text: this.$t('balance.currency'),
					value: 'currency',
				},
				{
					text: this.$t('balance.amount'),
					value: 'amount',
				},
				{
					text: this.$t('balance.actions'),
					value: 'action',
					sortable: false,
					align: 'center',
				},
			],
			footer_props: {
				'items-per-page-options': [5, 10, 30, 100, 500],
				'items-per-page-all-text': '500',
			},
			closeOnContentClick: true,
			actions: [
				{
					title: this.$t('balance.action.cancel_withdraw'),
					name: 'cancel_withdraw',
				},
			],
		};
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

	mounted() {
		axios.get('/trader/ext/balance/all-withdrawals').then(response => {
			if (_.get(response, 'data.success') === true) {
				this.withdrawals = response.data.withdrawals;
			}
		});
	},
};
</script>
