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
					<div class="component-title">{{ $t('balance.headers.own_active_withdraw_list') }}</div>
				</v-toolbar>
			</template>

			<template v-slot:item.action="{ item }">
				<v-menu close-on-click offset-y v-model="item.menu" transition="slide-y-transition" bottom>
					<template v-slot:activator="{ on }">
						<v-btn color="#A6A6A6" v-on="on" text tile small>
							{{ $t('table_header.actions') }}
							<v-icon right>mdi-chevron-down</v-icon>
						</v-btn>
					</template>

					<v-list dense>
						<WithdrawCancel :withdrawObj="item" @close-menu="closeMenu(item)" />
					</v-list>
				</v-menu>
			</template>

			<template #item.date="{item}">
				{{ formatDate(item.date, 'dateOnly') + ' ' + formatDate(item.date, 'timeOnly') }}
			</template>

			<template v-slot:item.currency="{ item }">
				<v-img
					v-if="getImage(item.currency)"
					class="elevation-0 d-inline-flex vertical-middle"
					:src="getImage(item.currency)"
					max-height="22"
					max-width="22"
				/>

				<v-avatar class="white--text subtitle-2" :color="getCurrencyColor(item.currency)" size="22" v-else>
					{{ item.currency.charAt(0) }}
				</v-avatar>

				<span class="ml-1">{{ item.currency }}</span>
			</template>

			<template v-slot:item.amount="{ item }">
				{{ BigNumber(item.amount).toString() }}
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import formatDate from '../../../mixins/format/formatDate';

export default {
	name: 'BalanceWithdrawalList',

	components: {
		WithdrawCancel: () => import(/* webpackPrefetch: true */ './WithdrawCancel'),
	},

	mixins: [formatDate],

	props: {
		list: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			withdrawals: this.list,
			itemsPerPage: 5,
			footer_props: {
				'items-per-page-options': [5, 10, 30, 100, 500],
				'items-per-page-all-text': '500',
			},
		};
	},

	computed: {
		...mapState({
			userBalances: state => state.user.balances
		}),

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

	watch: {
		list(val) {
			this.withdrawals = val;
		},
	},

	methods: {
		getImage(currency) {
			return this.userBalances[currency].logo;
		},
		getCurrencyColor(currency) {
			return this.userBalances[currency].color;
		},

		BigNumber(item) {
			return BigNumber(item);
		},
		closeMenu(item) {
			item.menu = false;
		},
	},
};
</script>
