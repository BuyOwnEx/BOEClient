<template>
	<v-card-text>
    <div v-if="fiatCount > 0">
      {{ $t('status.supported_currencies_all_prepend') }}
      <b>{{ allCount }}</b>
      {{ $t('status.supported_currencies_all_append') }}:
      <b>{{ cryptoCount }}</b> {{ $t('status.supported_crypto') }} {{ $t('status.supported_and') }}
      <b>{{ fiatCount }}</b> {{ $t('status.supported_fiat') }}
    </div>
    <div v-else>
      {{ $t('status.supported_currencies_all_prepend') }}
      <b>{{ cryptoCount }}</b>
      {{ $t('status.supported_crypto_only') }}
    </div>
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
    allCount() {
      return this.cryptoCount+ this.fiatCount;
    },
	},
};
</script>
