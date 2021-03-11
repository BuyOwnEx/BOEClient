<template>
	<v-card class="own-lists-tabs-wrapper">
		<v-tabs v-model="selectedTab">
			<v-tab :key="1">
				{{ $t('trading.headers.own_active_order_list') }}
			</v-tab>

			<v-tab :key="2">
				{{ $t('trading.headers.own_history_deal_list') }}
			</v-tab>

			<v-tab v-if="isMargin" :key="3">
				{{ $t('trading.headers.own_active_position_list') }}
			</v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab">
			<v-tab-item :key="1">
				<OwnActiveOrderList :currency="currency" :market="market" />
			</v-tab-item>

			<v-tab-item :key="2">
				<OwnHistoryDealList :currency="currency" :market="market" />
			</v-tab-item>

			<v-tab-item v-if="isMargin" :key="3">
				<OwnActivePositionList :currency="currency" :market="market" />
			</v-tab-item>
		</v-tabs-items>
	</v-card>
</template>

<script>
import OwnActiveOrderList from './tabs/OwnActiveOrderList';
import OwnHistoryDealList from './tabs/OwnHistoryDealList';
import OwnActivePositionList from './tabs/OwnActivePositionList';

export default {
	name: 'OwnListsTabsWrapper',

	components: { OwnActiveOrderList, OwnHistoryDealList, OwnActivePositionList },

	props: {
		isMargin: {
			type: Boolean,
			required: true,
		},
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
			selectedTab: 0,
		};
	},
};
</script>

<style scoped lang="sass"></style>
