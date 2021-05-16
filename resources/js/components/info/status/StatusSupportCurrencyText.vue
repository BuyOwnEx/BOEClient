<template>
	<v-card-text>
		<div v-if="userFiat" v-html="userCryptoAndFiatText" />
		<div v-else v-html="userOnlyCryptoText" />
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

	computed: {
		userCryptoAndFiatText() {
			return this.$t('status.support_currencies_fiat_and_crypto');
		},
		userOnlyCryptoText() {
			return this.$t('status.support_currencies_only_crypto');
		},
	},
};
</script>
