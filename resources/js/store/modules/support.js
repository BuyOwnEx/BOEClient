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

		tickets: null,
		prevPage: null,
		nextPage: null,
	},

	getters: {
		getTicketsByStatus: store => status => {
			if (store.tickets) {
				return store.tickets.filter(ticket => ticket.status === status);
			}
		},
		getTicketsByPriority: store => priority => {
			if (store.tickets) {
				return store.tickets.filter(ticket => ticket.priority === priority);
			}
		},
		getTicketsByPriorityAndStatus: store => (priority, status) => {
			if (store.tickets) {
				return store.tickets.filter(
					ticket => ticket.priority === priority && ticket.status === status
				);
			}
		},
		getQuantityByStatus: (state, getters) => status => {
			const dataArray = getters.getTicketsByStatus(status);
			if (dataArray) return dataArray.length;
		},
	},

	mutations: {
		FETCH_TICKETS(state, tickets) {
			state.nextPage = tickets.next_page;
			state.prevPage = tickets.prev_page;
			state.tickets = tickets.results.slice().reverse();
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
			commit('FETCH_TICKETS', data.tickets);
			console.log('fetch tickets', data);
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

		async addTicket({ commit }, ticket) {
			const { data } = await axios.post('/trader/ticket/create', ticket);
			commit('ADD_TICKET', data.ticket.ticket);
		},
		async closeTicket({ commit }, ticketID) {
			await axios.post('/trader/ticket/close', { id: ticketID });
			commit('CLOSE_TICKET', ticketID);
		},
	},
};
