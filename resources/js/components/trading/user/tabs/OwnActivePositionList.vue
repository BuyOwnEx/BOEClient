<template>
	<v-card clas="own-active-position-list pa-1">
		<v-card-title class="own-active-position-list__header pa-0"></v-card-title>
		<v-card-text class="own-active-position-list__content pa-0"></v-card-text>
		<v-data-table
			:calculate-widths="true"
			:headers="headers"
			:items="ownPositionList"
			:items-per-page="itemsPerPage"
			:footer-props="footer_props"
			dense
		>
			<template v-slot:top>
				<v-toolbar flat dense class="mt-2">
					<v-toolbar-title>{{ tableCaption }}</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-switch
						v-model="showOtherPairs"
						class="mr-3"
						hide-details
						height="14"
						left
						inset
						:label="$t('trading.show_other_pairs')"
					></v-switch>
					<v-menu transition="slide-y-transition" bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								tile
								outlined
								small
								color="#A6A6A6"
								v-bind="attrs"
								v-on="on"
							>
								{{ $t('trading.close') }}
								<v-icon right>mdi-chevron-down</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item
								dense
								v-for="(item, i) in closeOptions"
								:key="i"
								@click="item.click"
							>
								<v-list-item-title>{{ item.text }}</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-toolbar>
			</template>

			<template v-slot:item.action="{ item }">
				<v-menu close-on-click offset-y v-model="item.menu">
					<template v-slot:activator="{ on }">
						<v-btn tile outlined x-small color="#A6A6A6" v-on="on">
							{{ $t('trading.actions') }}
							<v-icon right>mdi-chevron-down</v-icon>
						</v-btn>
					</template>
					<v-list dense>
						<position-close
							:id="item.id"
							v-on:closeMenu="closeMenu(item)"
						></position-close>
						<position-add-funds
							:id="item.id"
							:currency="item.currency"
							:market="item.market"
							:side="item.side"
							v-on:closeMenu="closeMenu(item)"
						></position-add-funds>
					</v-list>
				</v-menu>
			</template>

			<template v-slot:item.date="{ item }">
				<span class="table-date">
					{{ item.createdAt }}
				</span>
			</template>

			<template v-slot:item.market="{ item }">
				<strong>{{ item.currency }}</strong
				><span class="market-name">/{{ item.market }}</span>
			</template>

			<template v-slot:item.type="{ item }">
				<strong v-if="item.type === 'LONG POSITION'" class="text-success">{{
					item.type
				}}</strong>
				<strong v-else class="text-danger">{{ item.type }}</strong>
			</template>

			<template v-slot:item.filled="{ item }">
				{{ BigNumber(item.actualSize).toString() }}/{{
					BigNumber(item.size).toString()
				}}
				{{ item.currency.toUpperCase() }} ({{ percent(item) }} %)
			</template>

			<template v-slot:item.realized="{ item }">
				{{ BigNumber(item.realized).toString() }}
				<span v-if="item.side">{{ item.market.toUpperCase() }}</span
				><span v-else>{{ item.currency.toUpperCase() }}</span>
			</template>

			<template v-slot:item.credited="{ item }">
				{{ BigNumber(item.credited).toString() }}
				<span v-if="item.side">{{ item.currency.toUpperCase() }}</span
				><span v-else>{{ item.market.toUpperCase() }}</span>
			</template>

			<template v-slot:item.creditFee="{ item }">
				{{ BigNumber(item.creditFee).toString() }}
				<span v-if="item.side">{{ item.currency.toUpperCase() }}</span
				><span v-else>{{ item.market.toUpperCase() }}</span>
			</template>

			<template v-slot:item.creditUsed="{ item }">
				{{ BigNumber(item.creditUsed).toString() }}
				<span v-if="item.side">{{ item.currency.toUpperCase() }}</span
				><span v-else>{{ item.market.toUpperCase() }}</span>
			</template>

			<template v-slot:item.blockedFunds="{ item }">
				{{ BigNumber(item.blockedFunds).toString() }}
				<span v-if="item.side">{{ item.currency.toUpperCase() }}</span
				><span v-else>{{ item.market.toUpperCase() }}</span>
			</template>

			<template v-slot:item.marginPosition="{ item }">
				<strong :class="marginPositionClass(item)"
					>{{ BigNumber(item.marginPosition).toString() }}
					<span v-if="item.side">{{ item.currency.toUpperCase() }}</span
					><span v-else>{{ item.market.toUpperCase() }}</span></strong
				>
			</template>

			<template v-slot:item.marginLevel="{ item }">
				<strong :class="marginLevelClass(item)">{{ marginLevel(item) }}</strong>
			</template>

			<template v-slot:item.status="{ item }">
				<span class="text-muted" v-if="item.status === 'accepted'">{{
					$t('trading.position.status.accepted')
				}}</span>
				<span class="text-warning" v-else-if="item.status === 'partiallyFilled'"
					>{{ $t('trading.position.status.partiallyFilled') }}
				</span>
				<span class="text-success" v-else
					>{{ $t('trading.position.status.filled') }}
				</span>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import positionClose from '../../../dialogs/trading/PositionClose';
