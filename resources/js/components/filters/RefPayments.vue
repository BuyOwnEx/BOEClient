<template>
	<v-form>
		<v-container class="pa-0" fluid>
			<FiltersTitle :show="show" @toggle-filters="show = !show" />

			<v-row class="filter-main" v-if="show" no-gutters>
				<v-col class="px-1" cols="12" sm="4" md="4">
					<v-menu
						ref="menu"
						v-model="menu"
						:close-on-content-click="false"
						:return-value.sync="filters.dates"
						transition="scale-transition"
						min-width="290px"
						offset-y
					>
						<template #activator="{ on, attrs }">
							<v-text-field
								v-model="computedDateFormatted"
								:label="$t('reports.date_range')"
								:hint="$t('reports.date_range_hint')"
								persistent-hint
								hide-details="auto"
								readonly
								v-bind="attrs"
								v-on="on"
							/>
						</template>
						<v-date-picker v-model="filters.dates" color="primary" no-title scrollable range>
							<v-spacer />
							<v-btn text color="primary" @click="menu = false">{{ $t('common.cancel') }}</v-btn>
							<v-btn text color="primary" @click="setApplyEnable">{{ $t('common.apply') }}</v-btn>
						</v-date-picker>
					</v-menu>
				</v-col>

				<v-col class="px-1" cols="12" sm="4" md="4">
					<v-autocomplete
						v-model="filters.follower"
						:items="followers"
						:loading="loadingFollowers"
						:search-input.sync="searchFollowers"
						:label="$t('reports.ref')"
						:hint="$t('reports.ref_hint')"
						item-text="name"
						item-value="id"
						persistent-hint
						hide-no-data
						clearable
						@change="setEnabled"
					/>
				</v-col>

				<v-col class="px-1" cols="12" sm="4" md="4">
					<v-select
						v-model="filters.currency"
						:items="all_currencies"
						:label="$t('reports.currency')"
						:hint="$t('reports.currency_hint')"
						item-text="currency"
						item-value="currency"
						hide-details="auto"
						persistent-hint
						clearable
						@change="setEnabled"
					/>
				</v-col>
			</v-row>

			<FiltersFooter v-if="show" :disabled="disabled" @reset="resetFilter" @set="setFilter" />
		</v-container>
	</v-form>
</template>

<script>
import debounce from 'debounce';

import FiltersTitle from '@/components/filters/parts/FiltersTitle.vue';
import FiltersFooter from '@/components/filters/parts/FiltersFooter.vue';

export default {
	name: 'RefPayments',

	components: { FiltersFooter, FiltersTitle },

	props: ['all_currencies'],

	data() {
		return {
			show: true,
			disabled: true,
			menu: false,
			filters: {
				dates: [
          this.$moment()
						.startOf('month')
						.format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD'),
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
			debounce(this.makeFollowerSearch, 300)(value, this);
		},
		show() {
			this.$emit('toggleFiltersShow');
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

			await axios
				.get('/trader/ext/all_followers', {
					params: { name: value },
				})
				.then(response => {
					console.log(response);
					self.followers = response.data.data;
				})
				.finally(() => (self.loadingFollowers = false));
		},
		setApplyEnable() {
			this.$refs.menu.save(this.filters.dates);
			if (this.filters.dates[0] !== undefined && this.filters.dates[1] !== undefined) this.disabled = false;
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
        this.$moment()
					.startOf('month')
					.format('YYYY-MM-DD'),
        this.$moment().format('YYYY-MM-DD'),
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

<style scoped lang="sass">
.filter-top__title
	font-size: 1rem
</style>
