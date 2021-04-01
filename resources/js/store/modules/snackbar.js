import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

let transformHelpers = {
	volume: function(item) {
		return BigNumber(item.price).times(BigNumber(item.actualSize)).toString();
	},
	percent: function(item) {
		if (item.status === 'partiallyFilled') {
			return parseFloat(100 - (item.actualSize * 100 / item.size)).toFixed(2);
		}
		return '';
	},
	positionPercent: function(item) {
		if (item.status === 'partiallyFilled') {
			return BigNumber(item.actualSize).times(100).div(BigNumber(item.size)).dp(2).toString();
		}
		return '';
	},
	actualSize: function(item) {
		return BigNumber(item.actualSize).toString();
	},
	size: function(item) {
		return BigNumber(item.size).toString();
	},
	price: function(item) {
		return BigNumber(item.price).toString();
	},
};

let getNotificationClass = function(item) {
	return 'success';
};

let getOrderNotificationMessage = function(item) {
	switch (item.status) {
		case 'accepted':
			if (item.side === false) {
				return `${item.lang.t('trading.notifications.order.text_buy')} ${transformHelpers.actualSize(item)} ${item.currency} ${item.lang.t('trading.notifications.order.price')} ${transformHelpers.price(item)} ${item.market} ${item.lang.t('trading.notifications.order.accepted')}`;
			}
			return `${item.lang.t('trading.notifications.order.text_sell')} ${transformHelpers.actualSize(item)} ${item.currency} ${item.lang.t('trading.notifications.order.price')} ${transformHelpers.price(item)} ${item.market} ${item.lang.t('trading.notifications.order.accepted')}`;
		case 'partiallyFilled':
			if (item.side === false) {
				return `${item.lang.t('trading.notifications.order.text_buy')} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t('trading.notifications.order.price')} ${transformHelpers.price(item)} ${item.market} ${item.lang.t('trading.notifications.order.partiallyFilled')} (${transformHelpers.percent(item)} %)`;
			}
			return `${item.lang.t('trading.notifications.order.text_sell')} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t('trading.notifications.order.price')} ${transformHelpers.price(item)} ${item.market} ${item.lang.t('trading.notifications.order.partiallyFilled')} (${transformHelpers.percent(item)} %)`;
		case 'filled':
			if (item.side === false) {
				return `${item.lang.t('trading.notifications.order.text_buy')} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t('trading.notifications.order.price')} ${transformHelpers.price(item)} ${item.market} ${item.lang.t('trading.notifications.order.filled')}`;
			}
			return `${item.lang.t('trading.notifications.order.text_sell')} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t('trading.notifications.order.price')} ${transformHelpers.price(item)} ${item.market} ${item.lang.t('trading.notifications.order.filled')}`;
		case 'cancelled':
			if (item.side === false) {
				return `${item.lang.t('trading.notifications.order.text_buy')} ${transformHelpers.actualSize(item)} ${item.currency} ${item.lang.t('trading.notifications.order.price')} ${transformHelpers.price(item)} ${item.market} ${item.lang.t('trading.notifications.order.cancel')}`;
			}
			return `${item.lang.t('trading.notifications.order.text_sell')} ${transformHelpers.actualSize(item)} ${item.currency} ${item.lang.t('trading.notifications.order.price')} ${transformHelpers.price(item)} ${item.market} ${item.lang.t('trading.notifications.order.cancel')}`;
		default:
			return '';
	}
};

