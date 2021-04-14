<template>
	<v-list ref="chatContent" class="trading-chat-content" flat>
		<v-list-item-group class="trading-chat-content__group">
			<TradingChatMessage
				v-for="msg in messagesData"
				:key="msg.data.ts"
				:message="msg.data"
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

	watch: {
		messagesData(val, oldVal) {
			if (!oldVal.length) {
				this.$nextTick(() => {
					const element = this.$refs.chatContent.$el;
					element.scrollTop = element.scrollHeight;
				});
			}
		},
	},
};
</script>

<style scoped lang="scss">
.trading-chat-content {
	position: absolute;
	top: 38px;
	left: 8px;
	right: 8px;
	bottom: 65px;
	margin-right: 5px;

	overflow-y: scroll;
	mask-image: linear-gradient(to top, transparent, black),
		linear-gradient(to left, transparent 6px, black 6px);
	mask-size: 100% 20000px;
	mask-position: left bottom;
	-webkit-mask-image: linear-gradient(to top, transparent, black),
		linear-gradient(to left, transparent 6px, black 6px);
	-webkit-mask-size: 100% 20000px;
	-webkit-mask-position: left bottom;
	transition: mask-position 0.3s, -webkit-mask-position 0.3s;
}
</style>
