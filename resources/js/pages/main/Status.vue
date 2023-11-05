<template>
	<v-card class="info-page status-page flex-grow-1">
		<CommonPageTitle>{{ $t('status.title') }}</CommonPageTitle>

		<StatusSupportCurrencyText :crypto-count="cryptoCount" :fiat-count="fiatCount" />
		<v-divider />

		<v-card-text>
			<StatusDefinitionText />

			<CommonLoading v-if="!isLoaded" />
			<StatusTables
				v-else
				:currencies="currencies"
				:pairs-data="pairsData"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import CommonPageTitle from '@/components/common/CommonPageTitle.vue';
import CommonLoading from '@/components/common/CommonLoading.vue';

import StatusSupportCurrencyText from '@/components/info/status/StatusSupportCurrencyText.vue';
import StatusDefinitionText from '@/components/info/status/StatusDefinitionText.vue';
import StatusTables from '@/components/info/status/StatusTables.vue';

export default {
	name: 'Status',

	components: {
		CommonPageTitle,
		CommonLoading,
		StatusSupportCurrencyText,
		StatusDefinitionText,
		StatusTables,
	},

	data() {
		return {
			currencies: null,
			pairsData: null,
		};
	},

	computed: {
		isLoaded() {
			return Boolean(this.currencies && this.pairsData);
		},
		cryptoCount() {
			return this.currencies?.filter(c => c.type === 'crypto')?.length || 0;
		},
		fiatCount() {
			return this.currencies?.filter(c => c.type === 'fiat')?.length || 0;
		},
	},

	created() {
		this.fetch();
	},

	methods: {
		async fetch() {
			const { data } = await axios.get('/trader/ext/health');
			this.currencies = data.currencies;
			this.pairsData = data.pairs;
		},
	},
};
</script>
