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

		getNotificationsByType: state => typeID => {
			if (!state.notifications) return;
			return state.notifications.filter(item => item.type_id === typeID);
		},
		getNotificationsUnreadQuantityByType: (_, getters) => typeID => {
			const dataArray = getters.getNotificationsByType(typeID);
			if (dataArray?.length) {
				const nonCheckedArray = dataArray.filter(item => !item.read);
				console.log(typeID, nonCheckedArray);
				return nonCheckedArray.length;
			}
		},

		getUnreadNotifications(state) {
			if (!state.notifications) return;
			return state.notifications.filter(item => !item.read);
		},
		getFirstFiveUnreadNotificationsForToolbar(state, getters) {
			const dataArray = getters.getUnreadNotifications;
			if (dataArray) return dataArray.slice(0, 5);
		},
		getUnreadNotificationsQuantity(_, getters) {
			const dataArray = getters.getUnreadNotifications;
			return dataArray?.length || 0;
		},

		getNotificationColor: (_, getters) => typeID => {
			const typeItem = getters.notificationTypes.find(item => item.id === typeID);
			return typeItem?.color;
		},
		getNotificationIcon: (_, getters) => typeID => {
			const typeItem = getters.notificationTypes.find(item => item.id === typeID);
			return typeItem?.icon;
		},
		getNotificationKindSubject: (_, getters) => kindID => {
			return getters.notificationsKinds.find(k => k.id === kindID)?.subject;
		},
		getNotificationSubTitleText: () => item => {
			if (!item) return;
			try {
				const obj = JSON.parse(item.params);
				switch (item.subtype_id) {
					case 1:
						return VueI18n.t('notifications.kinds.login.text', [obj.ip]);
					case 2:
						return VueI18n.t('notifications.kinds.trading_block.text');
					case 3:
						return VueI18n.t('notifications.kinds.money_block.text');
					case 4:
						return VueI18n.t('notifications.kinds.system_block.text');
					case 5:
						return VueI18n.t('notifications.kinds.ref.text', [obj.amount, obj.currency]);
					case 6:
						return VueI18n.t('notifications.kinds.position_liquidation_warn.text');
					case 7:
						return VueI18n.t('notifications.kinds.position_liquidation.text');
					case 8:
						return VueI18n.t('notifications.kinds.add_money.text', [obj.amount, obj.currency]);
					case 9:
						return VueI18n.t('notifications.kinds.withdraw_money.text', [obj.amount, obj.currency]);
					default:
						return '';
				}
			} catch (e) {
				console.error(e);
			}
		},
	},

	mutations: {
		SET_NOTIFICATIONS(state, notifications) {
			state.notifications = notifications;
		},

		READ_NOTIFICATION(state, id) {
			const itemIndex = state.notifications.findIndex(item => item.id === id);
			state.notifications[itemIndex].read = true;
		},

		READ_ALL(state) {
			state.notifications.forEach(n => (n.read = true));
		},
		DELETE_ALL(state) {
			state.notifications = [];
		},

		READ_SELECTED(state, selectedArray) {
			selectedArray.forEach(id => {
				const itemIndex = state.notifications.findIndex(item => item.id === id);
				state.notifications[itemIndex].read = true;
			});
		},
		DELETE_SELECTED(state, selectedArray) {
			state.notifications = state.notifications.filter(item => {
				return selectedArray.indexOf(item.id) === -1;
			});
		},
	},

	actions: {
		async fetchNotifications({ commit }) {
			const { data } = await axios.get('/trader/ext/all_notifications');
			commit('SET_NOTIFICATIONS', data.data);
		},

		async readNotification({ commit }, id) {
			commit('READ_NOTIFICATION', id);
			await axios.post('/trader/ext/notification/read', { notification_id: id });
		},
		async deleteNotification({ commit }, id) {
			commit('DELETE_NOTIFICATION', id);
			await axios.post('/trader/ext/notification/delete', { notification_id: id });
		},

		async readAll({ commit }) {
			commit('READ_ALL');
			await axios.post('/trader/ext/notifications/read_all');
		},
		async deleteAll({ commit }) {
			commit('DELETE_ALL');
			await axios.post('/trader/ext/notifications/delete_all');
		},

		readSelected({ commit }, selectedArray) {
			commit('READ_SELECTED', selectedArray);
			// back req
		},
		deleteSelected({ commit }, selectedArray) {
			commit('DELETE_SELECTED', selectedArray);
			// back req
		},
	},
};
