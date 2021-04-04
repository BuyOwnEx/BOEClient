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
		supportStatuses: [
			{
				name: 'Все тикеты',
				key: 'all',
				icon: 'mdi-dots-horizontal',
				color: 'primary',
			},
			{
				name: 'Новые',
				key: 'new',
				icon: 'mdi-new-box',
				color: 'primary',
			},
			{
				name: 'Открытые',
				key: 'open',
				icon: 'mdi-book-open-outline',
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
				icon: 'mdi-circle-slice-6',
				color: 'orange',
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
		priorityList: [
			{
				id: 1,
				name: 'Все',
				key: 'all',
				color: 'primary',
			},
			{
				id: 2,
				name: 'Низкий приоритет',
				key: 'low',
				color: 'warning',
			},
			{
				id: 3,
				name: 'Средний приоритет',
				key: 'normal',
				color: 'orange',
			},
			{
				id: 4,
				name: 'Высокий приоритет',
				key: 'high',
				color: 'error',
			},
			{
				id: 5,
				name: 'Срочный',
				key: 'urgent',
				color: 'pink',
			},
		],
	},

	getters: {
		getTicketsByStatus: store => status => {
			return store.tickets.filter(ticket => ticket.status === status);
		},
		getTicketsByPriority: store => priority => {
			return store.tickets.filter(ticket => ticket.priority === priority);
		},
		getTicketsByPriorityAndStatus: store => (priority, status) => {
			return store.tickets.filter(ticket => ticket.priority === priority && ticket.status === status);
		},
		getQuantityByStatus: (state, getters) => status => {
			return getters.getTicketsByStatus(status).length;
		},
	},

	mutations: {
		FETCH_TICKETS(state, tickets) {
			state.tickets = tickets;
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

		async fetchCommentsById({ commit }, id) {
			const { data } = await axios.get('/trader/ticket/comments', {
				params: { id },
			});
			return _.forEach(data.comments.comments, function(value,key) {
				let user = _.find(data.comments.users, function(user) { return user.id === value.author_id; });
				_.extend(value, {author: user.name})
			});
		},

		async addTicket({ commit }, ticket) {
			commit('ADD_TICKET', ticket);

			const { data } = await axios.post('/trader/ticket/create', ticket);
			console.log('add ticket response', data);
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
