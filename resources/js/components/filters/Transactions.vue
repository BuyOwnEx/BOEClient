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
								class="mt-1"
								v-model="filters.start_date"
								label="Date from"
								hint="Choose date from"
								persistent-hint
								hide-details="auto"
								readonly
								v-bind="attrs"
								v-on="on"
							/>
						</template>
						<v-date-picker
							v-model="filters.start_date"
							color='primary'
							no-title
							scrollable
							@change="
								() => {
									$refs.menu_start_date.save(filters.start_date);
									disabled = false;
								}
							"
						/>
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
								class="mt-1"
								v-model="filters.start_time"
								label="Time from"
								hint="Choose time from"
								persistent-hint
								hide-details="auto"
								readonly
								v-bind="attrs"
								v-on="on"
							/>
						</template>
						<v-time-picker
							v-if="menu_start_time"
							v-model="filters.start_time"
							format="24hr"
							color='primary'
							use-seconds
							no-title
							@click:second="
								() => {
									$refs.menu_start_time.save(filters.start_time);
									disabled = false;
								}
							"
						/>
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
						color='primary'
						offset-y
					>
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								class="mt-1"
								v-model="filters.end_date"
								label="Date till"
								hint="Choose date till"
								persistent-hint
								hide-details="auto"
								readonly
								v-bind="attrs"
								v-on="on"
							/>
						</template>
						<v-date-picker
							v-model="filters.end_date"
							color='primary'
							no-title
							scrollable
							@change="
								() => {
									$refs.menu_end_date.save(filters.end_date);
									disabled = false;
								}
							"
						/>
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
								class="mt-1"
								v-model="filters.end_time"
								label="Time till"
								hint="Choose time till"
								persistent-hint
								hide-details="auto"
								readonly
								v-bind="attrs"
								v-on="on"
							/>
						</template>
						<v-time-picker
							v-if="menu_end_time"
							v-model="filters.end_time"
							format="24hr"
							color='primary'
							use-seconds
							no-title
							@click:second="
								() => {
									$refs.menu_end_time.save(filters.end_time);
									disabled = false;
								}
							"
						/>
					</v-menu>
				</v-col>
			</v-row>

			<v-row class="filter-main mt-1" v-if="show" no-gutters>
				<v-col class="px-1" cols="12" sm="6" md="4">
					<v-text-field
						class="mt-1"
						v-model="filters.id"
						@change="setEnabled"
						label="Transaction ID"
						hint="Search transaction by ID"
						persistent-hint
						hide-details="auto"
						clearable
					/>
				</v-col>

				<v-col class="px-1" cols="12" sm="6" md="4">
					<v-text-field
						class="mt-1"
						v-model="filters.txid"
						@change="setEnabled"
						label="Transaction Hash"
						hint="Search transaction by hash"
						persistent-hint
						hide-details="auto"
						clearable
					/>
				</v-col>

				<v-col class="px-1" cols="12" sm="6" md="4">
					<v-text-field
						class="mt-1"
						v-model="filters.address"
						@change="setEnabled"
						label="Address"
						hint="Search transaction by recipient address"
						persistent-hint
						hide-details="auto"
						clearable
					/>
				</v-col>

				<v-col class="px-1" cols="12" sm="6" md="4">
					<v-select
						class="mt-1"
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

				<v-col class="px-1" cols="12" sm="6" md="4">
					<v-select
						class="mt-1"
						v-model="filters.type"
						@change="setEnabled"
						:items="all_types"
						item-text="name"
						item-value="value"
						label="Select type"
						hint="Select type from available options"
						persistent-hint
						hide-details="auto"
						clearable
					/>
				</v-col>

				<v-col class="px-1" cols="12" sm="6" md="4">
					<v-select
						class="mt-1"
						v-model="filters.status"
						@change="setEnabled"
						:items="all_statuses"
						item-text="name"
						item-value="value"
						label="Select status"
						hint="Select status from available options"
						persistent-hint
						hide-details="auto"
						clearable
					/>
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
	name: 'Transactions',

	components: { FiltersFooter, FiltersTitle },

	props: ['all_currencies', 'all_types', 'all_statuses'],

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
				txid: null,
				address: null,
				currency: null,
				type: null,
				status: null,
			},
			types: this.all_types,
			statuses: this.all_statuses,
			currencies: this.all_currencies,
		};
	},

	watch: {
		show() {
			this.$emit('toggleFiltersShow')
		}
	},

	computed: {
		filterData() {
			return {
				start: this.filters.start_date + ' ' + this.filters.start_time,
				end: this.filters.end_date + ' ' + this.filters.end_time,
				id: this.filters.id,
				txid: this.filters.txid,
				address: this.filters.address,
				currency: this.filters.currency,
				type: this.filters.type,
				status: this.filters.status,
			};
		},
	},

	methods: {
		setEnabled() {
			this.disabled = false;
		},
		setFilter() {
			this.$emit('apply-table-filter', this.filterData);
			this.disabled = true;
			localStorage.transactionFilters = JSON.stringify(this.filters);
		},
		resetFilter() {
			this.filters.start_date = moment()
				.startOf('month')
				.format('YYYY-MM-DD');
			this.filters.start_time = '00:00:00';
			this.filters.end_date = moment().format('YYYY-MM-DD');
			this.filters.end_time = '23:59:59';
			this.filters.id = null;
			this.filters.txid = null;
			this.filters.address = null;
			this.filters.currency = null;
			this.filters.type = null;
			this.filters.status = null;
			this.$emit('reset-table-filter', this.filterData);
			this.disabled = true;
			localStorage.removeItem('transactionFilters');
		},
	},

	mounted() {
		if (localStorage.transactionFilters) {
			let saved_filters = JSON.parse(localStorage.transactionFilters);
			this.filters.start_date = saved_filters.start_date;
			this.filters.start_time = saved_filters.start_time;
			this.filters.end_date = saved_filters.end_date;
			this.filters.end_time = saved_filters.end_time;
			this.filters.id = saved_filters.id;
			this.filters.txid = saved_filters.txid;
			this.filters.address = saved_filters.address;
			this.filters.currency = saved_filters.currency;
			this.filters.type = saved_filters.type;
			this.filters.status = saved_filters.status;
			this.$emit('table-filter', this.filterData);
		}
	},
};
</script>
