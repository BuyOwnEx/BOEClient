<template>
	<v-card class="trading-chat pa-1">
		<v-card-title class="trading-chat__header component-title pa-0">
			{{ $t('trading.headers.chat') }}
		</v-card-title>

		<CommonLoading v-if="!messagesData" />
		<TradingChatContent
			v-else
			class="trading-chat__content pa-0"
			:messages-data="messagesData"
		/>

		<TradingChatAddMessage class="trading-chat__add" />
	</v-card>
</template>

<script>
import TradingChatContent from './TradingChatContent';
import TradingChatAddMessage from './TradingChatAddMessage';
import CommonLoading from '../../common/CommonLoading';

export default {
	name: 'TradingChat',

	components: {
		TradingChatContent,
		TradingChatAddMessage,
		CommonLoading,
	},

	computed: {
		messagesData() {
			return this.$store.state.chat.messages;
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
