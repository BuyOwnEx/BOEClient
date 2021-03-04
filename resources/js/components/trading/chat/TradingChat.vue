<template>
	<v-card class="trading-chat pa-1">
		<v-card-title class="trading-chat__header pa-0">
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
	//height: 327px;
	&__header
		word-break: normal
		font-weight: 700
		text-transform: uppercase
</style>
