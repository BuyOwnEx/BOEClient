<template>
	<v-card>
		<v-data-table
			:calculate-widths="true"
			:headers="headers"
			:items="fiatBalances"
			:items-per-page="itemsPerPage"
			:footer-props="footer_props"
			dense
		>
			<template v-slot:top>
				<v-toolbar flat dense>
					<div class="component-title">{{ componentTitle }}</div>

					<v-spacer />

					<v-switch
						v-model="showOnlyNotNullBalances"
						class="small-label-table-switch mr-sm-3"
						:label="$t('balance.show_only_not_null_balances')"
						hide-details
						left
						dense
						inset
					/>
				</v-toolbar>
			</template>

			<template v-slot:item.action="{ item }">
				<v-menu v-model="item.menu" transition="slide-y-transition" close-on-click offset-y bottom>
					<template v-slot:activator="{ on }">
						<v-btn color="#A6A6A6" v-on="on" text tile small>
							{{ $t('trading.actions') }}
							<v-icon right>mdi-chevron-down</v-icon>
						</v-btn>
					</template>

					<v-list dense>
						<BalanceFiatDialogReplenish
							v-if="isReplenish(item.state)"
							:currency-obj="item"
							@close-menu="closeMenu(item)"
						/>
						<BalanceFiatDialogWithdraw
							v-if="isWithdraw(item.state)"
							:currency-obj="item"
							@close-menu="closeMenu(item)"
						/>
						<BalanceDialogTransfer type="trade" wallet="fiat" :currency-obj="item" @close-menu="closeMenu(item)" />
						<BalanceDialogTransfer type="safe" wallet="fiat" :currency-obj="item" @close-menu="closeMenu(item)" />
					</v-list>
				</v-menu>
			</template>

			<template v-slot:item.currency="{ item }">
				<v-avatar v-if="!item.logo" :color="item.color" size="22">
					<v-img v-if="item.logo" class="elevation-6" :src="item.logo" />
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

			<template v-slot:item.replenishment="{ item }">
				<CommonTooltip>
					<v-icon :color="getStateIconColor(item.state, 'replenishment')">
						{{ getStateIconName(item.state, 'replenishment') }}
					</v-icon>

					<template #text>
						{{ getStateTextStatus(item.state, 'replenishment') }}
					</template>
				</CommonTooltip>
			</template>

			<template v-slot:item.withdrawal="{ item }">
				<CommonTooltip>
					<v-icon :color="getStateIconColor(item.state, 'withdrawal')">
						{{ getStateIconName(item.state, 'withdrawal') }}
					</v-icon>

					<template #text>
						{{ getStateTextStatus(item.state, 'withdrawal') }}
					</template>
				</CommonTooltip>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import balanceStateMethodsMixin from '../../../mixins/balance/balanceStateMethodsMixin';

export default {
	name: 'BalanceFiatList',

	components: {
		BalanceFiatDialogReplenish: () => import(/* webpackPrefetch: true */ './dialog/BalanceFiatDialogReplenish'),
		BalanceFiatDialogWithdraw: () => import(/* webpackPrefetch: true */ './dialog/BalanceFiatDialogWithdraw'),
		BalanceDialogTransfer: () => import(/* webpackPrefetch: true */ '../common/BalanceDialogTransfer'),
		CommonTooltip: () => import(/* webpackPrefetch: true */ '../../common/CommonTooltip'),
	},

	mixins: [balanceStateMethodsMixin],

	data() {
		return {
			showOnlyNotNullBalances: false,
			componentTitle: this.$t('balance.headers.own_fiat_balance_list'),
			itemsPerPage: 10,
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
					text: this.$t('table_header.currency'),
					align: 'start',
					sortable: true,
					value: 'currency',
				},
				{ text: this.$t('table_header.name'), value: 'name' },
				{ text: this.$t('table_header.safe'), value: 'safe' },
				{
					text: this.$t('table_header.trade'),
					value: 'trade',
				},
				{
					text: this.$t('table_header.withdraw'),
					value: 'withdraw',
				},
				{
					text: this.$t('table_header.blocked'),
					value: 'blocked',
				},
				{
					text: this.$t('common.replenishment'),
					value: 'replenishment',
				},
				{
					text: this.$t('common.withdrawal'),
					value: 'withdrawal',
				},
				{
					text: this.$t('table_header.actions'),
					value: 'action',
					sortable: false,
					align: 'center',
				},
			];
		},

		balances() {
			return this.$store.state.user.balances;
		},
		fiatBalances() {
			return this.showOnlyNotNullBalances
				? _.filter(this.balances, item => {
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
		closeMenu(item) {
			item.menu = false;
		},
	},
};
</script>
