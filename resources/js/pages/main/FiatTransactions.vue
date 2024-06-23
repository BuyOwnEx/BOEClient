<template>
	<v-card class="fiat-transactions">
		<v-data-table
			class="pa-1 pa-sm-2"
			:style="`width:100%`"
			:calculate-widths="true"
			:headers="headers"
			:items="items"
			:options.sync="options"
			:items-per-page.sync="itemsPerPage"
			:sort-by.sync="sortBy"
			:sort-desc.sync="sortDesc"
			:server-items-length="totalItems"
			:footer-props="footer_props"
			:loading="loading"
			:caption="$t('reports.fiat_transactions_title')"
			dense
		>
			<template #top>
				<filters
					:all_types="types"
					:all_gateways="gateways"
					:all_currencies="currencies"
					:all_statuses="statuses"
					@apply-table-filter="onFilterApply"
					@reset-table-filter="onFilterReset"
					@table-filter="onUseFilter"
					@toggleFiltersShow="toggleFiltersShow"
				/>
				<v-divider class="pb-2" />
			</template>

			<template #item.amount="{ item }">
				<v-img
					v-if="getLogo(item.currency)"
					class="elevation-0 d-inline-flex vertical-middle"
					:src="getLogo(item.currency)"
					max-height="22"
					max-width="22"
				/>
				<v-avatar v-else class="white--text subtitle-2" :color="item.color" size="22">
					{{ item.currency.charAt(0) }}
				</v-avatar>
				<span class="ml-1">{{ BigNumber(item.amount).toFixed(2,4) }} {{ item.currency }}</span>
			</template>

      <template #item.fee="{ item }">
        <v-img
            v-if="getLogo(item.currency)"
            class="elevation-0 d-inline-flex vertical-middle"
            :src="getLogo(item.currency)"
            max-height="22"
            max-width="22"
        />
        <v-avatar v-else class="white--text subtitle-2" :color="item.color" size="22">
          {{ item.currency.charAt(0) }}
        </v-avatar>
        <span class="ml-1">{{ BigNumber(item.fee).toFixed(2,4) }} {{ item.currency }}</span>
      </template>

			<template #item.type="{ item }">
				<span :class="item.type === true ? 'success--text' : 'error--text'">
					{{ getTypeName(item.type) }}
				</span>
			</template>

      <template #item.gateway_id="{ item }">
				<span>
					{{ getGatewayName(item.gateway_id, item.type) }}
				</span>
      </template>

			<template #item.status="{ item }">
        <CommonTooltip :value="item.details" v-if="item.details">
          <span :class="getStatusColorClass(item.status)">
					  {{ getStatusName(item.status) }}
				  </span>
        </CommonTooltip>
        <span v-else :class="getStatusColorClass(item.status)">
          {{ getStatusName(item.status) }}
        </span>
			</template>

			<template #item.created_at="{ item }">
				<span>{{ getDate(item.created_at) }}</span>
			</template>

		</v-data-table>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';

import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import filters from '@/components/filters/FiatTransactions.vue';
import CommonTooltip from '@/components/common/CommonTooltip.vue';
import randomColor from 'randomcolor';

