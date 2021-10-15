import VueI18n from '../../plugins/vue-i18n';

export default {
	namespaced: true,

	state: {
		tickets: null,
		totalTicketsCount: null,
		perPage: 20,
		prevPage: null,
		nextPage: null,
	},

	getters: {
		supportStatuses() {
			return [
				{
					name: VueI18n.t('support.status.all'),
					key: 'all',
					icon: 'mdi-dots-horizontal',
					color: 'primary',
				},
				{
					name: VueI18n.t('support.status.new'),
					key: 'new',
					icon: 'mdi-new-box',
					color: 'primary',
				},
				{
					name: VueI18n.t('support.status.open'),
					key: 'open',
					icon: 'mdi-book-open-outline',
					color: 'primary',
				},
				{
					name: VueI18n.t('support.status.pending'),
					key: 'pending',
					icon: 'mdi-circle-slice-2',
					color: 'yellow',
				},
				{
					name: VueI18n.t('support.status.hold'),
					key: 'hold',
					icon: 'mdi-circle-slice-6',
					color: 'orange',
				},
				{
					name: VueI18n.t('support.status.solved'),
					key: 'solved',
					icon: 'mdi-check',
					color: 'green',
				},
				{
					name: VueI18n.t('support.status.closed'),
					key: 'closed',
					icon: 'mdi-close',
					color: 'red',
				},
			];
		},
		priorityList() {
			return [
				{
					id: 1,
					name: VueI18n.t('common.all'),
					key: 'all',
					color: 'primary',
				},
				{
					id: 2,
					name: VueI18n.t('support.priority.low'),
					key: 'low',
					color: 'warning',
				},
				{
					id: 3,
					name: VueI18n.t('support.priority.medium'),
					key: 'normal',
					color: 'orange',
				},
				{
					id: 4,
					name: VueI18n.t('support.priority.high'),
					key: 'high',
					color: 'error',
				},
				{
					id: 5,
					name: VueI18n.t('support.priority.urgent'),
					key: 'urgent',
					color: 'pink',
				},
			];
		},

		getTicketsByStatus: state => status => {
			if (!state.tickets) return;
			if (status === 'all') {
				return state.tickets.filter(ticket => ticket.status !== 'closed');
			}
			return state.tickets.filter(ticket => ticket.status === status);
		},
		getTicketsByPriority: state => priority => {
			if (!state.tickets) return;
			return state.tickets.filter(ticket => ticket.priority === priority);
		},
		getTicketsByPriorityAndStatus: state => (priority, status) => {
			if (!state.tickets) return;
			return state.tickets.filter(ticket => ticket.priority === priority && ticket.status === status);
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
			state.tickets = tickets.results.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
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
