import Vue from 'vue';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import randomColor from 'randomcolor';
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-avataaars-sprites';
import { find } from 'lodash/collection';

export default {
	namespaced: true,

	state: {
		balances: null,
		orders: null,
		deals: null,
		fees: null,
		positions: null,
		notificationStatus: null,
		blockStatus: null,
		verifyStatus: null,
		status: null,
		marginCall: {
			status: false,
			positions: [],
		},
		profileSelectedTab: 0,
	},

	getters: {
		getGeneratedAvatar: (_, __, rootState) => seed => {
			const options = {};
			const avatars = new Avatars(sprites, options);
			const user = rootState.app.trader;

			if (!seed) return avatars.create(user.name);
			else return avatars.create(seed);
		},
	},

	mutations: {
		setBalances(state, balances) {
			state.balances = balances;
		},
		setNotificationSettings(state, notificationStatus) {
			state.notificationStatus = notificationStatus;
		},
		setBlockStatus(state, blockStatus) {
			state.blockStatus = blockStatus;
		},
		setVerifyStatus(state, verifyStatus) {
			state.verifyStatus = verifyStatus;
		},
		setStatus(state, status) {
			state.status = status;
		},
		setOrders(state, orders) {
			state.orders = orders;
		},
		setDeals(state, deals) {
			state.deals = deals;
		},
		setPositions(state, positions) {
			state.positions = positions;
		},
		setOwnFees(state, fees) {
			state.fees = fees;
		},
		updateBalance(state, data) {
			if (state.balances) {
				if (data.currency in state.balances) {
					state.balances[data.currency].available = data.balance;
					state.balances[data.currency].blocked = data.blocked;
				}
			}
		},

		setAddress(state, data) {
			if (state.balances && data.currency.toUpperCase() in state.balances && state.balances[data.currency].platforms) {
				if (data.currency.toUpperCase() === data.platform.toUpperCase())
				{
					let ind = _.findIndex(state.balances[data.currency].platforms, (item) => item.base_currency.toLowerCase() === data.platform.toLowerCase());
					Vue.set(state.balances[data.currency].platforms[ind], 'address', data.address);
				}
				else
				{
					let ind = _.findIndex(state.balances[data.currency].platforms, (item) => item.base_currency.toLowerCase() === data.platform.toLowerCase());
					Vue.set(state.balances[data.currency].platforms[ind], 'address', data.address);
				}
			}
		},
		setAddressValidation(state, data) {
			if (state.balances && data.currency.toUpperCase() in state.balances && state.balances[data.currency].platforms) {
				if (data.currency.toUpperCase() === data.platform.toUpperCase())
				{
					let ind = _.findIndex(state.balances[data.currency].platforms, (item) => item.currency.toLowerCase() === data.platform.toLowerCase());
					Vue.set(state.balances[data.currency].platforms[ind], 'addressValidation', data.address);
				}
				else
				{
					let ind = _.findIndex(state.balances[data.currency].platforms, (item) => item.base_currency.toLowerCase() === data.platform.toLowerCase());
					Vue.set(state.balances[data.currency].platforms[ind], 'addressValidation', data.address);
				}
			}
		},

		updateCurrencyState(state, data) {
			if (state.balances) {
				if (data.currency.toUpperCase() in state.balances) {
					if (data.currency.toUpperCase() === data.platform.toUpperCase())
					{
						let ind = _.findIndex(state.balances[data.currency.toUpperCase()].platforms, (item) => item.currency.toLowerCase() === data.platform.toLowerCase());
						Vue.set(state.balances[data.currency.toUpperCase()].platforms[ind], 'state', data.state);
					}
					else
					{
						let ind = _.findIndex(state.balances[data.currency.toUpperCase()].platforms, (item) => item.base_currency.toLowerCase() === data.platform.toLowerCase());
						Vue.set(state.balances[data.currency.toUpperCase()].platforms[ind], 'state', data.state);
					}
				}
			}
		},
		addOrder(state, order) {
			state.orders.unshift(order);
		},
		updateOrder(state, data) {
			let index = _.findIndex(state.orders, item => {
				return item.id === data.id;
			});
			if (index !== -1) {
				state.orders[index].status = data.status;
				state.orders[index].actualSize = data.actualSize;
				state.orders[index].updatedAt = data.updatedAt;
			}
		},
		updateConditionOrder(state, data) {
			let index = _.findIndex(state.orders, item => {
				return item.id === data.id;
			});
			if (index !== -1) {
				state.orders[index].price = data.price;
				state.orders[index].actualSize = data.actualSize;
			}
		},
		updateMatchOrder(state, data) {
			let index = _.findIndex(state.orders, item => {
				return item.id === data.id;
			});
			if (index !== -1) {
				if (data.status !== 'filled') {
					state.orders[index].actualSize = data.actualSize;
					state.orders[index].status = data.status;
					state.orders[index].updatedAt = data.updatedAt;
				} else {
					state.orders.splice(index, 1);
				}
			}
		},
		deleteOrder(state, data) {
			let index = _.findIndex(state.orders, item => {
				return item.id === data.id;
			});
			if (index !== -1) {
				state.orders.splice(index, 1);
			}
		},
		addDeal(state, deal) {
			state.deals.unshift(deal);
		},
		addPosition(state, position) {
			state.positions.unshift(position);
		},
		updatePosition(state, data) {
			let index = _.findIndex(state.positions, item => {
				return item.id === data.id;
			});
			if (index !== -1) {
				state.positions[index].marginPosition = data.marginPosition;
				state.positions[index].blockedFunds = data.blockedFunds;
				state.positions[index].creditFee = data.creditFee;
				state.positions[index].updatedAt = data.updatedAt;
			}
		},
		updateMatchPosition(state, data) {
			let index = _.findIndex(state.positions, item => {
				return item.id === data.id;
			});
			if (index !== -1) {
				state.positions[index].actualSize = data.actualSize;
				state.positions[index].creditUsed = data.creditUsed;
				state.positions[index].marginPosition = data.marginPosition;
				state.positions[index].realized = data.realized;
				state.positions[index].status = data.status;
				state.positions[index].updatedAt = data.updatedAt;
			}
		},
		deletePosition(state, data) {
			let index = _.findIndex(state.positions, item => {
				return item.id === data.id;
			});
			if (index !== -1) {
				state.positions.splice(index, 1);
			}
		},
		getMarginCall(state, data) {
			state.marginCall.status = true;
			state.marginCall.positions.push(data.position.id);
		},

		SET_PROFILE_TAB(state, tabIndex) {
			state.profileSelectedTab = tabIndex;
		},
		UPDATE_CURRENCY_AMOUNT(state, { currency, amount }) {
			if (state.balances && currency in state.balances) {
				const balancesCurrency = state.balances[currency];
				balancesCurrency.withdraw -= amount;
				balancesCurrency.safe = balancesCurrency.safe + amount + balancesCurrency.feeWithdraw;
			}
		},
	},

	actions: {
		getBalancesFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/balances')
					.then(response => {
						if (_.get(response, 'data.success') === true) {
							_.forEach(response.data.data, function(val) {
								_.assign(val, {
									color: randomColor.randomColor({
										luminosity: 'dark',
										format: 'rgba',
										alpha: 0.5,
									}),
								});
							});
							commit('setBalances', response.data.data);
						}
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		getOrdersFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/orders')
					.then(response => {
						commit('setOrders', response.data.data);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		getDealsFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/deals')
					.then(response => {
						commit('setDeals', response.data.data);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		getPositionsFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/positions')
					.then(response => {
						commit('setPositions', response.data.data);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		getTraderTokenFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/token')
					.then(response => {
						resolve(response.data);
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		getOwnFeesFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/fees')
					.then(response => {
						commit('setOwnFees', response.data.data);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},

		getNotificationSettings({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/notification/status')
					.then(response => {
						commit('setNotificationSettings', response.data.status);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		async updateNotificationSettings(_, payload) {
			const { data } = await axios.post('/trader/ext/notification/status', payload);
			return data.success;
		},

		getBlockStatus({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/block/status')
					.then(response => {
						commit('setBlockStatus', response.data.status);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},

		getVerifyStatus({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/verify/status')
					.then(response => {
						commit('setVerifyStatus', response.data.status);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},

		getStatus({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/status')
					.then(response => {
						commit('setStatus', response.data.status);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},

		async formChangeEmailRequest(_, payload) {
			const { data } = await axios.post('/trader/ext/email/change/request', payload);
			return data.success;
		},
		async formChangeEmailConfirm(_, payload) {
			const { data } = await axios.post('/trader/ext/email/change/confirm', payload);
			return data.success;
		},

		async logout() {
			await axios.post('/logout');
			window.location.pathname = 'login';
		},
	},
};
