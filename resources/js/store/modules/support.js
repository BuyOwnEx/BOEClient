export default {
	namespaced: true,

	state: {
		tickets: [
			{
				id: 1,
				subject: 'theme',
				body: 'content',
				category: 'service',
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
				category: 'service',
				priority: 'medium',
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
				category: 'finance',
				priority: 'medium',
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
				category: 'technical',
				priority: 'high',
				status: 'processing',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
			{
				id: 134,
				subject: 'theme',
				body: 'content',
				category: 'technical',
				priority: 'low',
				status: 'processing',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
			{
				id: 144,
				subject: 'theme',
				body: 'content',
				category: 'technical',
				priority: 'medium',
				status: 'processing',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
			},
			{
				id: 15,
				subject: 'theme',
				body:
					'contentcontent contentcontentcontentcontentcontentcontentcontentconten tcontentcontentcontentconte ntcontentco ntentcontentcontentcontent contentconten tcontentcontentcontentcontentcont entcontentcontentcontentcontentcontentcontentcont entcontentcontentcontentcontentcontentcontentcontentcontentconten tcontentcontentcontent',
				category: 'technical',
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
				key: 'processing',
				icon: 'mdi-dots-horizontal',
				color: 'primary',
			},
			{
				name: 'Выполненные тикеты',
				key: 'completed',
				icon: 'mdi-check',
				color: 'green',
			},
			{
				name: 'Закрытые тикеты',
				key: 'closed',
				icon: 'mdi-close',
				color: 'red',
			},
		],
		categoryList: [
			{
				id: 1,
				name: 'Техническая служба',
				key: 'technical',
				color: 'blue',
			},
			{
				id: 2,
				name: 'Финансовая служба',
				key: 'finance',
				color: 'blue',
			},
			{
				id: 3,
				name: 'Сервисная служба',
				key: 'service',
				color: 'blue',
			},
		],
		priorityList: [
			{
				id: 1,
				name: 'Низкий приоритет',
				key: 'low',
				color: 'warning',
			},
			{
				id: 2,
				name: 'Средний приоритет',
				key: 'medium',
				color: 'orange',
			},
			{
				id: 3,
				name: 'Высокий приоритет',
				key: 'high',
				color: 'error',
			},
		],
		// priorityList: null,
		// statusList: null,
		// tagList: null,
	},

	getters: {
		getCompletedTickets(store) {
			return store.tickets.filter(ticket => ticket.status === 'completed');
		},
		getProcessingTickets(store) {
			return store.tickets.filter(ticket => ticket.status === 'processing');
		},
		getClosedTickets(store) {
			return store.tickets.filter(ticket => ticket.status === 'closed');
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

		ADD_TICKET(state, ticket) {
			console.log('store add ticket', ticket);
			state.tickets.push(ticket);
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
			commit('ADD_TICKET', ticket);
			// const { data } = await axios.post('/trader/ticket/create', ticket);
			// commit('ADD_TICKET', data.data.ticket);
		},
	},
};
