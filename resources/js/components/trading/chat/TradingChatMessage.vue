<template>
	<v-list-item class="tcm px-0">
		<v-list-item-content class="pt-0">
			<v-list-item-title class="tcm__title text--disabled">
				<span class="tcm__title__author"> {{ message.login }}: </span>
				<span class="tcm__title__date">{{ formatMessageDate() }}</span>
			</v-list-item-title>

			<div class="tcm__text">
				{{ message.message }}
			</div>
		</v-list-item-content>
	</v-list-item>
</template>

<script>
import moment from 'moment';

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
			return moment.tz(moment.tz.guess()).format('HH:mm:ss');
		},
	},
};
</script>

<style scoped lang="scss">
.tcm {
	&__title {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;

		&__date {
			font-size: 0.65rem;
		}
	}

	&__text {
		font-size: 0.85rem;
	}
}
</style>
