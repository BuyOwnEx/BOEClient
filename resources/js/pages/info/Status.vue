<template>
	<v-card class="info-page status-page flex-grow-1">
		<CommonPageTitle>Состояние системы</CommonPageTitle>

		<InfoStatusSupportCurrencyText />
		<v-divider />

		<v-card-text>
			<InfoStatusDefinitionText />

			<InfoStatusTables
				:fiat-data="fiatCurrencies"
				:crypto-data="cryptoCurrencies"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import CommonPageTitle from '../../components/common/CommonPageTitle';

import InfoStatusSupportCurrencyText from '../../components/info/status/InfoStatusSupportCurrencyText';
import InfoStatusDefinitionText from '../../components/info/status/InfoStatusDefinitionText';
import InfoStatusTables from '../../components/info/status/InfoStatusTables';

export default {
	name: 'Status',

	components: {
		CommonPageTitle,
		InfoStatusSupportCurrencyText,
		InfoStatusDefinitionText,
		InfoStatusTables,
	},

	data() {
		return {
			fiatCurrencies: [],
			cryptoCurrencies: [],
		};
	},
};
</script>

<style scoped lang="sass"></style>
