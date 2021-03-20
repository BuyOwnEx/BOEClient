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
					element.scrollTop = 100000;
				});
			}
		},
	},
};
</script>

<style scoped lang="scss">
.trading-chat-content {
	overflow-y: hidden;
	position: absolute;
	top: 38px;
	left: 8px;
	right: 8px;
	bottom: 49px;
	margin-right: 5px;
	&:hover {
		overflow-y: scroll;
		margin-right: 0;
	}
}
@-moz-document url-prefix() {
	.trading-chat-content {
		margin-right: 7px !important;
		&:hover {
			margin-right: 0 !important;
		}
	}
}
</style>
