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
				<v-menu close-on-click offset-y v-model="item.menu" transition="slide-y-transition" bottom>
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
import { mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import WithdrawCancel from './WithdrawCancel';

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
			footer_props: {
				'items-per-page-options': [5, 10, 30, 100, 500],
				'items-per-page-all-text': '500',
			},
		};
	},

	computed: {
		headers() {
			return [
				{
					text: 'ID',
					align: 'start',
					sortable: true,
					value: 'id',
				},
				{ text: this.$t('table_header.date'), value: 'date' },
				{
					text: this.$t('table_header.currency'),
					value: 'currency',
				},
				{
					text: this.$t('table_header.amount'),
					value: 'amount',
				},
				{
					text: this.$t('table_header.actions'),
					value: 'action',
					sortable: false,
					align: 'center',
				},
			];
		},
	},

	methods: {
		...mapActions({
			fetchWithdrawalsStore: 'balance/fetchWithdrawals',
		}),

		async fetch() {
			this.withdrawals = await this.fetchWithdrawalsStore();
		},

		BigNumber(item) {
			return BigNumber(item);
		},
		closeMenu(item) {
			item.menu = false;
		},
	},

	created() {
		this.fetch();
	},
};
</script>
