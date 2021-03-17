<template>
	<v-card class="info-page status-page flex-grow-1">
		<CommonPageTitle>Состояние системы</CommonPageTitle>

		<StatusSupportCurrencyText />
		<v-divider />

		<v-card-text>
			<StatusDefinitionText />

			<StatusTables
				:fiat-data="fiatCurrencies"
				:crypto-data="cryptoCurrencies"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import CommonPageTitle from '../../components/common/CommonPageTitle';

import StatusSupportCurrencyText from '../../components/info/status/StatusSupportCurrencyText';
import StatusDefinitionText from '../../components/info/status/StatusDefinitionText';
import StatusTables from '../../components/info/status/StatusTables';

export default {
	name: 'Status',

	components: {
		CommonPageTitle,
		StatusSupportCurrencyText,
		StatusDefinitionText,
		StatusTables,
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
