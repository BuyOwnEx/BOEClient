<template>
	<v-card class="own-lists-tabs-wrapper">
		<v-tabs v-model="selectedTab" class='small-tabs' :key="$i18n.locale" show-arrows>
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

		<v-tabs-items v-model="selectedTab" touchless>
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

<style lang="sass">
.own-lists-tabs-wrapper
	display: flex
	flex-flow: column
	flex-grow: 1
	.v-tabs
		flex-grow: 0

	.own-list
		&__header
			margin-left: 4px
		@media screen and (max-width: 599px)
			&__title
				width: 100%

	@media screen and (max-width: 959px)
		.v-data-table
			--page-paddings: 34px
			--title-height: 30px
			--bottom-nav-height: 56px

			min-height: calc(100vh - var(--app-header-height--mobile) - var(--app-footer-height--mobile) - var(--bottom-nav-height) - var(--title-height) - var(--small-tabs-height) - var(--page-paddings))
			display: flex
			flex-flow: column
		.v-data-footer
			margin-top: auto
</style>
