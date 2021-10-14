import VueI18n from '../../plugins/vue-i18n';

export default {
	namespaced: true,

	state: {
		notifications: null,
	},

	getters: {
		notificationTypes() {
			return [
				{
					id: 1,
					name: VueI18n.t('notifications.types.system'),
					type: 'system',
					icon: 'mdi-email-outline',
					color: 'primary',
				},
				{
					id: 2,
					name: VueI18n.t('notifications.types.finance'),
					type: 'finance',
					icon: 'mdi-currency-usd',
					color: 'purple',
				},
				{
					id: 3,
					name: VueI18n.t('notifications.types.funds'),
					type: 'funds',
					icon: 'mdi-newspaper-variant-outline',
					color: 'green',
				},
			];
		},
		notificationsKinds() {
			return [
				{
					id: 1,
					key: 'login',
					subject: VueI18n.t('notifications.kinds.login.subject'),
					title: VueI18n.t('notifications.kinds.login.title'),
				},
				{
					id: 2,
					key: 'tradingBlock',
					subject: VueI18n.t('notifications.kinds.trading_block.subject'),
					title: VueI18n.t('notifications.kinds.trading_block.title'),
				},
				{
					id: 3,
					key: 'moneyBlock',
					subject: VueI18n.t('notifications.kinds.money_block.subject'),
					title: VueI18n.t('notifications.kinds.money_block.title'),
				},
				{
					id: 4,
					key: 'systemBlock',
					subject: VueI18n.t('notifications.kinds.system_block.subject'),
					title: VueI18n.t('notifications.kinds.system_block.title'),
				},

				{
					id: 5,
					key: 'ref',
					subject: VueI18n.t('notifications.kinds.ref.subject'),
					title: VueI18n.t('notifications.kinds.ref.title'),
				},
				{
					id: 6,
					key: 'positionLiquidationWarn',
					subject: VueI18n.t('notifications.kinds.position_liquidation_warn.subject'),
					title: VueI18n.t('notifications.kinds.position_liquidation_warn.title'),
				},
				{
					id: 7,
					key: 'positionLiquidation',
					subject: VueI18n.t('notifications.kinds.position_liquidation.subject'),
					title: VueI18n.t('notifications.kinds.position_liquidation.title'),
				},

				{
					id: 8,
					key: 'addMoney',
					subject: VueI18n.t('notifications.kinds.add_money.subject'),
					title: VueI18n.t('notifications.kinds.add_money.title'),
				},
				{
					id: 9,
					key: 'withdrawMoney',
					subject: VueI18n.t('notifications.kinds.withdraw_money.subject'),
					title: VueI18n.t('notifications.kinds.withdraw_money.title'),
				},
			];
		},

		getNotificationsByType: state => type => {
			if (!state.notifications) return;
			return state.notifications.filter(item => item.type === type);
		},
		getNotificationsUnreadQuantityByType: (_, getters) => type => {
			const dataArray = getters.getNotificationsByType(type);
			if (dataArray) {
				const nonCheckedArray = dataArray.filter(item => !item.read_at);
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

		getNotificationColor: (_, getters) => type => {
			const typeItem = getters.notificationTypes.find(item => item.type === type);
			return typeItem.color;
		},
		getNotificationIcon: (_, getters) => type => {
			const typeItem = getters.notificationTypes.find(item => item.type === type);
			return typeItem.icon;
		},
		getNotificationKindSubject: (_, getters) => kindID => {
			return getters.notificationsKinds.find(k => k.id === kindID).subject;
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
			const { data } =  await axios.get('/trader/ext/all_notifications');
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
