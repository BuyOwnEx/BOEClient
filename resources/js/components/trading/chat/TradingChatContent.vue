<template>
	<v-list class='trading-chat-content' flat>
		<v-list-item-group class='trading-chat-content__group'>
			<TradingChatMessage
				v-for='msg in messagesData'
				:key='msg.id'
				:message='msg'
			/>
		</v-list-item-group>
	</v-list>
</template>

<script>
import TradingChatMessage from './TradingChatMessage';

export default {
	name: 'TradingChatContent',

	components: { TradingChatMessage },

	props: {
		messagesData: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {};
	},
};
</script>

<style scoped lang='scss'>
.trading-chat-content {
	overflow-y: auto;
	position: absolute;
	top: 38px;
	left: 8px;
	right: 8px;
	bottom: 49px;
	margin-right: 2px;
}
</style>
