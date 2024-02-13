import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

const transformHelpers = {
	volume: item => {
		return BigNumber(item.price)
			.times(BigNumber(item.actual_size))
			.toString();
	},
	percent: item => {
		if (item.status === 'partiallyFilled') {
			return parseFloat(100 - (item.actual_size * 100) / item.size).toFixed(2);
		}
		return '';
	},
	positionPercent: item => {
		if (item.status === 'partiallyFilled') {
			return BigNumber(item.actual_size)
				.times(100)
				.div(BigNumber(item.size))
				.dp(2)
				.toString();
		}
		return '';
	},
	actual_size: item => {
		return BigNumber(item.actual_size).toString();
	},
	size: item => {
		return BigNumber(item.size).toString();
	},
	price: item => {
		return BigNumber(item.price).toString();
	},
};

const getNotificationClass = item => {
	return 'success';
};

const getOrderNotificationMessage = item => {
	switch (item.status) {
		case 'accepted':
			if (item.side === false) {
				return `${item.lang.t(
					'trading.notifications.order.text_buy'
				)} ${transformHelpers.actual_size(item)} ${item.currency} ${item.lang.t(
					'trading.notifications.order.price'
				)} ${transformHelpers.price(item)} ${item.market} ${item.lang.t(
					'trading.notifications.order.accepted'
				)}`;
			}
			return `${item.lang.t(
				'trading.notifications.order.text_sell'
			)} ${transformHelpers.actual_size(item)} ${item.currency} ${item.lang.t(
				'trading.notifications.order.price'
			)} ${transformHelpers.price(item)} ${item.market} ${item.lang.t(
				'trading.notifications.order.accepted'
			)}`;
		case 'partiallyFilled':
			if (item.side === false) {
				return `${item.lang.t(
					'trading.notifications.order.text_buy'
				)} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t(
					'trading.notifications.order.price'
				)} ${transformHelpers.price(item)} ${item.market} ${item.lang.t(
					'trading.notifications.order.partiallyFilled'
				)} (${transformHelpers.percent(item)} %)`;
			}
			return `${item.lang.t(
				'trading.notifications.order.text_sell'
			)} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t(
				'trading.notifications.order.price'
			)} ${transformHelpers.price(item)} ${item.market} ${item.lang.t(
				'trading.notifications.order.partiallyFilled'
			)} (${transformHelpers.percent(item)} %)`;
		case 'filled':
			if (item.side === false) {
				return `${item.lang.t(
					'trading.notifications.order.text_buy'
				)} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t(
					'trading.notifications.order.price'
				)} ${transformHelpers.price(item)} ${item.market} ${item.lang.t(
					'trading.notifications.order.filled'
				)}`;
			}
			return `${item.lang.t(
				'trading.notifications.order.text_sell'
			)} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t(
				'trading.notifications.order.price'
			)} ${transformHelpers.price(item)} ${item.market} ${item.lang.t(
				'trading.notifications.order.filled'
			)}`;
		case 'cancelled':
			if (item.side === false) {
				return `${item.lang.t(
					'trading.notifications.order.text_buy'
				)} ${transformHelpers.actual_size(item)} ${item.currency} ${item.lang.t(
					'trading.notifications.order.price'
				)} ${transformHelpers.price(item)} ${item.market} ${item.lang.t(
					'trading.notifications.order.cancel'
				)}`;
			}
			return `${item.lang.t(
				'trading.notifications.order.text_sell'
			)} ${transformHelpers.actual_size(item)} ${item.currency} ${item.lang.t(
				'trading.notifications.order.price'
			)} ${transformHelpers.price(item)} ${item.market} ${item.lang.t(
				'trading.notifications.order.cancel'
			)}`;
		default:
			return '';
	}
};

