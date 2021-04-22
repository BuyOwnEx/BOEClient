<template>
	<v-list-item class="trading-chat-message">
		<v-list-item-content class="pt-0">
			<v-list-item-title class="trading-chat-message__title text--disabled">
				<span class="trading-chat-message__author"> {{ message.login }}: </span>
				<span class="trading-chat-message__date">
					{{ formatMessageDate() }}
				</span>
			</v-list-item-title>

			<div class="trading-chat-message__text">
				{{ message.message }}
			</div>
		</v-list-item-content>
	</v-list-item>
</template>

<script>
export default {
	name: 'TradingChatMessage',

	props: {
		message: {
			type: Object,
			required: true,
		},
	},

	methods: {
		formatMessageDate() {
			return new Date(this.message.ts * 1000).toLocaleTimeString();
		},
	},
};
</script>

<style scoped lang="scss">
.trading-chat-message {
	padding-left: 0 !important;
	padding-right: 4px;

	&__title {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&__date {
		font-size: 0.65rem;
	}
	&__text {
		font-size: 0.85rem;
		word-break: break-word;
	}
}
.v-application--is-rtl .trading-chat-message {
	padding-left: 4px !important;
	padding-right: 0 !important;
}
</style>