import positionAddFunds from '../../../dialogs/trading/PositionAddFunds';

export default {
	name: 'OwnActivePositionList',

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
	},

	components: {
		positionClose,
		positionAddFunds,
	},

	data() {
		return {
			showOtherPairs: false,
			marginCallValue: 0.14,
			tableCaption:
				this.$t('trading.headers.own_active_position_list') +
				' ' +
				this.currency +
				'/' +
				this.market,
			itemsPerPage: 5,
			headers: [
				{
					text: this.$t('trading.date'),
					align: 'start',
					sortable: true,
					value: 'date',
				},
				{
					text: this.$t('trading.market'),
					value: 'market',
				},
				{ text: this.$t('trading.type'), value: 'type' },
				{
					text: this.$t('trading.filled'),
					value: 'filled',
				},
				{
					text: this.$t('trading.realized'),
					value: 'realized',
				},
				{
					text: this.$t('trading.credited'),
					value: 'credited',
				},
				{
					text: this.$t('trading.creditFee'),
					value: 'creditFee',
				},
				{
					text: this.$t('trading.creditUsed'),
					value: 'creditUsed',
				},
				{
					text: this.$t('trading.blockedFunds'),
					value: 'blockedFunds',
				},
				{
					text: this.$t('trading.marginPosition'),
					value: 'marginPosition',
				},
				{
					text: this.$t('trading.marginLevel'),
					value: 'marginLevel',
				},
				{
					text: this.$t('trading.validUntil'),
					value: 'validUntil',
				},
				{
					text: this.$t('trading.status'),
					value: 'status',
				},
				{
					text: this.$t('trading.actions'),
					value: 'action',
					sortable: false,
				},
			],
			footer_props: {
				'items-per-page-options': [5, 10, 15, 30, 50],
				'items-per-page-all-text': '50',
			},
			closeOnContentClick: true,
			closeOptions: [
				{
					text: this.$t('trading.position.close_all'),
					link: '/trader/ext/position/close_all',
					click: () => {
						axios.post('/trader/ext/position/close_all', {
							market: this.market.toUpperCase(),
							currency: this.currency.toUpperCase(),
							all_pairs: this.showOtherPairs,
						});
					},
				},
				{
					text: this.$t('trading.position.close_long'),
					link: '/trader/ext/position/close_all_long',
					click: () => {
						axios.post('/trader/ext/position/close_all_long', {
							market: this.market.toUpperCase(),
							currency: this.currency.toUpperCase(),
							all_pairs: this.showOtherPairs,
						});
					},
				},
				{
					text: this.$t('trading.position.close_short'),
					link: '/trader/ext/position/close_all_short',
					click: () => {
						axios.post('/trader/ext/position/close_all_short', {
							market: this.market.toUpperCase(),
							currency: this.currency.toUpperCase(),
							all_pairs: this.showOtherPairs,
						});
					},
				},
			],
		};
	},

	computed: {
		ownPositionList() {
			return this.showOtherPairs
				? this.$store.state.user.positions
				: _.filter(this.$store.state.user.positions, {
						currency: this.currency.toUpperCase(),
						market: this.market.toUpperCase(),
				  });
		},
	},

	methods: {
		BigNumber(item) {
			return BigNumber(item);
		},
		marginPosition(item) {
			return BigNumber(item.marginPosition);
		},
		marginLevel(item) {
			return BigNumber(item.blockedFunds)
				.plus(BigNumber(item.marginPosition))
				.div(BigNumber(item.blockedFunds))
				.dp(2, 1)
				.toString();
		},
		marginLevelClass(item) {
			let marginLevel = this.marginLevel(item);
			return {
				'text-success': BigNumber(marginLevel).gte(1),
				'text-warning':
					BigNumber(marginLevel).gt(this.marginCallValue) &&
					BigNumber(marginLevel).lt(1),
				'text-danger': BigNumber(marginLevel).lte(this.marginCallValue),
			};
		},
		marginPositionClass(item) {
			let marginPosition = this.marginPosition(item);
			return {
				'text-success': BigNumber(marginPosition).gt(0),
				'text-danger': BigNumber(marginPosition).lt(0),
				'text-default': BigNumber(marginPosition).eq(0),
			};
		},
		percent(item) {
			return BigNumber(item.actualSize)
				.times(100)
				.div(BigNumber(item.size))
				.dp(2)
				.toString();
		},
		closeMenu(item) {
			item.menu = false;
		},
	},
};
</script>

<style scoped lang="sass">
.own-active-position-list
	&__header
		margin-left: 4px
</style>