export default {
	name: 'FiatTransactions',

	components: {
		filters,
    CommonTooltip
	},

	data() {
		return {
			isFiltersShow: true,
			totalItems: 0,
			items: [],
			loading: true,
			options: {},
			itemsPerPage: 30,
			sortBy: 'id',
			sortDesc: true,
			footer_props: {
				'items-per-page-options': [30, 50, 100, 500],
				'items-per-page-all-text': '500',
			},
			statuses: [
				{ value: 'done', name: this.$t('fiat.statuses.done') }, // вывод осуществлен
				{ value: 'wait', name: this.$t('fiat.statuses.wait') }, // ожидание вывода/ожидание подтвержения зачисления
				{ value: 'accepted', name: this.$t('fiat.statuses.accepted') }, // пополнение принято
				{ value: 'fail', name: this.$t('fiat.statuses.fail') }, // вывод отклонен/зачисление отклонено
        { value: 'refund', name: this.$t('fiat.statuses.refund') }, // возврат зачисления
			],
			types: [
				{ value: false, name: this.$t('common.withdrawal') },
				{ value: true, name: this.$t('common.replenishment') },
			],
			gateways: [
        { id: 1, name: this.$t('fiat.gateways.qr') },
        { id: 2, name: this.$t('fiat.gateways.invoice') }
      ],
		};
	},

	computed: {
    ...mapState('trading', ['all_currencies','allCurrencyListInit']),
		headers() {
			return [
				{ text: 'ID', value: 'id' },
				{ text: this.$t('table_header.date'), value: 'created_at' },
				{ text: this.$t('table_header.type'), value: 'type' },
				{ text: this.$t('table_header.gateway'), value: 'gateway_id' },
        { text: this.$t('common.amount'), value: 'amount' },
				{ text: this.$t('table_header.fee'), value: 'fee' },
				{ text: this.$t('table_header.status'), value: 'status' },
			];
		},
    currencies() {
      return this.allCurrencyListInit ? _.filter(this.all_currencies,item => item.type === 'fiat') : []
    },
	},

	watch: {
		options: {
			handler() {
				this.getDataFromApi().then(data => {
					this.items = data.items;
					this.totalItems = data.total;
				});
			},
			deep: true,
		},
	},

	methods: {
		BigNumber(item) {
			return BigNumber(item);
		},
		getLogo(currency) {
			return this.currencies.find(item => item.currency === currency).logo;
		},
		getDate(date) {
			return date ? this.$moment(date).format('YYYY-MM-DD HH:mm:ss') : '-';
		},
		getTypeName(type) {
			let index = _.findIndex(this.types, item => item.value === type);
			return this.types[index]?.name;
		},
    getGatewayName(gateway_id, trx_type) {
      if(trx_type === true)
      {
        if(gateway_id === 1) return this.$t('fiat.gateway.replenish.names.qr')
        else if(gateway_id === 2) return this.$t('fiat.gateway.replenish.names.invoice')
        else return '-';
      }
      else
      {
        if(gateway_id === 2) return this.$t('fiat.gateway.withdraw.names.invoice')
        else return '-';
      }
    },
		getStatusName(status) {
			let index = _.findIndex(this.statuses, item => item.value === status);
			return this.statuses[index]?.name;
		},
		getRandomColor() {
			return randomColor({
				luminosity: 'dark',
				format: 'rgba',
				alpha: 0.5,
			});
		},
		onFilterApply(data) {
			this.options.filters = data;
			this.getDataFromApi().then(data => {
				this.items = data.items;
				this.totalItems = data.total;
			});
		},
		onUseFilter(data) {
			this.options.filters = data;
		},
		onFilterReset(data) {
			this.options.filters = data;
			this.getDataFromApi().then(data => {
				this.items = data.items;
				this.totalItems = data.total;
			});
		},
		onReload() {
			this.getDataFromApi().then(data => {
				this.items = data.items;
				this.totalItems = data.total;
			});
		},
		async getDataFromApi() {
			this.loading = true;
			return new Promise(async (resolve, reject) => {
				let result = await this.getItems(this.options);
				let items = result.data;
				const total = result.total;
				let self = this;
				_.forEach(items, function(value) {
					_.assign(value, { color: self.getRandomColor() });
				});
				setTimeout(() => {
					this.loading = false;
					resolve({
						items,
						total,
					});
				}, 1000);
			});
		},
		async getItems(opts) {
			console.log(opts);
			let parameters = opts;
			if (opts.filters === undefined) {
				let dates = {
					filters: {
						start:
                this.$moment()
								.startOf('month')
								.format('YYYY-MM-DD') +
							' ' +
							'00:00:00',
						end: this.$moment().format('YYYY-MM-DD') + ' ' + '23:59:59',
					},
				};
				_.assign(parameters, dates);
			}
			const response = await axios.get('/trader/ext/all_fiat_transactions', {
				params: parameters,
			});
			return response.data;
		},
		menuItemExist(func) {
			return _.findIndex(this.actions, action => action.name === func) !== -1;
		},
		closeMenu(item) {
			item.menu = false;
		},
		getImage(img) {
			return '/' + img;
		},

		getStatusColorClass(status) {
			if (status === 'done' || status === 'accepted') return 'success--text';
			else if (status === 'wait' || status === 'new') return 'warning--text';
			else if (status === 'fail' || status === 'refund') return 'error--text';
			else return '';
		},

		toggleFiltersShow() {
			this.isFiltersShow = !this.isFiltersShow;
		},
	},
};
</script>
