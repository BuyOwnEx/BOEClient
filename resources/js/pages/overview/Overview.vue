<template>
	<v-container class="overview d-flex flex-column" fluid>
		<v-row align="start" justify="center" class="flex-grow-0">
			<v-col cols="12" class="overview__col overview__col--graph text-center">
				<OverviewDepthGraph
					:currency="selectedCurrency"
					:market="selectedMarket"
				/>
			</v-col>
		</v-row>

		<v-row align="start" justify="center" class="flex-grow-1">
			<v-col cols="12" class="overview__col text-center fill-height">
				<OverviewTable class="fill-height" />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import CentrifugeOverviewMixin from '@/mixins/centrifugo-overview';
import OverviewTable from '@/components/overview/OverviewTable.vue';
import OverviewDepthGraph from '@/components/overview/OverviewDepthGraph.vue';

export default {
	name: 'Overview',

	mixins: [CentrifugeOverviewMixin],

	components: {
		OverviewTable,
		OverviewDepthGraph,
	},

	computed: {
		selectedMarket() {
			return this.$store.state.trading.selectedMarket;
		},
		selectedCurrency() {
			return this.$store.state.trading.selectedCurrency;
		},
		isLogged() {
			return this.$store.getters['app/isLogged'];
		},
		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},
	},

	created() {
		if (
			this.$store.state.trading.selectedMarket === null ||
			this.$store.state.trading.selectedCurrency === null
		) {
			this.$store.commit('trading/setPair', {
				currency: this.$trading_currency,
				market: this.$trading_market,
			});
		}
        if (this.$spa)
            this.$store.commit('app/setAuthUser', { user: this.$user, vm: this });
	}
};
</script>

<style scoped lang="sass">
.overview
	padding: 0 24px !important
	&__col
		padding: 0 !important
		&--graph
			padding-bottom: 5px !important
</style>
