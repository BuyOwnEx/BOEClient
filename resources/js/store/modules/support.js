export default {
	namespaced: true,

	state: {
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
				name: 'Низкий',
				key: 'low',
				color: 'warning',
			},
			{
				id: 3,
				name: 'Средний',
				key: 'normal',
				color: 'orange',
			},
			{
				id: 4,
				name: 'Высокий',
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

		tickets: null,
		totalTicketsCount: null,
		prevPage: null,
		nextPage: null,
	},

	getters: {
		getTicketsByStatus: store => status => {
			if (!store.tickets) return;
			if (status === 'all') {
				return store.tickets.filter(ticket => ticket.status !== 'closed');
			}
			return store.tickets.filter(ticket => ticket.status === status);
		},
		getTicketsByPriority: store => priority => {
			if (!store.tickets) return;
			return store.tickets.filter(ticket => ticket.priority === priority);
		},
		getTicketsByPriorityAndStatus: store => (priority, status) => {
			if (!store.tickets) return;
			return store.tickets.filter(
				ticket => ticket.priority === priority && ticket.status === status
			);
		},
		getQuantityByStatus: (state, getters) => status => {
			const dataArray = getters.getTicketsByStatus(status);
			if (dataArray) return dataArray.length;
		},
	},

	mutations: {
		SET_DATA(state, tickets) {
			state.nextPage = tickets.next_page;
			state.prevPage = tickets.prev_page;
			state.totalTicketsCount = tickets.count;
			state.tickets = tickets.results.sort(
				(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
			);
		},

		ADD_TICKET(state, ticket) {
			state.tickets.unshift(ticket);
		},
		CLOSE_TICKET(state, ticketID) {
			const ticketIndex = state.tickets.findIndex(item => item.id === ticketID);
			state.tickets[ticketIndex].status = 'closed';
		},

		CLEAR_TICKETS(state) {
			state.tickets = null;
		},
	},

	actions: {
		async fetchTickets({ commit }) {
			commit('CLEAR_TICKETS');

			const { data } = await axios.get('/trader/tickets');

			commit('SET_DATA', data.tickets);
		},
		async fetchNextOrPrevPage({ commit }, { type, page }) {
			commit('CLEAR_TICKETS');

			if (type === 'next') {
				// const { data } = await axios.get('/', { page });
			} else if (type === 'prev') {
				// const { data } = await axios.get('/', { page });
			}

			commit('SET_DATA', data.tickets);
		},

		async fetchCommentsById({ commit }, id) {
			const { data } = await axios.get('/trader/ticket/comments', {
				params: { id },
			});
			return _.forEach(data.comments.comments, value => {
				let user = _.find(data.comments.users, user => {
					return user.id === value.author_id;
				});
				_.extend(value, { author: user.name });
			});
		},
		async addTicketComment({ commit }, { ticketId, body, file }) {
			const fd = new FormData();
			fd.append('id', ticketId);
			fd.append('body', body);
			if (file) fd.append('file', file);

			return await axios.post('/trader/ticket/comment/add', fd, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		},

		async addTicket({ commit }, { file, subject, body, priority }) {
			const fd = new FormData();
			fd.append('subject', subject);
			fd.append('body', body);
			fd.append('priority', priority);
			if (file) fd.append('file', file);

			const { data } = await axios.post('/trader/ticket/create', fd, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			commit('ADD_TICKET', data.ticket.ticket);
		},
		async closeTicket({ commit }, ticketID) {
			await axios.post('/trader/ticket/close', { id: ticketID });
			commit('CLOSE_TICKET', ticketID);
		},
	},
};
