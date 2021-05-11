<template>
	<v-container class="overview" fluid>
		<v-row align="start" justify="center">
			<v-col cols="12" class="overview__col overview__col--graph text-center">
				<OverviewDepthGraph
					:currency="selectedCurrency"
					:market="selectedMarket"
				/>
			</v-col>
		</v-row>

		<v-row align="start" justify="center">
			<v-col cols="12" class="overview__col text-center">
				<OverviewTable />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import CentrifugeOverviewMixin from '../../mixins/centrifugo-overview';
import OverviewTable from '../../components/overview/OverviewTable';
import OverviewDepthGraph from '../../components/overview/OverviewDepthGraph';

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
