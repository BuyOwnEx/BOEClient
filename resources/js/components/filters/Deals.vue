<template>
	<v-form>
		<v-container class="pa-0" fluid>
			<FiltersTitle :show='show'  @toggle-filters="show = !show" />

			<v-row class="filter-main" v-if="show" no-gutters>
				<v-col class="px-1" cols="12" sm="6" md="3">
					<v-menu
						ref="menu_start_date"
						v-model="menu_start_date"
						:close-on-content-click="false"
						:return-value.sync="filters.start_date"
						transition="scale-transition"
						min-width="290px"
						offset-y
					>
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								class="mt-2"
								v-model="filters.start_date"
								label="Date from"
								hint="Choose date from"
								persistent-hint
								hide-details="auto"
								readonly
								v-bind="attrs"
								v-on="on"
							></v-text-field>
						</template>
						<v-date-picker
							v-model="filters.start_date"
							no-title
							scrollable
							@change="
								() => {
									$refs.menu_start_date.save(filters.start_date);
									disabled = false;
								}
							"
						></v-date-picker>
					</v-menu>
				</v-col>

				<v-col class="px-1" cols="12" sm="6" md="3">
					<v-menu
						ref="menu_start_time"
						v-model="menu_start_time"
						:close-on-content-click="false"
						:return-value.sync="filters.start_time"
						transition="scale-transition"
						min-width="290px"
						offset-y
					>
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								class="mt-2"
								v-model="filters.start_time"
								label="Time from"
								hint="Choose time from"
								persistent-hint
								hide-details="auto"
								readonly
								v-bind="attrs"
								v-on="on"
							></v-text-field>
						</template>
						<v-time-picker
							v-if="menu_start_time"
							v-model="filters.start_time"
							format="24hr"
							use-seconds
							no-title
							@click:second="
								() => {
									$refs.menu_start_time.save(filters.start_time);
									disabled = false;
								}
							"
						></v-time-picker>
					</v-menu>
				</v-col>

				<v-col class="px-1" cols="12" sm="6" md="3">
					<v-menu
						ref="menu_end_date"
						v-model="menu_end_date"
						:close-on-content-click="false"
						:return-value.sync="filters.end_date"
						transition="scale-transition"
						min-width="290px"
						offset-y
					>
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								class="mt-2"
								v-model="filters.end_date"
								label="Date till"
								hint="Choose date till"
								persistent-hint
								hide-details="auto"
								readonly
								v-bind="attrs"
								v-on="on"
							></v-text-field>
						</template>
						<v-date-picker
							v-model="filters.end_date"
							no-title
							scrollable
							@change="
								() => {
									$refs.menu_end_date.save(filters.end_date);
									disabled = false;
								}
							"
						></v-date-picker>
					</v-menu>
				</v-col>

				<v-col class="px-1" cols="12" sm="6" md="3">
					<v-menu
						ref="menu_end_time"
						v-model="menu_end_time"
						:close-on-content-click="false"
						:return-value.sync="filters.end_time"
						transition="scale-transition"
						min-width="290px"
						offset-y
					>
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								class="mt-2"
								v-model="filters.end_time"
								label="Time till"
								hint="Choose time till"
								persistent-hint
								hide-details="auto"
								readonly
								v-bind="attrs"
								v-on="on"
							></v-text-field>
						</template>
						<v-time-picker
							v-if="menu_end_time"
							v-model="filters.end_time"
							format="24hr"
							use-seconds
							no-title
							@click:second="
								() => {
									$refs.menu_end_time.save(filters.end_time);
									disabled = false;
								}
							"
						></v-time-picker>
					</v-menu>
				</v-col>
			</v-row>

			<v-row class="filter-main" v-if="show" no-gutters>
				<v-col class="px-1" cols="12" sm="4" md="4">
					<v-text-field
						v-model="filters.id"
						@change="setEnabled"
						label="Deal ID"
						hint="Search deal by ID"
						persistent-hint
						hide-details="auto"
						clearable
					></v-text-field>
				</v-col>

				<v-col class="px-1" cols="12" sm="4" md="4">
					<v-select
						v-model="filters.pair"
						@change="setEnabled"
						:items="pairs"
						item-text="name"
						item-value="id"
						label="Select pair"
						hint="Select pair from available options"
						persistent-hint
						hide-details="auto"
						clearable
					>
						<template slot="item" slot-scope="data">
							<template v-if="typeof data.item !== 'object'">
								<v-list-item-content v-text="data.item" />
							</template>
							<template v-else>
								<v-list-item-content>
									<v-list-item-title v-html="data.item.name" />
								</v-list-item-content>
							</template>
						</template>
					</v-select>
				</v-col>

				<v-col class="px-1" cols="12" sm="4" md="4">
					<v-select
						v-model="filters.side"
						@change="setEnabled"
						:items="all_sides"
						item-text="name"
						item-value="value"
						label="Select side"
						hint="Select side from available options"
						persistent-hint
						hide-details="auto"
						clearable
					></v-select>
				</v-col>
			</v-row>

			<FiltersFooter
				v-if="show"
				:disabled="disabled"
				@reset="resetFilter"
				@set="setFilter"
			/>
		</v-container>
	</v-form>
