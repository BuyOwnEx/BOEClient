<template>
	<v-container class="overview" fluid>
		<v-row align="start" justify="center">
			<v-col cols="12" class="overview__col text-center">
				<market-depth-graph
					:currency="selectedCurrency"
					:market="selectedMarket"
				/>
			</v-col>
		</v-row>
		<v-row align="start" justify="center">
			<v-col cols="12" class="overview__col text-center">
				<market-overview />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import CentrifugeOverviewMixin from '../../mixins/centrifugo-overview';
import MarketOverview from '../../components/overview/MarketOverview';
import MarketDepthGraph from '../../components/overview/MarketDepthGraph';

export default {
	name: 'Overview',

	mixins: [CentrifugeOverviewMixin],

	components: {
		MarketOverview,
		MarketDepthGraph,
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
	},

	mounted() {
		this.$store.commit('app/setAuthUser', { user: this.$user, vm: this });
	},
};
</script>

<style scoped lang="sass">
.overview
	padding: 0 24px !important
	&__col
		padding: 4px !important
</style>
