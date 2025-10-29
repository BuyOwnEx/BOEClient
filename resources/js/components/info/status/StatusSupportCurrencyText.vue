<template>
	<v-card-text>
    <div v-if="fiatCount > 0">
      {{ $t('status.supported_currencies_all_prepend') }}
      <b>{{ allCount }}</b>
      {{ $tc('status.supported_currencies_all_append', allCount) }}:
      <b>{{ cryptoCount }}</b> {{ $tc('status.supported_crypto', cryptoCount) }} {{ $t('status.supported_and') }}
      <b>{{ fiatCount }}</b> {{ $tc('status.supported_fiat', fiatCount) }}
    </div>
    <div v-else>
      {{ $t('status.supported_currencies_all_prepend') }}
      <b>{{ cryptoCount }}</b>
      {{ $tc('status.supported_crypto_only', cryptoCount) }}
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
