<template>
	<v-card class="trading-chat pa-1">
		<v-card-title class="trading-chat__header trading-component-title pa-0">
			{{ $t('trading.headers.chat') }}
		</v-card-title>

		<TradingChatContent
			class="trading-chat__content pa-0"
			:messages-data="messagesData"
		/>

		<TradingChatAddMessage class="trading-chat__add" />
	</v-card>
</template>

<script>
import TradingChatContent from './TradingChatContent';
import TradingChatAddMessage from './TradingChatAddMessage';

export default {
	name: 'TradingChat',

	components: { TradingChatContent, TradingChatAddMessage },

	props: {
		messagesData: {
			type: Array,
			required: true,
		},
	},
};
</script>

<style scoped lang="sass">
.trading-chat
	display: flex
	flex-grow: 1
	flex-flow: column
	position: relative
</style>
