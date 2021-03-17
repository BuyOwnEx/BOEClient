<template>
	<v-card class="info-page fees-page flex-grow-1">
		<CommonPageTitle>Комиссии и лимиты</CommonPageTitle>

		<v-card-text>
			<v-tabs v-model="selectedTab" show-arrows>
				<v-tab :key="1">
					Торговая комиссия
				</v-tab>

				<v-tab :key="2">
					Комиссия на ввод и вывод
				</v-tab>

				<v-tab :key="3">
					Лимиты по вводу и выводу
				</v-tab>
			</v-tabs>

			<v-tabs-items v-model="selectedTab" class="pt-2">
				<v-tab-item :key="1">
					<FeesTradingTab />
				</v-tab-item>

				<v-tab-item :key="2">
					<FeesDepositAndWithdrawalTab />
				</v-tab-item>

				<v-tab-item :key="3">
					<FeesDepositAndWithdrawalLimitsTab />
				</v-tab-item>
			</v-tabs-items>
		</v-card-text>
	</v-card>
</template>

<script>
import CommonPageTitle from '../../components/common/CommonPageTitle';

import FeesTradingTab from '../../components/info/fees/FeesTradingTab';
import FeesDepositAndWithdrawalTab from '../../components/info/fees/FeesDepositAndWithdrawalTab';
import FeesDepositAndWithdrawalLimitsTab from '../../components/info/fees/FeesDepositAndWithdrawalLimitsTab';

export default {
	name: 'Fees',

	components: {
		CommonPageTitle,
		FeesTradingTab,
		FeesDepositAndWithdrawalTab,
		FeesDepositAndWithdrawalLimitsTab,
	},

	data() {
		return {
			selectedTab: 0,
		};
	},
};
</script>

<style scoped></style>
