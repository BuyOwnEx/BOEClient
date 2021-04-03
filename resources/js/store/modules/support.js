export default {
	namespaced: true,

	state: {
		tickets: [
			{
				id: 1,
				subject: 'У меня есть проблемы с тем и тем',
				body: 'enters \n \n test <b>b tag</b>',
				category: 'service',
				priority: 'urgent',
				status: 'pending',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
				tags: ['123', 'rtwertwert', 'wwwrtqt'],
			},
			{
				id: 12,
				subject: 'theme',
				body: 'content',
				category: 'service',
				priority: 'normal',
				status: 'hold',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
				tags: ['123', 'rtwertwert', 'wwwrtqt'],
			},
			{
				id: 13,
				subject: 'theme',
				body: 'content',
				category: 'finance',
				priority: 'normal',
				status: 'solved',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
				tags: ['123', 'rtwertwert', 'wwwrtqt'],
			},
			{
				id: 14,
				subject: 'theme',
				body: 'content',
				category: 'technical',
				priority: 'high',
				status: 'open',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
				tags: ['123', 'rtwertwert', 'wwwrtqt'],
			},
			{
				id: 134,
				subject: 'theme',
				body: 'content',
				category: 'technical',
				priority: 'low',
				status: 'open',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
				tags: ['123', 'rtwertwert', 'wwwrtqt'],
			},
			{
				id: 144,
				subject: 'theme',
				body: 'content',
				category: 'technical',
				priority: 'normal',
				status: 'open',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
				tags: ['123', 'rtwertwert', 'wwwrtqt'],
			},
			{
				id: 135,
				subject: 'theme',
				body:
					'contentcontent contentcontentcontentcontentcontentcontentcontentconten tcontentcontentcontentconte ntcontentco ntentcontentcontentcontent contentconten tcontentcontentcontentcontentcont entcontentcontentcontentcontentcontentcontentcont entcontentcontentcontentcontentcontentcontentcontentcontentconten tcontentcontentcontent',
				category: 'technical',
				priority: 'normal',
				status: 'open',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
				tags: ['123', 'rtwertwert', 'wwwrtqt'],
			},
			{
				id: 1335,
				subject: 'theme',
				body:
					'contentcontent contentcontentcontentcontentcontentcontentcontentconten tcontentcontentcontentconte ntcontentco ntentcontentcontentcontent contentconten tcontentcontentcontentcontentcont entcontentcontentcontentcontentcontentcontentcont entcontentcontentcontentcontentcontentcontentcontentcontentconten tcontentcontentcontent',
				category: 'technical',
				priority: 'normal',
				status: 'open',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
				tags: ['123'],
			},
			{
				id: 13335,
				subject: 'theme',
				body:
					'contentcontent contentcontentcontentcontentcontentcontentcontentconten tcontentcontentcontentconte ntcontentco ntentcontentcontentcontent contentconten tcontentcontentcontentcontentcont entcontentcontentcontentcontentcontentcontentcont entcontentcontentcontentcontentcontentcontentcontentcontentconten tcontentcontentcontent',
				category: 'technical',
				priority: 'normal',
				status: 'new',
				agent: 'agent',
				created_at: '2021-03-31T02:49:29.847Z',
				updated_at: '2021-03-31T02:49:29.847Z',
				completed_at: '2021-03-31T02:49:29.847Z',
				tags: ['123', 'wwwrtqt'],
			},
		],
		supportTypes: [
			{
				name: 'Все тикеты',
				key: 'all',
				icon: 'mdi-dots-horizontal',
				color: 'primary',
			},
			{
				name: 'Новые',
				key: 'new',
				icon: 'mdi-dots-horizontal',
				color: 'primary',
			},
			{
				name: 'Открытые',
				key: 'open',
				icon: 'mdi-dots-horizontal',
				color: 'primary',
			},
			{
				name: 'Ожидающие',
				key: 'pending',
				icon: 'mdi-circle-slice-2',
				color: 'yellow',
			},
			{
				name: 'На удержании',
				key: 'hold',
				icon: 'mdi-circle-slice-2',
				color: 'yellow',
			},
			{
				name: 'Выполненные',
				key: 'solved',
				icon: 'mdi-check',
				color: 'green',
			},
			{
				name: 'Закрытые',
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
				key: 'normal',
				color: 'orange',
			},
			{
				id: 3,
				name: 'Высокий приоритет',
				key: 'high',
				color: 'error',
			},
			{
				id: 4,
				name: 'Срочный',
				key: 'urgent',
				color: 'error',
			},
		],
		// priorityList: null,
		// statusList: null,
		// tagList: null,
	},

	getters: {
		getTicketsByStatus: store => status => {
			return store.tickets.filter(ticket => ticket.status === status);
		},
		getTicketsByPriority: store => priority => {
			return store.tickets.filter(ticket => ticket.priority === priority);
		},
		getQuantityByStatus: (state, getters) => status => {
			return getters.getTicketsByStatus(status).length;
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
		CLOSE_TICKET(state, ticketID) {
			const ticketIndex = state.tickets.findIndex(item => item.id === ticketID);
			state.tickets[ticketIndex].status = 'closed';
		},
	},

	actions: {
		async fetchTickets({ commit }) {
			const { data } = await axios.get('/trader/tickets');
			commit('FETCH_TICKETS', data.tickets.results);
			console.log('fetch tickets', data);
		},
		async fetchPriorityList({ commit }) {
			const { data } = await axios.get('/trader/ticket/priorities');
			commit('FETCH_PRIORITY_LIST', data.tickets.results);
			console.log('fetch priorities', data);
		},
		async fetchStatusList({ commit }) {
			const { data } = await axios.get('/trader/ticket/statuses');
			commit('FETCH_STATUS_LIST', data.tickets.results);
			console.log('fetch statuses', data);
		},
		async fetchTagList({ commit }) {
			const { data } = await axios.get('/trader/ticket/tags');
			commit('FETCH_TAG_LIST', data.tickets.results);
			console.log('fetch tags', data);
		},

		async fetchCommentsById({ commit }, id) {
			const { data } = await axios.get('/trader/ticket/comments', {
				params: { id },
			});
			return data.comments.comments;
		},

		async addTicket({ commit }, ticket) {
			commit('ADD_TICKET', ticket);
			// const { data } = await axios.post('/trader/ticket/create', ticket);
			// commit('ADD_TICKET', data.data.ticket);
		},
		async closeTicket({ commit }, ticketID) {
			// await axios.delete('')
			await new Promise(res => {
				setTimeout(() => {
					res();
				}, 1000);
			});
			commit('CLOSE_TICKET', ticketID);
		},
	},
};
