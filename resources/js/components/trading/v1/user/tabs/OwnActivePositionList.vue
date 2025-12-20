<template>
	<v-card class="own-active-position-list own-list pa-1" elevation="0">
		<v-card-title class="own-list__header pa-0">
			<span class="own-list__title component-title">
				{{ $t('trading.headers.own_active_position_list') }}
			</span>

			<v-spacer />

			<v-switch
				v-model="showOtherPairs"
				class="small-label-table-switch"
				:class="[$vuetify.rtl ? 'ml-3' : 'mr-3']"
				:label="$t('trading.show_other_pairs')"
				hide-details
				left
				dense
				inset
			/>

			<v-menu v-model="isCloseMenu" transition="slide-y-transition" content-class="small-text-menu" bottom>
				<template #activator="{ on, attrs }">
					<v-btn
						:class="[$vuetify.rtl ? 'mr-auto' : 'ml-auto']"
						color="#A6A6A6"
						v-bind="attrs"
						v-on="on"
						text
						tile
						small
					>
						{{ $t('common.close') }}
						<v-icon right>mdi-chevron-down</v-icon>
					</v-btn>
				</template>

				<v-list dense>
					<CommonDialog v-for="item in closeOptions" :key="item.text" @confirm="handleCloseConfirm(item)">
						<template #default>
							<v-list-item @click="closeCancelMenu">
								<v-list-item-title>{{ item.text }}</v-list-item-title>
							</v-list-item>
						</template>

						<template #title>
							{{ $t('trading.position.close_title') }}
						</template>

						<template #content>
							{{ $t('trading.position.close_many', { type: item.type }) }}
						</template>
					</CommonDialog>
				</v-list>
			</v-menu>
		</v-card-title>

		<v-card-text class="own-active-position-list__content pa-0 pt-1">
			<v-data-table
				mobile-breakpoint="960"
				:calculate-widths="true"
				:headers="headers"
				:items="ownPositionList"
				:items-per-page="itemsPerPage"
				:footer-props="footer_props"
				dense
			>
				<template #item.action="{ item }">
					<v-menu v-model="item.menu" offset-y>
						<template #activator="{ on }">
							<v-btn color="#a5a5a5c4" outlined depressed tile x-small v-on="on">
								{{ $t('table_header.actions') }}
								<v-icon right>mdi-chevron-down</v-icon>
							</v-btn>
						</template>

						<v-list dense>
							<TradingUserDialogPositionClose :id="item.id" @close-menu="closeMenu(item)" />
							<TradingUserDialogPositionAdd
								:id="item.id"
								:currency="item.currency.toUpperCase()"
								:market="item.market.toUpperCase()"
								:side="item.side"
								@close-menu="closeMenu(item)"
							/>
						</v-list>
					</v-menu>
				</template>

				<template #item.date="{ item }">
					<span class="table-date">
						{{ formatDate(item.created_at, 'trading') }}
					</span>
				</template>
				<template #item.valid_until="{ item }">
					<span class="table-date">
						{{ formatDate(item.valid_until, 'trading') }}
					</span>
				</template>

				<template #item.market="{ item }">
					<strong>{{ item.currency }}</strong>
					<span class="market-name">/{{ item.market }}</span>
				</template>

				<template #item.type="{ item }">
					<strong v-if="item.type === 'LONG POSITION'" class="success--text">
						{{ item.type }}
					</strong>
					<strong v-else class="error--text">{{ item.type }}</strong>
				</template>

				<template #item.filled="{ item }">
					{{ BigNumber(item.actual_size).toString() }}/{{ BigNumber(item.size).toString() }}
					{{ item.currency.toUpperCase() }} ({{ percent(item) }} %)
				</template>

				<template #item.realized="{ item }">
					{{ BigNumber(item.realized).toString() }}
					<span v-if="item.side">{{ item.market.toUpperCase() }}</span>
					<span v-else>{{ item.currency.toUpperCase() }}</span>
				</template>

				<template #item.credited="{ item }">
					{{ BigNumber(item.credited).toString() }}
					<span v-if="item.side">{{ item.currency.toUpperCase() }}</span>
					<span v-else>{{ item.market.toUpperCase() }}</span>
				</template>

				<template #item.credit_fee="{ item }">
					{{ BigNumber(item.credit_fee).toString() }}
					<span v-if="item.side">{{ item.currency.toUpperCase() }}</span>
					<span v-else>{{ item.market.toUpperCase() }}</span>
				</template>

				<template #item.credit_used="{ item }">
					{{ BigNumber(item.credit_used).toString() }}
					<span v-if="item.side">{{ item.currency.toUpperCase() }}</span>
					<span v-else>{{ item.market.toUpperCase() }}</span>
				</template>

				<template #item.blocked_funds="{ item }">
					{{ BigNumber(item.blocked_funds).toString() }}
					<span v-if="item.side">{{ item.currency.toUpperCase() }}</span>
					<span v-else>{{ item.market.toUpperCase() }}</span>
				</template>

				<template #item.margin_position="{ item }">
					<strong :class="marginPositionClass(item)">
						{{ BigNumber(item.margin_position).toString() }}
						<span v-if="item.side">{{ item.currency.toUpperCase() }}</span>
						<span v-else>{{ item.market.toUpperCase() }}</span></strong
					>
				</template>

				<template #item.margin_level="{ item }">
					<strong :class="marginLevelClass(item)">
						{{ marginLevel(item) }}
					</strong>
				</template>

				<template #item.status="{ item }">
					<span class="text--secondary" v-if="item.status === 'accepted'">
						{{ $t('trading.position.status.accepted') }}
					</span>
					<span class="warning--text" v-else-if="item.status === 'partiallyFilled'">
						{{ $t('trading.position.status.partiallyFilled') }}
					</span>
					<span class="success--text" v-else>
						{{ $t('trading.position.status.filled') }}
					</span>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import formatDate from '@/mixins/format/formatDate';

