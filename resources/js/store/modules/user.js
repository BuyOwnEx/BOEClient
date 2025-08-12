import Vue from 'vue';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import randomColor from 'randomcolor';
import { createAvatar } from '@dicebear/core';
import * as identicon from '@dicebear/identicon';
import * as initials from '@dicebear/initials';

export default {
	namespaced: true,

	state: {
		balances: null,
		orders: null,
		deals: null,
		fees: null,
		positions: null,
		rub_props: null,
		kgs_props: null,
		swift_props: null,
		notificationStatus: null,
		verificationStatus: null,
		blockStatus: null,
		verifyStatus: null,
		status: null,
		verifyEntity: null,
		verifyResidentCountry: null,
		verifyType: null,
		inn: null,
		doc_statuses: {
			has_wallets: null,
			has_accounts: null,
			info_req_count: null,
			statement_req_count: null,
			last_dates: {
				last_info_date: null,
				last_statement_date: null,
				last_contract_date: null
			}
		},
		marginCall: {
			status: false,
			positions: [],
		},
		profileSelectedTab: 0,
		profileSelectedHash: null,
		kontur: {
			id: null,
			kyc_type: null,
			fio: null,
			birthday: null,
			passport_number: null,
			inn: null,
			edo_id: null,
			status: null,
			state: null,
			is_verified: null,
			risk_level: null,
			risk: null,
			company_name: null,
			created_at: null,
			updated_at: null
		},

		kyc_local_ind: {
			id: null,
			fio: null,
			birthday: null,
			document_number: null,
			inn: null,
			status: null,
			state: null,
			is_verified: null,
			created_at: null,
			updated_at: null
		},
		kyc_local_comp: {
			id: null,
			company_name: null,
			registration_number: null,
			address: null,
			tax_id: null,
			status: null,
			state: null,
			is_verified: null,
			created_at: null,
			updated_at: null
		}
	},

	getters: {
		getGeneratedAvatar: (_, __, rootState) => (type, seed) => {
			if(type === 'identicon')
			{
				const avatar = createAvatar(identicon, {
					seed: seed ?? rootState.app.trader.name,
				});
				return avatar.toString();
			}
			else if(type === 'initials')
			{
				const avatar = createAvatar(initials, {
					seed: seed ?? rootState.app.trader.name,
				});
				return avatar.toString();
			}
			else {
				const avatar = createAvatar(identicon, {
					seed: seed ?? rootState.app.trader.name,
				});
				return avatar.toString();
			}
		},
		isTradeHidden: (state) => {
			return (state.blockStatus & 8) > 0;
		},
	},

	mutations: {
		setBalances(state, balances) {
			state.balances = balances;
		},
		setNotificationSettings(state, notificationStatus) {
			state.notificationStatus = notificationStatus;
		},
		setVerificationStatus(state, verificationStatus) {
			state.verificationStatus = verificationStatus;
		},
		setBlockStatus(state, blockStatus) {
			state.blockStatus = blockStatus;
		},
		setVerifyStatus(state, verifyStatus) {
			state.verifyStatus = verifyStatus;
		},
		setVerifyEntity(state, entity) {
			state.verifyEntity = entity;
		},
		setInn(state, inn) {
			state.inn = inn;
		},
		setResidentCountry(state, country) {
			state.verifyResidentCountry = country;
		},
		setVerifyType(state, type) {
			state.verifyType = type;
		},
		setStatus(state, status) {
			state.status = status;
		},
		setDocRequestStatus(state, data) {
			state.doc_statuses.has_wallets = data.has_wallets;
			state.doc_statuses.has_accounts = data.has_accounts;
			state.doc_statuses.info_req_count = data.info_req_count;
			state.doc_statuses.statement_req_count = data.statement_req_count;
			state.doc_statuses.last_dates.last_info_date = data.last_dates.last_info_date;
			state.doc_statuses.last_dates.last_statement_date = data.last_dates.last_statement_date;
			state.doc_statuses.last_dates.last_contract_date = data.last_dates.last_contract_date;
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
		setRubProps(state, props) {
			state.rub_props = props;
		},
		setKgsProps(state, props) {
			state.kgs_props = props;
		},
		setSwiftProps(state, props) {
			state.swift_props = props;
		},
		setOwnFees(state, fees) {
			state.fees = fees;
		},
		updateBalance(state, data) {
			if (state.balances) {
				if (data.currency in state.balances) {
					if(data.balance)
						state.balances[data.currency].available = data.balance;
					if(data.blocked)
						state.balances[data.currency].blocked = data.blocked;
					if(data.otc_main)
						state.balances[data.currency].otc_main = data.otc_main;
					if(data.otc_blocked)
						state.balances[data.currency].otc_blocked = data.otc_blocked;
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
				state.orders[index].actual_size = data.actual_size;
				state.orders[index].updated_at = data.updated_at;
			}
		},
		updateConditionOrder(state, data) {
			let index = _.findIndex(state.orders, item => {
				return item.id === data.id;
			});
			if (index !== -1) {
				state.orders[index].price = data.price;
				state.orders[index].actual_size = data.actual_size;
			}
		},
		updateMatchOrder(state, data) {
			let index = _.findIndex(state.orders, item => {
				return item.id === data.id;
			});
			if (index !== -1) {
				if (data.status !== 'filled') {
					state.orders[index].size = data.size;
					state.orders[index].actual_size = data.actual_size;
					state.orders[index].status = data.status;
					state.orders[index].updated_at = data.updated_at;
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
				state.positions[index].margin_position = data.margin_position;
				state.positions[index].blocked_funds = data.blocked_funds;
				state.positions[index].credit_fee = data.credit_fee;
				state.positions[index].updated_at = data.updated_at;
			}
		},
		updateMatchPosition(state, data) {
			let index = _.findIndex(state.positions, item => {
				return item.id === data.id;
			});
			if (index !== -1) {
				state.positions[index].actual_size = data.actual_size;
				state.positions[index].credit_used = data.credit_used;
				state.positions[index].margin_position = data.margin_position;
				state.positions[index].realized = data.realized;
				state.positions[index].status = data.status;
				state.positions[index].updated_at = data.updated_at;
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

		SET_PROFILE_TAB(state, data) {
			state.profileSelectedTab = data.index;
			state.profileSelectedHash = data.hash;
		},
		UPDATE_CURRENCY_AMOUNT(state, { currency, amount }) {
			if (state.balances && currency in state.balances) {
				const balancesCurrency = state.balances[currency];
				balancesCurrency.withdraw -= amount;
				balancesCurrency.safe = balancesCurrency.safe + amount + balancesCurrency.feeWithdraw;
			}
		},
		setKonturData(state, data) {
			state.kontur = data;
		},
		setStateKontur(state, data) {
			state.kontur.state = data;
		},
		setKYCLocalIndData(state, data) {
			state.kyc_local_ind = data;
		},
		setKYCLocalIndState(state, data) {
			state.kyc_local_ind.state = data;
		},
		setKYCLocalCompData(state, data) {
			state.kyc_local_comp = data;
		},
		setKYCLocalCompState(state, data) {
			state.kyc_local_comp.state = data;
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
		getRubPropsFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/rub_props')
					.then(response => {
						commit('setRubProps', response.data.data === null ? [] : response.data.data);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		getKgsPropsFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/kgs_props')
					.then(response => {
						commit('setKgsProps', response.data.data === null ? [] : response.data.data);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		getSwiftPropsFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/swift_props')
					.then(response => {
						commit('setSwiftProps', response.data.data === null ? [] : response.data.data);
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

		getKonturData({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/kyc_kontur_data')
					.then(response => {
						commit('setKonturData', response.data.data);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		getKYCLocalIndData({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/kyc_local_ind_data')
					.then(response => {
						commit('setKYCLocalIndData', response.data.data);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		getKYCLocalCompData({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/kyc_local_comp_data')
					.then(response => {
						commit('setKYCLocalCompData', response.data.data);
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

		getVerificationStatus({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/get_verification_status')
					.then(response => {
						commit('setVerificationStatus', response.data.data);
						resolve();
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
		async updateVerificationStatus(_, payload) {
			const { data } = await axios.post('/trader/ext/set_verification_status', payload);
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
						commit('setVerifyEntity', response.data.entity);
						commit('setInn', response.data.inn);
						commit('setResidentCountry', response.data.country);
						commit('setVerifyType', response.data.type);
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

		getDocRequestStatus({ commit }) {
			return new Promise((resolve, reject) => {
				axios
					.get('/trader/ext/doc_requests/status')
					.then(response => {
						commit('setDocRequestStatus', response.data.data);
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
		async formAccountDeleteRequest(_) {
			const { data } = await axios.post('/trader/ext/account/delete/request');
			return data.success;
		},
		async formAccountDeleteConfirm(_, payload) {
			const { data } = await axios.post('/trader/ext/account/delete/confirm', payload);
			return data.success;
		},
		async editRubPropsName(_, payload) {
			const { data } = await axios.post('/trader/ext/rub_props/edit_name', payload);
			return data.success;
		},
		async formAddRubPropsRequest(_, payload) {
			const { data } = await axios.post('/trader/ext/rub_props/add/request', payload);
			return data.success;
		},
		async formAddRubPropsConfirm(_, payload) {
			const { data } = await axios.post('/trader/ext/rub_props/add/confirm', payload);
			return data.success;
		},
		async formDeleteRubPropsRequest(_, payload) {
			const { data } = await axios.post('/trader/ext/rub_props/delete/request', payload);
			return data.success;
		},
		async formDeleteRubPropsConfirm(_, payload) {
			const { data } = await axios.post('/trader/ext/rub_props/delete/confirm', payload);
			return data.success;
		},
		async editKgsPropsName(_, payload) {
			const { data } = await axios.post('/trader/ext/kgs_props/edit_name', payload);
			return data.success;
		},
		async formAddKgsPropsRequest(_, payload) {
			const { data } = await axios.post('/trader/ext/kgs_props/add/request', payload);
			return data.success;
		},
		async formAddKgsPropsConfirm(_, payload) {
			const { data } = await axios.post('/trader/ext/kgs_props/add/confirm', payload);
			return data.success;
		},
		async formDeleteKgsPropsRequest(_, payload) {
			const { data } = await axios.post('/trader/ext/kgs_props/delete/request', payload);
			return data.success;
		},
		async formDeleteKgsPropsConfirm(_, payload) {
			const { data } = await axios.post('/trader/ext/kgs_props/delete/confirm', payload);
			return data.success;
		},
		async editSwiftPropsName(_, payload) {
			const { data } = await axios.post('/trader/ext/swift_props/edit_name', payload);
			return data.success;
		},
		async formAddSwiftPropsRequest(_, payload) {
			const { data } = await axios.post('/trader/ext/swift_props/add/request', payload);
			return data.success;
		},
		async formAddSwiftPropsConfirm(_, payload) {
			const { data } = await axios.post('/trader/ext/swift_props/add/confirm', payload);
			return data.success;
		},
		async formDeleteSwiftPropsRequest(_, payload) {
			const { data } = await axios.post('/trader/ext/swift_props/delete/request', payload);
			return data.success;
		},
		async formDeleteSwiftPropsConfirm(_, payload) {
			const { data } = await axios.post('/trader/ext/swift_props/delete/confirm', payload);
			return data.success;
		},

		async logout() {
			await axios.post('/logout');
			window.location.pathname = 'login';
		},
	},
};
