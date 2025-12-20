<template>
	<v-form class="trading-chat-add-message" @submit.prevent="sendMessage">
		<input class="d-none" autocomplete="off" name="hidden" type="text" />
		<v-text-field
			v-model="messageText"
			class="trading-chat-add-message__field pr-1"
			:placeholder="$t('trading.your_message')"
			maxlength="512"
			counter="512"
			autocomplete="off"
		/>

		<v-btn
			class="trading-chat-add-message__send"
			color="primary"
			type="submit"
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
			if (this.messageText.trim() === '') {
				this.clearMessageText();
				return;
			}

			axios
				.post('/trader/ext/message/send', {
					message: this.messageText,
				})
				.then(response => {
					if (response.data.success === true) {
						console.log(response.data);
						this.clearMessageText();
					}
				});
		},
		clearMessageText() {
			this.messageText = '';
		},
	},
};
</script>

<style scoped lang="scss">
.trading-chat-add-message {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: auto;

	&__field {
		width: 90%;
		padding: 0;
	}

	&__send {
		display: flex;
		align-items: center;
	}

	::v-deep.v-input__slot {
		margin-bottom: 2px !important;
		&::before {
			border-color: #90909057 !important;
		}
	}
}

.v-application--is-rtl {
	.trading-chat-add-message {
		&__send i {
			transform: scaleX(-1) !important;
		}
	}
}
</style>
