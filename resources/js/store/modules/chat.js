export default {
	namespaced: true,
	state: {
		limit: 50,
		messages: [],
	},
	mutations: {
		setHistoryMessages(state, list) {
			state.messages = list;
		},
		addMessage(state, item) {
			state.messages.push(item);
			if (state.messages > state.limit) {
				state.messages.shift();
			}
		}
	}
};