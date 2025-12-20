<template>
	<v-card class="own-lists-tabs-wrapper fill-height d-flex flex-column">
		<v-tabs v-model="selectedTab" class='small-tabs' :key="$i18n.locale" show-arrows>
			<v-tab :key="1">
				{{ $t('trading.headers.own_active_order_list') }}
			</v-tab>

			<v-tab :key="2">
				{{ $t('trading.headers.own_history_deal_list') }}
			</v-tab>

			<v-tab v-if="isMargin && marginAvailable" :key="3">
				{{ $t('trading.headers.own_active_position_list') }}
			</v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab" touchless class="fill-height">
			<v-tab-item :key="1" class="fill-height">
				<OwnActiveOrderList v-if="isLogged" class="fill-height" :currency="currency" :market="market" />
        <UnAuthLabel v-else />
			</v-tab-item>

			<v-tab-item :key="2" class="fill-height">
				<OwnHistoryDealList v-if="isLogged" class="fill-height" :currency="currency" :market="market" />
        <UnAuthLabel v-else />
			</v-tab-item>

			<v-tab-item v-if="isMargin && marginAvailable" :key="3" class="fill-height">
				<OwnActivePositionList v-if="isLogged" class="fill-height" :currency="currency" :market="market" />
        <UnAuthLabel v-else />
			</v-tab-item>
		</v-tabs-items>
	</v-card>
</template>

<script>
import OwnActiveOrderList from '@/components/trading/v2/user/tabs/OwnActiveOrderList.vue';
import OwnHistoryDealList from '@/components/trading/v2/user/tabs/OwnHistoryDealList.vue';
import OwnActivePositionList from '@/components/trading/v2/user/tabs/OwnActivePositionList.vue';

import config from '@/configs';
import {mapGetters} from "vuex";
import UnAuthLabel from "@/components/trading/v2/forms/common/UnAuthLabel.vue";

export default {
	name: 'OwnListsTabsWrapper',

	components: {UnAuthLabel, OwnActiveOrderList, OwnHistoryDealList, OwnActivePositionList },

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
	computed: {
    ...mapGetters({
      isLogged: 'app/isLogged',
    }),
		marginAvailable() {
			return config.product.type === 'full';
		},
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
