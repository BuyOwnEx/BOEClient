<template>
	<v-form class='trading-chat-add-message' @submit.prevent='sendMessage'>
		<v-text-field
			v-model='messageText'
			class='trading-chat-add-message__field px-1'
			placeholder='Your message...'
			hide-details
		/>

		<v-btn
			class='trading-chat-add-message__send'
			color='primary'
			type='submit'
			:disabled="messageText === ''"
			icon
		>
			<v-icon>
				mdi-send
			</v-icon>
		</v-btn>
	</v-form>
</template>

<script>
export default {
	name: 'TradingChatAddMessage',

	data() {
		return {
			messageText: '',
		};
	},

	methods: {
		sendMessage() {
			console.log(this.messageText);
			this.clearMessageText();
		},

		clearMessageText() {
			this.messageText = '';
		},
	},
};
</script>

<style scoped lang='scss'>
.trading-chat-add-message {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 1px solid #9090908f;
	margin-top: auto;
	padding-top: 4px;

	&__field {
		width: 90%;
		padding: 0;
	}

	&__send {
		display: flex;
		align-items: center;
	}
}
</style>
