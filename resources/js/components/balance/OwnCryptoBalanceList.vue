<template>
	<v-card>
		<v-data-table
			:calculate-widths="true"
			:headers="headers"
			:items="cryptoBalances"
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
				<v-menu
					v-model="item.menu"
					transition="slide-y-transition"
					close-on-click
					offset-y
					bottom
				>
					<template v-slot:activator="{ on }">
						<v-btn color="#A6A6A6" v-on="on" text tile small>
							{{ $t('trading.actions') }}
							<v-icon right>mdi-chevron-down</v-icon>
						</v-btn>
					</template>

					<v-list dense>
						<BalanceDialogReplenish
							v-if="isReplenish(item.state)"
							:address="item.address"
							:currency-object="item"
							@close-menu="closeMenu(item)"
						/>
						<BalanceDialogWithdraw
							v-if="isWithdraw(item.state)"
							:crypto-obj="item"
							@close-menu="closeMenu(item)"
						/>
						<BalanceDialogTrade
							:crypto-obj="item"
							@close-menu="closeMenu(item)"
						/>
						<BalanceDialogSafe
							:crypto-obj="item"
							@close-menu="closeMenu(item)"
						/>
					</v-list>
				</v-menu>
			</template>

			<template v-slot:item.currency="{ item }">
				<v-avatar :color="item.color" size="22" v-if="!item.logo">
					<v-img
						v-if="item.logo"
						class="elevation-6"
						:src="getImage(item.logo)"
					/>
					<span v-else class="white--text subtitle-2">
						{{ item.currency.charAt(0) }}
					</span>
				</v-avatar>
				<v-img
					v-else
					class="elevation-0 d-inline-flex"
					style="vertical-align: middle"
					:src="getImage(item.logo)"
					max-height="22"
					max-width="22"
				/>
				<span class="ml-1">{{ item.currency }}</span>
			</template>

			<template v-slot:item.type="{ item }">
				<v-badge
					v-if="item.type === 'token'"
					color="grey lighten-1"
					:content="item.platform"
				>
					{{ item.type }}
				</v-badge>
				<span v-else>{{ item.type }}</span>
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
						{{ getStateTitle(item.state) }}
					</template>
				</CommonTooltip>
			</template>

			<template v-slot:item.withdrawal="{ item }">
				<CommonTooltip>
					<v-icon :color="getStateIconColor(item.state, 'withdrawal')">
						{{ getStateIconName(item.state, 'withdrawal') }}
					</v-icon>

					<template #text>
						{{ getStateTitle(item.state) }}
					</template>
				</CommonTooltip>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	name: 'OwnCryptoBalanceList',

	components: {
		BalanceDialogReplenish: () =>
			import(/* webpackPrefetch: true */ './dialog/BalanceDialogReplenish'),
		BalanceDialogWithdraw: () =>
			import(/* webpackPrefetch: true */ './dialog/BalanceDialogWithdraw'),
		BalanceDialogTrade: () =>
			import(/* webpackPrefetch: true */ './dialog/BalanceDialogTrade'),
		BalanceDialogSafe: () =>
			import(/* webpackPrefetch: true */ './dialog/BalanceDialogSafe'),
		CommonTooltip: () =>
			import(/* webpackPrefetch: true */ '../common/CommonTooltip'),
	},

	props: {
		stateTypes: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			showOnlyNotNullBalances: false,
			componentTitle: this.$t('balance.headers.own_crypto_balance_list'),
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
					text: this.$t('common.replenishment'),
					value: 'replenishment',
				},
				{
					text: this.$t('common.withdrawal'),
					value: 'withdrawal',
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
		cryptoBalances() {
			return this.showOnlyNotNullBalances
				? _.filter(this.balances, function(item) {
						return (
							(item.type === 'coin' || item.type === 'token') &&
							(!BigNumber(item.safe).isZero() ||
								!BigNumber(item.available).isZero() ||
								!BigNumber(item.blocked).isZero() ||
								!BigNumber(item.withdraw).isZero())
						);
				  })
				: _.filter(this.balances, function(item) {
						return item.type === 'coin' || item.type === 'token';
				  });
		},
	},

	methods: {
		isReplenish(state) {
			const everythingIsOk = state === 1;
			const onlyReplenish = state === 3;
			return everythingIsOk || onlyReplenish;
		},
		isWithdraw(state) {
			const everythingIsOk = state === 1;
			const onlyWithdraw = state === 2;
			return everythingIsOk || onlyWithdraw;
		},
		getStateIconName(state, type) {
			const status = this.stateTypes.find(t => t.id === state);
			const iconType = `${type}Icon`;
			return status[iconType].name;
		},
		getStateIconColor(state, type) {
			const status = this.stateTypes.find(t => t.id === state);
			const iconType = `${type}Icon`;
			return status[iconType].color;
		},
		getStateTitle(state) {
			const status = this.stateTypes.find(t => t.id === state);
			return status.title;
		},

		BigNumber(item) {
			return BigNumber(item);
		},
		closeMenu(item) {
			item.menu = false;
		},
		getImage(img) {
			return '/' + img;
		},
	},
};
</script>
