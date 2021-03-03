<template>
	<v-card class="own-lists-tabs-wrapper">
		<v-tabs v-model="selectedTab">
			<v-tab :key="1">
				Активные ордера
			</v-tab>

			<v-tab :key="2">
				Ваши сделки
			</v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab">
			<v-tab-item :key="1">
				<OwnActiveOrderList :currency="currency" :market="market" />
			</v-tab-item>

			<v-tab-item :key="2">
				<OwnHistoryDealList :currency="currency" :market="market" />
			</v-tab-item>
		</v-tabs-items>
	</v-card>
</template>

<script>
import OwnActiveOrderList from './OwnActiveOrderList';
import OwnHistoryDealList from './OwnHistoryDealList';

export default {
	name: 'OwnListsTabsWrapper',

	components: { OwnActiveOrderList, OwnHistoryDealList },

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
			selectedTab: 0,
		};
	},
};
</script>

<style scoped lang="sass"></style>
