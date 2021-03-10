export default {
	namespaced: true,
	state: {
		text: '',
		timeout: 6000,
		isMultiline: false,
		color: 'info',
	},
	mutations: {
		SHOW_MESSAGE(state, { text, color, timeout, isMultiline }) {
			state.text = text;
			if (color) state.color = color;
			if (timeout) state.timeout = timeout;
			if (isMultiline) state.isMultiline = isMultiline;
		},
	},
	actions: {
		showMessage({ commit }, payload) {
			commit('SHOW_MESSAGE', payload);
		},
	},
};
