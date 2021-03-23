<template>
	<v-card class="info-page fees-page flex-grow-1">
		<CommonPageTitle>Комиссии и лимиты</CommonPageTitle>

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

		<v-tabs-items v-model="selectedTab">
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

<style lang="sass">
.fees-page
	&__search
		max-width: 15%
		margin-left: auto

	@media screen and (max-width: 1300px)
		&__search
			max-width: 25%
	@media screen and (max-width: 960px)
		&__search
			max-width: 100%
			padding-left: 16px

.v-application--is-rtl
	.fees-page__search
		margin-right: auto
		margin-left: unset
</style>