export default {
	name: 'OwnActivePositionList',

	components: {
		TradingUserDialogPositionAdd: () => import('@/components/trading/v1/user/dialog/TradingUserDialogPositionAdd.vue'),
		TradingUserDialogPositionClose: () => import('@/components/trading/v1/user/dialog/TradingUserDialogPositionClose.vue'),
		CommonDialog: () => import('@/components/common/CommonDialog.vue'),
	},

	mixins: [formatDate],

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

	data() {
		return {
			isCloseMenu: false,
			showOtherPairs: false,
			marginCallValue: 0.14,
			itemsPerPage: 10,
			footer_props: {
				'items-per-page-options': [5, 10, 15, 30, 50],
				'items-per-page-all-text': '50',
			},
		};
	},

	computed: {
		headers() {
			return [
				{
					text: this.$t('table_header.date'),
					align: 'start',
					sortable: true,
					value: 'date',
				},
				{
					text: this.$t('table_header.market'),
					value: 'market',
				},
				{ text: this.$t('table_header.type'), value: 'type' },
				{
					text: this.$t('table_header.filled'),
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
					text: this.$t('trading.credit_fee'),
					value: 'credit_fee',
				},
				{
					text: this.$t('trading.credit_used'),
					value: 'credit_used',
				},
				{
					text: this.$t('trading.blocked_funds'),
					value: 'blocked_funds',
				},
				{
					text: this.$t('trading.margin_position'),
					value: 'margin_position',
				},
				{
					text: this.$t('trading.margin_level'),
					value: 'margin_level',
				},
				{
					text: this.$t('trading.valid_until'),
					value: 'valid_until',
				},
				{
					text: this.$t('table_header.status'),
					value: 'status',
				},
				{
					text: this.$t('table_header.actions'),
					value: 'action',
					align: 'center',
					sortable: false,
				},
			];
		},

		closeOptions() {
			return [
				{
					text: this.$t('trading.position.close_all'),
					type: '',
					link: '/trader/ext/position/close_all',
					click: () => this.closeAllPositions(),
				},
				{
					text: this.$t('trading.position.close_long'),
					type: this.$t('trading.position.long_type'),
					link: '/trader/ext/position/close_all_long',
					click: () => this.closeAllLongPositions(),
				},
				{
					text: this.$t('trading.position.close_short'),
					type: this.$t('trading.position.short_type'),
					link: '/trader/ext/position/close_all_short',
					click: () => this.closeAllShortPositions(),
				},
			];
		},

		ownPositionList() {
			return this.showOtherPairs
				? this.$store.state.user.positions
				: _.filter(this.$store.state.user.positions, {
						currency: this.currency.toUpperCase(),
						market: this.market.toUpperCase(),
				  });
		},
		closePositionPayload() {
			return {
				market: this.market.toUpperCase(),
				currency: this.currency.toUpperCase(),
				all_pairs: this.showOtherPairs,
			};
		},
	},

	methods: {
		closeAllPositions() {
			axios.post('/trader/ext/position/close_all', this.closePositionPayload);
		},
		closeAllLongPositions() {
			axios.post('/trader/ext/position/close_all_long', this.closePositionPayload);
		},
		closeAllShortPositions() {
			axios.post('/trader/ext/position/close_all_short', this.closePositionPayload);
		},

		BigNumber(item) {
			return BigNumber(item);
		},
		marginPosition(item) {
			return BigNumber(item.margin_position);
		},
		marginLevel(item) {
			return BigNumber(item.blocked_funds)
				.plus(BigNumber(item.margin_position))
				.div(BigNumber(item.blocked_funds))
				.dp(2, 1)
				.toString();
		},
		marginLevelClass(item) {
			let marginLevel = this.marginLevel(item);
			return {
				'success--text': BigNumber(marginLevel).gte(1),
				'warning--text': BigNumber(marginLevel).gt(this.marginCallValue) && BigNumber(marginLevel).lt(1),
				'error--text': BigNumber(marginLevel).lte(this.marginCallValue),
			};
		},
		marginPositionClass(item) {
			let marginPosition = this.marginPosition(item);
			return {
				'success--text': BigNumber(marginPosition).gt(0),
				'error--text': BigNumber(marginPosition).lt(0),
				'text-default': BigNumber(marginPosition).eq(0),
			};
		},
		percent(item) {
			return BigNumber(item.actual_size)
				.times(100)
				.div(BigNumber(item.size))
				.dp(2)
				.toString();
		},
		closeMenu(item) {
			item.menu = false;
		},

		closeCancelMenu() {
			this.isCloseMenu = false;
		},
		handleCloseConfirm(item) {
			this.closeCancelMenu();
			item.click();
		},
	},
};
</script>
