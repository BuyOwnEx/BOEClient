export default {
	namespaced: true,

	state: {
		notifications: null,

		notificationTypes: [
			{
				name: 'Системные',
				type: 'system',
				icon: 'mdi-email-outline',
				color: 'primary',
			},
			{
				name: 'Новости',
				type: 'news',
				icon: 'mdi-newspaper-variant-outline',
				color: 'green',
			},
			{
				name: 'Финансы',
				type: 'finance',
				icon: 'mdi-currency-usd',
				color: 'purple',
			},
		],
		notificationsKinds: [
			{
				id: 1,
				key: 'login',
				subject: 'subject',
			},
			{
				id: 2,
				key: 'addMoney',
				subject: 'subject',
			},
			{
				id: 3,
				key: 'withdrawMoney',
				subject: 'subject',
			},
			{
				id: 4,
				key: 'ref',
				subject: 'subject',
			},
			{
				id: 5,
				key: 'tradingBlock',
				subject: 'subject',
			},
			{
				id: 6,
				key: 'moneyBlock',
				subject: 'subject',
			},
			{
				id: 7,
				key: 'systemBlock',
				subject: 'subject',
			},
			{
				id: 8,
				key: 'positionLiquidationWarn',
				subject: 'subject',
			},
			{
				id: 9,
				key: 'positionLiquidation',
				subject: 'subject',
			},
			{
				id: 10,
				key: 'maintenance',
				subject: 'subject',
			},
			{
				id: 11,
				key: 'news',
				subject: 'subject',
			},
		],
	},

	getters: {
		getNotificationsByType: state => type => {
			if (!state.notifications) return;
			return state.notifications.filter(item => item.type === type);
		},
		getNotificationsUnreadQuantityByType: (_, getters) => type => {
			const dataArray = getters.getNotificationsByType(type);
			if (dataArray) {
				const nonCheckedArray = dataArray.filter(
					item => item.isChecked !== true
				);
				return nonCheckedArray.length;
			}
		},

		getUnreadNotifications(state) {
			if (!state.notifications) return;
			return state.notifications.filter(item => !item.isChecked);
		},
		getFirstFiveUnreadNotificationsForToolbar(_, getters) {
			const dataArray = getters.getUnreadNotifications;
			if (dataArray) return dataArray.slice(0, 5);
		},
		getUnreadNotificationsQuantity(_, getters) {
			const dataArray = getters.getUnreadNotifications;
			if (dataArray) return dataArray.length;
		},

		getNotificationColor: state => type => {
			const typeItem = state.notificationTypes.find(item => item.type === type);
			return typeItem.color;
		},
		getNotificationIcon: state => type => {
			const typeItem = state.notificationTypes.find(item => item.type === type);
			return typeItem.icon;
		},
	},

	mutations: {
		SET_NOTIFICATIONS(state, notifications) {
			state.notifications = notifications;
		},

		READ_NOTIFICATION(state, id) {
			const itemIndex = state.notifications.findIndex(item => item.id === id);
			state.notifications[itemIndex].isChecked = true;
		},
		READ_SELECTED(state, selectedArray) {
			selectedArray.forEach(id => {
				const itemIndex = state.notifications.findIndex(item => item.id === id);
				state.notifications[itemIndex].isChecked = true;
			});
		},
		REMOVE_SELECTED(state, selectedArray) {
			state.notifications = state.notifications.filter(item => {
				return selectedArray.indexOf(item.id) === -1;
			});
		},
	},

	actions: {
		async fetchNotifications({ commit }) {
			const { data } = await axios.get('/trader/notifications');
			commit('SET_NOTIFICATIONS', data.notifications);
		},

		readNotification({ commit }, id) {
			commit('READ_NOTIFICATION', id);
			// запрос на бек
		},
		readSelected({ commit }, selectedArray) {
			commit('READ_SELECTED', selectedArray);
			// запрос на бек
		},
		removeSelected({ commit }, selectedArray) {
			commit('REMOVE_SELECTED', selectedArray);
			// запрос на бек
		},
	},
};
