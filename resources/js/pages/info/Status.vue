<template>
	<v-card class="info-page status-page flex-grow-1">
		<CommonPageTitle>{{ $t('status.title') }}</CommonPageTitle>

		<StatusSupportCurrencyText :user-fiat="isUserFiat" />
		<v-divider />

		<v-card-text>
			<StatusDefinitionText />

			<CommonLoading v-if="noTablesData" />
			<StatusTables
				v-else
				:fiat-data="fiatCurrencies || []"
				:crypto-data="cryptoCurrencies"
				:user-fiat="isUserFiat"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';

import CommonPageTitle from '../../components/common/CommonPageTitle';
import CommonLoading from '../../components/common/CommonLoading';

import StatusSupportCurrencyText from '../../components/info/status/StatusSupportCurrencyText';
import StatusDefinitionText from '../../components/info/status/StatusDefinitionText';
import StatusTables from '../../components/info/status/StatusTables';

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
			fiatCurrencies: null,
			cryptoCurrencies: null,
		};
	},

	computed: {
		...mapGetters({
			isUserFiat: 'user/isUserFiat',
		}),

		noTablesData() {
			const fiatAndCrypto = this.fiatCurrencies && this.cryptoCurrencies;
			const onlyCrypto = this.cryptoCurrencies;
			return this.isUserFiat ? !fiatAndCrypto : !onlyCrypto;
		},
	},

	created() {
		this.fetch();
	},

	methods: {
		fetch() {
			this.fetchCryptoData();
			if (this.isUserFiat) this.fetchFiatData();
		},

		async fetchCryptoData() {
			const { data } = await axios.get('/trader/ext/crypto_currencies');
			this.cryptoCurrencies = data.data;
		},
		async fetchFiatData() {
			const { data } = await axios.get('/trader/ext/fiat_currencies');
			this.fiatCurrencies = data.data;
		},
	},
};
</script>