const getPositionNotificationMessage = item => {
	switch (item.status) {
		case 'accepted':
			if (item.side === false) {
				return `${item.lang.t(
					'trading.notifications.position.text_buy'
				)} ${item.lang.t(
					'trading.notifications.position.by_size'
				)} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t(
					'trading.notifications.position.accepted'
				)}`;
			}
			return `${item.lang.t(
				'trading.notifications.position.text_sell'
			)} ${item.lang.t(
				'trading.notifications.position.by_size'
			)} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t(
				'trading.notifications.position.accepted'
			)}`;

		case 'partiallyFilled':
			if (item.side === false) {
				return `${item.lang.t(
					'trading.notifications.position.text_buy'
				)} ${item.lang.t(
					'trading.notifications.position.partiallyFilled'
				)} ${item.lang.t(
					'trading.notifications.position.by_size'
				)} ${transformHelpers.size(item)} ${
					item.currency
				} (${transformHelpers.positionPercent(item)} %)`;
			}
			return `${item.lang.t(
				'trading.notifications.position.text_sell'
			)} ${item.lang.t(
				'trading.notifications.position.partiallyFilled'
			)} ${item.lang.t(
				'trading.notifications.position.by_size'
			)} ${transformHelpers.size(item)} ${
				item.currency
			} (${transformHelpers.positionPercent(item)} %)`;
		case 'filled':
			if (item.side === false) {
				return `${item.lang.t(
					'trading.notifications.position.text_buy'
				)} ${item.lang.t(
					'trading.notifications.position.by_size'
				)} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t(
					'trading.notifications.position.filled'
				)}`;
			}
			return `${item.lang.t(
				'trading.notifications.position.text_sell'
			)} ${item.lang.t(
				'trading.notifications.position.by_size'
			)} ${transformHelpers.size(item)} ${item.currency} ${item.lang.t(
				'trading.notifications.position.filled'
			)}`;
		case 'closed':
			if (item.side === false) {
				if (item.reason === 1) {
					return `${item.lang.t(
						'trading.notifications.position.text_buy'
					)} ${item.lang.t('trading.notifications.position.closed')}`;
				} else if (item.reason === 2) {
					return `${item.lang.t(
						'trading.notifications.position.text_buy'
					)} ${item.lang.t('trading.notifications.position.mc_liquidation')}`;
				} else {
					return `${item.lang.t(
						'trading.notifications.position.text_buy'
					)} ${item.lang.t(
						'trading.notifications.position.timeout_liquidation'
					)}`;
				}
			} else {
				if (item.reason === 1) {
					return `${item.lang.t(
						'trading.notifications.position.text_sell'
					)} ${item.lang.t('trading.notifications.position.closed')}`;
				} else if (item.reason === 2) {
					return `${item.lang.t(
						'trading.notifications.position.text_sell'
					)} ${item.lang.t('trading.notifications.position.mc_liquidation')}`;
				} else {
					return `${item.lang.t(
						'trading.notifications.position.text_sell'
					)} ${item.lang.t(
						'trading.notifications.position.timeout_liquidation'
					)}`;
				}
			}
		default:
			return '';
	}
};

const defaultTimeout = 5000;

const transformTradingNotification = item => {
	let result = {
		id: Date.now(),
		status: getNotificationClass(item),
		text:
			item.object === 'order'
				? getOrderNotificationMessage(item)
				: getPositionNotificationMessage(item),
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
		snack: {
			text: '',
			color: 'info',
			timeout: 4000,
		},
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
			state.notifications = state.notifications.concat(
				_.map(arr, item => {
					if (!('id' in item)) {
						item['id'] = Date.now();
					}
					item['timeout'] = _.get(item, 'timeout', defaultTimeout);
					return item;
				})
			);
		},

		setNotifications(state, arr) {
			state.notifications = _.map(arr, item => {
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

		// обычные снэки для не трейдинговых уведомлений
		SHOW_MESSAGE(state, { text, color, timeout }) {
			state.snack.text = text;
			state.snack.color = color || 'info';
			state.snack.timeout = timeout || 4000;
		},
	},
};