let getPositionNotificationMessage = function(item) {
	switch (item.status) {
		case 'accepted':
			if (item.side === false) {
				return `${item.lang.t('trading.notifications.position.text_buy')} ${item.lang.t('trading.notifications.position.by_size')} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t('trading.notifications.position.accepted')}`;
			}
			return `${item.lang.t('trading.notifications.position.text_sell')} ${item.lang.t('trading.notifications.position.by_size')} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t('trading.notifications.position.accepted')}`;

		case 'partiallyFilled':
			if (item.side === false) {
				return `${item.lang.t('trading.notifications.position.text_buy')} ${item.lang.t('trading.notifications.position.partiallyFilled')} ${item.lang.t('trading.notifications.position.by_size')} ${transformHelpers.size(item)} ${item.currency} (${transformHelpers.positionPercent(item)} %)`;
			}
			return `${item.lang.t('trading.notifications.position.text_sell')} ${item.lang.t('trading.notifications.position.partiallyFilled')} ${item.lang.t('trading.notifications.position.by_size')} ${transformHelpers.size(item)} ${item.currency} (${transformHelpers.positionPercent(item)} %)`;
		case 'filled':
			if (item.side === false) {
				return `${item.lang.t('trading.notifications.position.text_buy')} ${item.lang.t('trading.notifications.position.by_size')} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t('trading.notifications.position.filled')}`;
			}
			return `${item.lang.t('trading.notifications.position.text_sell')} ${item.lang.t('trading.notifications.position.by_size')} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t('trading.notifications.position.filled')}`;
		case 'closed':
			if (item.side === false) {
				if (item.reason === 1) {
					return `${item.lang.t('trading.notifications.position.text_buy')} ${item.lang.t('trading.notifications.position.closed')}`;
				} else if (item.reason === 2) {
					return `${item.lang.t('trading.notifications.position.text_buy')} ${item.lang.t('trading.notifications.position.mc_liquidation')}`;
				} else {
					return `${item.lang.t('trading.notifications.position.text_buy')} ${item.lang.t('trading.notifications.position.timeout_liquidation')}`;
				}
			} else {
				if (item.reason === 1) {
					return `${item.lang.t('trading.notifications.position.text_sell')} ${item.lang.t('trading.notifications.position.closed')}`;
				} else if (item.reason === 2) {
					return `${item.lang.t('trading.notifications.position.text_sell')} ${item.lang.t('trading.notifications.position.mc_liquidation')}`;
				} else {
					return `${item.lang.t('trading.notifications.position.text_sell')} ${item.lang.t('trading.notifications.position.timeout_liquidation')}`;
				}
			}
		default:
			return '';
	}
};

let defaultTimeout = 500000;

let transformTradingNotification = function(item) {
	let result = {
		id: Date.now(),
		status: getNotificationClass(item),
		text: item.object === 'order' ? getOrderNotificationMessage(item) : getPositionNotificationMessage(item),
		timeout: _.get(item, 'timeout', defaultTimeout),
	};
	if ('id' in item) {
		result['id'] = item.id;
	}
	return result;
};

export default {
	namespaced: true,

	state: {
		notifications: [],
	},

	mutations: {
		addNotification(state, notification) {
			if (!('id' in notification)) {
				notification['id'] = Date.now();
			}
			notification['timeout'] = _.get(notification, 'timeout', defaultTimeout);
			state.notifications.push(notification);
		},

		addTradingNotification(state, notification) {
			console.log(notification);
			state.notifications.push(transformTradingNotification(notification));
		},

		addNotifications(state, arr) {
			state.notifications = state.notifications.concat(_.map(arr, (item) => {
				if (!('id' in item)) {
					item['id'] = Date.now();
				}
				item['timeout'] = _.get(item, 'timeout', defaultTimeout);
				return item;
			}));
		},

		setNotifications(state, arr) {
			state.notifications = _.map(arr, (item) => {
				if (!('id' in item)) {
					item['id'] = Date.now();
				}
				item['timeout'] = _.get(item, 'timeout', defaultTimeout);
				return item;
			});
		},

		dropNotificationIfExists(state, id) {
			let itemId = _.findIndex(state.notifications, item => {
				return item.id === id;
			});
			if (itemId !== -1) {
				state.notifications.splice(itemId, 1);
			}
		},

		dropNotificationByIndex(state, index) {
			state.notifications.splice(index, 1);
		},
	},
};