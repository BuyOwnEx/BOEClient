export default {
	namespaced: true,

	state: {
		tickets: [
			{
				id: 1,
				subject: 'theme',
				body: 'content',
				category: 'category',
				priority: 'high',
				status: 'completed',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
			{
				id: 12,
				subject: 'theme',
				body: 'content',
				category: 'category',
				priority: 'high',
				status: 'completed',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
			{
				id: 13,
				subject: 'theme',
				body: 'content',
				category: 'category',
				priority: 'high',
				status: 'completed',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
			{
				id: 14,
				subject: 'theme',
				body: 'content',
				category: 'category',
				priority: 'low',
				status: 'processing',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
			{
				id: 15,
				subject: 'theme',
				body: 'content',
				category: 'category',
				priority: 'medium',
				status: 'closed',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
		],
		supportTypes: [
			{
				name: 'Тикеты',
				type: 'processing',
				icon: 'mdi-dots-horizontal',
				color: 'primary',
			},
			{
				name: 'Выполненные тикеты',
				type: 'completed',
				icon: 'mdi-check',
				color: 'green',
			},
			{
				name: 'Закрытые тикеты',
				type: 'closed',
				icon: 'mdi-close',
				color: 'red',
			},
		],
		priorityList: null,
		statusList: null,
		tagList: null,
	},

	getters: {
		getCompletedTickets(store) {
			return store.tickets.filter(ticket => ticket.status === 'completed');
		},
		getProcessingTickets(store) {
			return store.tickets.filter(ticket => ticket.status === 'processing');
		},
		getCanceledTickets(store) {
			return store.tickets.filter(ticket => ticket.status === 'canceled');
		},

		getProcessingTicketsQuantity(_, getters) {
			return getters.getProcessingTickets.length;
		},
	},

	mutations: {
		FETCH_TICKETS(state, tickets) {
			state.tickets = tickets;
		},
		FETCH_PRIORITY_LIST(state, list) {
			state.priorityList = list;
		},
		FETCH_STATUS_LIST(state, list) {
			state.statusList = list;
		},
		FETCH_TAG_LIST(state, list) {
			state.tagList = list;
		},
	},

	actions: {
		async fetchTickets({ commit }) {
			try {
				const { data } = await axios.get('/trader/tickets');
				commit('FETCH_TICKETS', data.tickets.results);
				console.log('fetch tickets', data);
			} catch (e) {
				console.error(e);
			}
		},
		async fetchPriorityList({ commit }) {
			try {
				const { data } = await axios.get('/trader/ticket/priorities');
				commit('FETCH_PRIORITY_LIST', data.tickets.results);
				console.log('fetch priorities', data);
			} catch (e) {
				console.error(e);
			}
		},
		async fetchStatusList({ commit }) {
			try {
				const { data } = await axios.get('/trader/ticket/statuses');
				commit('FETCH_STATUS_LIST', data.tickets.results);
				console.log('fetch statuses', data);
			} catch (e) {
				console.error(e);
			}
		},
		async fetchTagList({ commit }) {
			try {
				const { data } = await axios.get('/trader/ticket/tags');
				commit('FETCH_TAG_LIST', data.tickets.results);
				console.log('fetch tags', data);
			} catch (e) {
				console.error(e);
			}
		},
		async fetchCommentsById({ commit }, id) {
			try {
				const { data } = await axios.get('/trader/ticket/comments', {
					params: { id },
				});
				commit('FETCH_COMMENTS', data.tickets.results);
				console.log('fetch tags', data);
			} catch (e) {
				console.error(e);
			}
		},

		async addTicket({ commit }, ticket) {
			try {
				const { data } = await axios.post('/trader/ticket/create', ticket);
				commit('ADD_TICKET', data);
				console.log('add ticket', ticket, data);
			} catch (e) {
				console.error(e);
			}
		},
		async removeTicket({ commit }, id) {},
	},
};