</template>

<script>
import FiltersTitle from './parts/FiltersTitle';
import FiltersFooter from './parts/FiltersFooter';

export default {
	name: 'Deals',

	components: { FiltersFooter, FiltersTitle },

	props: ['all_sides'],

	data() {
		return {
			show: true,
			disabled: true,
			menu_start_date: false,
			menu_start_time: false,
			menu_end_date: false,
			menu_end_time: false,
			filters: {
				start_date: moment()
					.startOf('month')
					.format('YYYY-MM-DD'),
				start_time: '00:00:00',
				end_date: moment().format('YYYY-MM-DD'),
				end_time: '23:59:59',
				id: null,
				pair: null,
				side: null,
			},
			sides: this.all_sides,
		};
	},

	computed: {
		filterData() {
			return {
				start: this.filters.start_date + ' ' + this.filters.start_time,
				end: this.filters.end_date + ' ' + this.filters.end_time,
				id: this.filters.id,
				pair: this.filters.pair,
				side: this.filters.side,
			};
		},
		all_pairs() {
			return this.$store.state.tickers.markets;
		},
		pairs() {
			let result = [];
			_.forEach(this.all_pairs, function(value, key) {
				result.push({ header: key });
				_.forEach(value, function(item, key2) {
					result.push({
						id: item.id,
						name: item.currency + '/' + item.market,
						group: item.market,
					});
				});
				result.push({ divider: true });
			});
			return result;
		},
	},

	methods: {
		setEnabled() {
			this.disabled = false;
		},
		setFilter() {
			this.$emit('apply-table-filter', this.filterData);
			this.disabled = true;
			localStorage.dealFilters = JSON.stringify(this.filters);
		},
		resetFilter() {
			this.filters.start_date = moment()
				.startOf('month')
				.format('YYYY-MM-DD');
			this.filters.start_time = '00:00:00';
			this.filters.end_date = moment().format('YYYY-MM-DD');
			this.filters.end_time = '23:59:59';
			this.filters.id = null;
			this.filters.pair = null;
			this.filters.side = null;
			this.$emit('reset-table-filter', this.filterData);
			this.disabled = true;
			localStorage.removeItem('dealFilters');
		},
	},

	created() {
		this.$store.dispatch('tickers/getMarketDataFromServer');
	},

	mounted() {
		if (localStorage.dealFilters) {
			let saved_filters = JSON.parse(localStorage.dealFilters);
			this.filters.start_date = saved_filters.start_date;
			this.filters.start_time = saved_filters.start_time;
			this.filters.end_date = saved_filters.end_date;
			this.filters.end_time = saved_filters.end_time;
			this.filters.id = saved_filters.id;
			this.filters.pair = saved_filters.pair;
			this.filters.side = saved_filters.side;
			this.$emit('table-filter', this.filterData);
		}
	},
};
</script>

<style scoped lang="sass">
.filter-top__title
	font-size: 1rem
</style>
