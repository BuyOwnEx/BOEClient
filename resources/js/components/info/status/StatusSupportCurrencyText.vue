<template>
	<v-card-text>
		<div v-if="fiatCount > 0" v-html="userCryptoAndFiatText" />
		<div v-else v-html="userOnlyCryptoText" />
	</v-card-text>
</template>

<script>
export default {
	name: 'StatusSupportCurrencyText',

	props: {
		cryptoCount: {
			type: Number,
			required: true,
		},
		fiatCount: {
			type: Number,
			required: true,
		},
	},

	computed: {
		userCryptoAndFiatText() {
			return this.$t('status.support_currencies_fiat_and_crypto',[this.cryptoCount+ this.fiatCount, this.cryptoCount, this.fiatCount]);
		},
		userOnlyCryptoText() {
			return this.$t('status.support_currencies_only_crypto',[this.cryptoCount]);
		},
	},
};
</script>
