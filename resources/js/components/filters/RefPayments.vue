<template>
	<v-form>
		<v-container fluid>
			<v-row class="filter-top">
				<span class="pa-2 ml-2">Filters</span>
				<v-spacer />
				<v-btn icon @click="show = !show">
					<v-icon v-if="show">mdi-chevron-down</v-icon>
					<v-icon v-else>mdi-chevron-up</v-icon>
				</v-btn>
			</v-row>
			<v-row class="filter-main" v-if="show">
				<v-col cols="12" md="12" class="pt-6">
					<v-menu
						ref="menu"
						v-model="menu"
						:close-on-content-click="false"
						:return-value.sync="filters.dates"
						transition="scale-transition"
						min-width="290px"
						offset-y
					>
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								class="mt-2"
								v-model="computedDateFormatted"
								label="Choose date range"
								hint="Choose date range of referral payments"
								persistent-hint
								hide-details="auto"
								readonly
								v-bind="attrs"
								v-on="on"
							/>
						</template>
						<v-date-picker v-model="filters.dates" no-title scrollable range>
							<v-spacer />
							<v-btn text color="primary" @click="menu = false">Cancel</v-btn>
							<v-btn text color="primary" @click="setApplyEnable">OK</v-btn>
						</v-date-picker>
					</v-menu>
				</v-col>

				<v-col cols="12" md="12">
					<v-autocomplete
						v-model="filters.follower"
						@change="setEnabled"
						:items="followers"
						:loading="loadingFollowers"
						:search-input.sync="searchFollowers"
						hint="Start typing login to search follower"
						persistent-hint
						hide-no-data
						item-text="name"
						item-value="id"
						label="Follower"
						clearable
					/>
				</v-col>

				<v-col cols="12" md="12">
					<v-select
						v-model="filters.currency"
						@change="setEnabled"
						:items="all_currencies"
						item-text="currency"
						item-value="currency"
						label="Currency"
						hint="Select currency from available options"
						persistent-hint
						hide-details="auto"
						clearable
					/>
				</v-col>
			</v-row>
			<v-row class="filter-bottom" v-if="show">
				<v-btn
					class="ma-2"
					tile
					color="primary"
					:disabled="disabled"
					@click="setFilter"
				>
					Apply
				</v-btn>

				<v-btn class="ma-2" tile outlined color="grey" @click="resetFilter">
					Reset
				</v-btn>
			</v-row>
		</v-container>
	</v-form>
</template>

<script>
import debounce from 'debounce';

export default {
	name: 'RefPayments',

	props: ['all_currencies'],

	data() {
		return {
			show: true,
			disabled: true,
			menu: false,
			filters: {
				dates: [
					moment()
						.startOf('month')
						.format('YYYY-MM-DD'),
					moment().format('YYYY-MM-DD'),
				],
				follower: null,
				currency: null,
			},
			followers: [],
			searchFollowers: '',
			loadingFollowers: false,
			currencies: this.all_currencies,
		};
	},

	computed: {
		computedDateFormatted() {
			return this.formatDate(this.filters.dates);
		},
		filterData() {
			return {
				start: this.filters.dates[0],
				end: this.filters.dates[1],
				follower: this.filters.follower,
				currency: this.filters.currency,
			};
		},
	},

	watch: {
		searchFollowers(value) {
			if (!value) {
				return;
			}
			debounce(this.makeFollowerSearch, 200)(value, this);
		},
	},

	methods: {
		makeFollowerSearch: async (value, self) => {
			// Handle empty value
			if (!value) {
				self.followers = [];
				self.filters.follower = '';
			}
			// Items have already been requested
			if (self.loadingFollowers) {
				return;
			}
			self.loadingFollowers = true;

			// YOUR AJAX Methods go here
			// if you prefer not to use vue-api-query
			await axios
				.get('/trader/ext/all_followers', {
					params: { name: value },
				})
				.then(response => {
					self.followers = response.data.users;
				})
				.catch(error => {
					console.log(error);
				})
				.finally(() => (self.loadingFollowers = false));
		},
		setApplyEnable() {
			this.$refs.menu.save(this.filters.dates);
			if (
				this.filters.dates[0] !== undefined &&
				this.filters.dates[1] !== undefined
			)
				this.disabled = false;
		},
		formatDate(dates) {
			if (!dates) return null;
			return `${dates[0] === undefined ? 'YYYY-MM-DD' : dates[0]} - ${
				dates[1] === undefined ? 'YYYY-MM-DD' : dates[1]
			}`;
		},
		setEnabled() {
			this.disabled = false;
		},
		setFilter() {
			this.$emit('apply-table-filter', this.filterData);
			this.disabled = true;
			localStorage.referralPaymentFilters = JSON.stringify(this.filters);
		},
		resetFilter() {
			this.filters.dates = [
				moment()
					.startOf('month')
					.format('YYYY-MM-DD'),
				moment().format('YYYY-MM-DD'),
			];
			this.filters.user = null;
			this.filters.follower = null;
			this.filters.currency = null;
			this.$emit('reset-table-filter', this.filterData);
			this.disabled = true;
			localStorage.removeItem('referralPaymentFilters');
		},
	},

	mounted() {
		if (localStorage.referralPaymentFilters) {
			let saved_filters = JSON.parse(localStorage.referralPaymentFilters);
			this.filters.dates = saved_filters.dates;
			this.filters.follower = saved_filters.follower;
			this.filters.currency = saved_filters.currency;
			this.$emit('table-filter', this.filterData);
		}
	},
};
</script>

<style scoped></style>
