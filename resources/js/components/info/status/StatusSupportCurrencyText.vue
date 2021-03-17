<template>
	<v-card-text class="pb-0">
		<p>
			Поддерживаются
			<span class="status__currency status__currency--total">12</span> валют:
			<span class="status__currency status__currency--crypto">9</span>
			криптовалют (монет/токенов) и
			<span class="status__currency status__currency--fiat">3</span> фиатных
			валют
		</p>
	</v-card-text>
</template>

<script>
export default {
	name: 'StatusSupportCurrencyText',
};
</script>

<style scoped lang="sass">
.status
	&__currency
		font-size: 1.15rem
		font-weight: 600
</style>
