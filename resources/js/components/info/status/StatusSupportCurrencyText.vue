<template>
	<v-card-text class="pb-0">
		<p>
			Поддерживаются
			<b>12</b> валют:
			<b>9</b>
			криптовалют (монет/токенов)
			<span v-if="userFiat">
				и
				<b>3</b> фиатных валют
			</span>
		</p>
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
};
</script>
