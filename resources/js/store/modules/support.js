import VueI18n from '../../plugins/vue-i18n';

export default {
	namespaced: true,
	state: {
		tickets: [],
        loading: false,
		total: 0
	},
	getters: {
		support_statuses() {
			return [
				{
					name: VueI18n.t('common.all'),
					key: 'all',
					icon: 'mdi-dots-horizontal',
					color: 'primary',
				},
				{
					name: VueI18n.t('support.status.new'),
					key: 'new',
					icon: 'mdi-moon-new',
					color: 'primary',
				},
				{
					name: VueI18n.t('support.status.pending'),
					key: 'pending',
					icon: 'mdi-circle-slice-2',
					color: 'accent',
				},
				{
					name: VueI18n.t('support.status.hold'),
					key: 'hold',
					icon: 'mdi-timer-pause-outline',
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
        priority_list() {
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
					color: 'green',
				},
				{
					id: 3,
					name: VueI18n.t('support.priority.medium'),
					key: 'medium',
					color: 'orange',
				},
				{
					id: 4,
					name: VueI18n.t('support.priority.high'),
					key: 'high',
					color: 'error',
				}
			];
		},
        get_quantity_by_status: (state, getters) => status => {
            const dataArray = getters.get_tickets_by_status(status);
            if (dataArray) return dataArray.length;
        },
        get_tickets_by_status: state => status => {
			if (!state.tickets) return;
			if (status === 'all') {
				return state.tickets.filter(ticket => ticket.status !== 'closed');
			}
			return state.tickets.filter(ticket => ticket.status === status);
		},
        get_tickets_by_priority: state => priority => {
			if (!state.tickets) return;
			return state.tickets.filter(ticket => ticket.priority === priority);
		},
        get_tickets_by_priority_and_status: state => (priority, status) => {
			if (!state.tickets) return;
			return state.tickets.filter(ticket => ticket.priority === priority && ticket.status === status);
		},

	},

	mutations: {
        SET_LOADING(state, loading) {
            state.loading = loading
        },
		SET_DATA(state, data) {
			state.total = data.total;
			state.tickets = data.tickets;
		},
		ADD_TICKET(state, ticket) {
			state.tickets.unshift(ticket);
		},
		CLOSE_TICKET(state, ticketID) {
			const ticketIndex = state.tickets.findIndex(item => item.id.toString() === ticketID.toString());
			if (ticketIndex > -1) state.tickets[ticketIndex].status = 'closed';
		},
	},

	actions: {
		async fetchTickets({ commit }) {
            commit('SET_LOADING', true)
            try
            {
                const { data } = await axios.get('/trader/tickets');
                commit('SET_DATA', data);
            } catch (error) {
                console.log(error)
            } finally {
                commit('SET_LOADING', false)
            }
		},
        async fetchTicket({ commit }, ticket_id) {
            const { data } = await axios.get('/trader/ticket/info', {
                params: { ticket_id },
            });
            return data;
        },
        async fetchAttachmentsByTicket({ commit }, ticket_id) {
            const { data } = await axios.get('/trader/ticket/attachments', {
                params: { ticket_id },
            });
            return data;
        },
        async fetchCommentsByTicket({ commit }, ticket_id) {
            const { data } = await axios.get('/trader/ticket/comments', {
                params: { ticket_id },
            });
            return data;
        },

		async addTicketComment({ commit }, { ticket_id, message, files }) {
			const fd = new FormData();
			fd.append('ticket_id', ticket_id);
			fd.append('message', message);
            _.each(files, function (value, key) {
                fd.append('files['+key+']', value, value.name);
            });
			return await axios.post('/trader/ticket/add_comment', fd, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		},
		async addTicket({ commit }, { title, message, priority, files }) {
			const fd = new FormData();
			fd.append('title', title);
			fd.append('message', message);
			fd.append('priority', priority);
            _.each(files, function (value, key) {
                fd.append('files['+key+']', value, value.name);
            });
			const { data } = await axios.post('/trader/ticket/create', fd, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			commit('ADD_TICKET', data.ticket);
		},
		async closeTicket({ commit }, ticketID) {
			await axios.post('/trader/ticket/close', { id: ticketID });
			commit('CLOSE_TICKET', ticketID);
		},
	},
};
