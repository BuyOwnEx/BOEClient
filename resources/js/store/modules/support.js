export default {
	namespaced: true,

	state: {
		tickets: [
			{
				id: 1,
				theme: 'theme',
				description: 'description',
				category: 'category',
				status: 'solved',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
			{
				id: 1434,
				theme: 'theme',
				description: 'description',
				category: 'category',
				status: 'solved',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
			{
				id: 112412,
				theme: 'theme',
				description: 'description',
				category: 'category',
				status: 'processing',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
		],
	},

	getters: {
		getSolvedTickets(store) {},
		getProcessingTickets(store) {},
		getCanceledTickets(store) {},

		getProcessingTicketsQuantity(_, getters) {
			return getters.getProcessingTickets.length;
		},
	},

	mutations: {
		FETCH_TICKETS(state, tickets) {
			state.tickets = tickets;
		},
	},

	actions: {
		fetchTickets({ commit }) {
			axios
				.get()
				.then(res => {
					commit('FETCH_TICKETS', res.data.data);
				})
				.catch(e => {
					console.error(e);
				});
		},
		addTicket({ commit }, ticket) {},
		removeTicket({ commit }, id) {},
	},
};
