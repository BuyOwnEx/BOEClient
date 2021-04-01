export default {
	namespaced: true,

	state: {
		notifications: [
			{
				id: 124112455,
				title: 'Disk capacity is at maximum',
				subtitle:
					'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint, repudiandae?',
				text:
					'text text text text text text text text text text text text text text text text text text text text',
				author: 'author(?)',
				type: 'system',
				created_at: '2021-03-31T02:49:29.847Z',
				isChecked: true,
				labels: [1],
			},
			{
				id: 12414355,
				title: 'Disk capacity is at maximum',
				subtitle:
					'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint, repudiandae?',
				text:
					'text text text text text text text text text text text text text text text text text text text text',
				author: 'author(?)',
				type: 'system',
				created_at: '2021-03-31T02:49:29.847Z',
				isChecked: true,
				labels: [],
			},
			{
				id: 124633155,
				title: 'Disk capacity is at maximum',
				subtitle:
					'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint, repudiandae?',
				text:
					'text text text text text text text text text text text text text text text text text text text text',
				author: 'author(?)',
				type: 'system',
				created_at: '2021-03-31T02:49:29.847Z',
				isChecked: false,
				labels: [1, 2],
			},
			{
				id: 1242155,
				title: 'Disk capacity is at maximum',
				subtitle:
					'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint, repudiandae?',
				text:
					'text text text text text text text text text text text text text text text text text text text text',
				author: 'author(?)',
				type: 'news',
				created_at: '2021-03-31T02:49:29.847Z',
				isChecked: false,
				labels: [1, 2],
			},
			{
				id: 234232,
				title: 'Disk capacity is at maximum',
				subtitle:
					'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint, repudiandae?',
				text:
					'text text text text text text text text text text text text text text text text text text text text',
				author: 'author(?)',
				type: 'news',
				created_at: '2021-03-31T02:49:29.847Z',
				isChecked: false,
				labels: [1],
			},
		],
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
		],
	},

	getters: {
		getSystemNotifications(state) {
			return state.notifications.filter(item => item.type === 'system');
		},
		getNewsNotifications(state) {
			return state.notifications.filter(item => item.type === 'news');
		},

		getSystemNotificationUnreadQuantity(_, getters) {
			const nonChekcedArray = getters.getSystemNotifications.filter(
				item => item.isChecked !== true
			);
			return nonChekcedArray.length;
		},
		getNewsNotificationUnreadQuantity(_, getters) {
			const nonChekcedArray = getters.getNewsNotifications.filter(
				item => item.isChecked !== true
			);
			return nonChekcedArray.length;
		},

		getFirstFiveNotificationsForToolbar(state) {
			return state.notifications.slice(0, 5);
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
		readNotification({ commit }, id) {
			console.log(id);
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
