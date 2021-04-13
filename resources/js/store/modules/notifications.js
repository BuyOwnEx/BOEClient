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
				subject: 'Новый вход в систему',
				title: 'Уведомлять о входе в систему',
			},
			{
				id: 2,
				key: 'addMoney',
				subject: 'Пополнение средств',
				title: 'Уведомлять о пополнении средств',
			},
			{
				id: 3,
				key: 'withdrawMoney',
				subject: 'Вывод средств',
				title: 'Уведомлять о выводе средств ',
			},
			{
				id: 4,
				key: 'ref',
				subject: 'Начислены реферальные',
				title: 'Уведомлять о начислении реферальных',
			},
			{
				id: 5,
				key: 'tradingBlock',
				subject: 'Блокировка торговых операций',
				title: 'Уведомлять о блокировке по торговым операциям',
			},
			{
				id: 6,
				key: 'moneyBlock',
				subject: 'Блокировка ввода/вывода',
				title: 'Уведомлять о блокировке по вводу/выводу средств',
			},
			{
				id: 7,
				key: 'systemBlock',
				subject: 'Системная блокировка',
				title: 'Уведомлять о системной блокировке',
			},
			{
				id: 8,
				key: 'positionLiquidationWarn',
				subject: 'Скорая ликвидация средств',
				title: 'Уведомлять о скорой ликвидации позиции',
			},
			{
				id: 9,
				key: 'positionLiquidation',
				subject: 'Ликвидация позиции',
				title: 'Уведомлять о ликвидации позиции',
			},
			{
				id: 10,
				key: 'maintenance',
				subject: 'Тех. обслуживание',
				title: 'Уведомлять о предстоящем тех. обслуживании биржи',
			},
			{
				id: 11,
				key: 'news',
				subject: 'Новости биржи',
				title: 'Уведомлять о новостях',
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
					item => !item.read_at
				);
				return nonCheckedArray.length;
			}
		},

		getUnreadNotifications(state) {
			if (!state.notifications) return;
			return state.notifications.filter(item => !item.read_at);
		},
		getFirstFiveUnreadNotificationsForToolbar(_, getters) {
			const dataArray = getters.getUnreadNotifications;
			if (dataArray) return dataArray.slice(0, 5);
		},
		getUnreadNotificationsQuantity(_, getters) {
			const dataArray = getters.getUnreadNotifications;
			return dataArray ? dataArray.length : 0;
		},

		getNotificationColor: state => type => {
			const typeItem = state.notificationTypes.find(item => item.type === type);
			return typeItem.color;
		},
		getNotificationIcon: state => type => {
			const typeItem = state.notificationTypes.find(item => item.type === type);
			return typeItem.icon;
		},
		getNotificationKindSubject: state => kindID => {
			return state.notificationsKinds.find(k => k.id === kindID).subject;
		},
	},

	mutations: {
		SET_NOTIFICATIONS(state, notifications) {
			state.notifications = notifications;
		},

		READ_NOTIFICATION(state, id) {
			const itemIndex = state.notifications.findIndex(item => item.id === id);
			state.notifications[itemIndex].read_at = Date.now();
		},
		READ_SELECTED(state, selectedArray) {
			selectedArray.forEach(id => {
				const itemIndex = state.notifications.findIndex(item => item.id === id);
				state.notifications[itemIndex].read_at = Date.now();
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
