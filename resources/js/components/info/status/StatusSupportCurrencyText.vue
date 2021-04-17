<template>
	<v-card-text class="pb-0">
		<p v-if="userFiat" v-html="userCryptoAndFiatText" />
		<p v-else v-html="userOnlyCryptoText" />
	</v-card-text>
</template>

<script>
export default {
	name: 'StatusSupportCurrencyText',

	props: {
		userFiat: {
			type: Boolean,
			required: true,
		},
	},

	data() {
		return {
			userCryptoAndFiatText: this.$t(
				'status.support_currencies_fiat_and_crypto'
			),
			userOnlyCryptoText: this.$t('status.support_currencies_only_crypto'),
		};
	},
};
</script>
