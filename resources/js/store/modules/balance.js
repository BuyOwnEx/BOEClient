import VueI18n from '../../plugins/vue-i18n';

export default {
	namespaced: true,

	state: () => ({
		withdrawals: null,
		fiat_withdrawals: null
	}),

	getters: {
		stateTypes() {
			return [
				{
					id: 1,
					replenishment: VueI18n.t('balance.state_type.replenishment'),
					withdrawal: VueI18n.t('balance.state_type.withdrawal'),
					replenishmentIcon: workIcon,
					withdrawalIcon: workIcon,
				},
				{
					id: 2,
					replenishment: VueI18n.t('balance.state_type.not_replenishment'),
					withdrawal: VueI18n.t('balance.state_type.withdrawal'),
					replenishmentIcon: notWorkIcon,
					withdrawalIcon: workIcon,
				},
				{
					id: 3,
					replenishment: VueI18n.t('balance.state_type.replenishment'),
					withdrawal: VueI18n.t('balance.state_type.not_withdrawal'),
					replenishmentIcon: workIcon,
					withdrawalIcon: notWorkIcon,
				},
				{
					id: 4,
					replenishment: VueI18n.t('balance.state_type.not_replenishment'),
					withdrawal: VueI18n.t('balance.state_type.not_withdrawal'),
					replenishmentIcon: notWorkIcon,
					withdrawalIcon: notWorkIcon,
				},
				{
					id: 5,
					replenishment: VueI18n.t('balance.state_type.sync'),
					withdrawal: VueI18n.t('balance.state_type.sync'),
					replenishmentIcon: syncIcon,
					withdrawalIcon: syncIcon,
				},
				{
					id: 6,
					replenishment: VueI18n.t('balance.state_type.maintenance'),
					withdrawal: VueI18n.t('balance.state_type.maintenance'),
					replenishmentIcon: maintenanceIcon,
					withdrawalIcon: maintenanceIcon,
				},
			];
		},

		getIcons() {
			return {
				work: workIcon,
				notWork: notWorkIcon,
				sync: syncIcon,
				maintenance: maintenanceIcon,
			};
		},
	},

	mutations: {
		SET_WITHDRAWALS(state, data) {
			state.withdrawals = data;
		},
		SET_FIAT_WITHDRAWALS(state, data) {
			state.fiat_withdrawals = data;
		},
	},

	actions: {
		async fetchWithdrawals({ commit }) {
			const { data } = await axios.get('/trader/ext/balance/all-withdrawals');
			commit('SET_WITHDRAWALS', data.data);
		},

		async fetchFiatWithdrawals({ commit }) {
			const { data } = await axios.get('/trader/ext/balance/all-fiat-withdrawals');
			commit('SET_FIAT_WITHDRAWALS', data.data);
		},

		async validateAddress(_, payload) {
			await axios.post('/trader/ext/validate_address', payload);
		},
		getAddress(_, platform) {
			axios.get('/trader/ext/get_address', {
				params: { 'currency': platform.currency, 'platform_id': platform.id },
			});
		},

		async formCryptoWithdrawRequest(_, payload) {
			const { data } = await axios.post('/trader/ext/withdraw/crypto/request', payload);
			return data.success;
		},
		async formFiatWithdrawRequest(_, payload) {
			const { data } = await axios.post('/trader/ext/withdraw/fiat/request', payload);
			return data.success;
		},
		async confirmCryptoWithdraw(_, payload) {
			const { data } = await axios.post('/trader/ext/withdraw/crypto/confirm', payload);
			return data.success;
		},
		async confirmFiatCryptoWithdraw(_, payload) {
			const { data } = await axios.post('/trader/ext/withdraw/fiat/confirm', payload);
			return data.success;
		},

		async cancelCryptoWithdrawal(_, id) {
			const { data } = await axios.post('/trader/ext/withdraw/crypto/cancel', {
				id,
			});
			return data.success;
		},
		async cancelFiatWithdrawal(_, id) {
			const { data } = await axios.post('/trader/ext/withdraw/fiat/cancel', {
				id,
			});
			return data.success;
		},
	},
};

const workIcon = {
	name: 'mdi-toggle-switch',
	color: 'success',
};
const notWorkIcon = {
	name: 'mdi-toggle-switch-off',
	color: 'error',
};
const syncIcon = {
	name: 'mdi-sync-alert',
	color: 'warning',
};
const maintenanceIcon = {
	name: 'mdi-tools',
	color: 'error darken-3',
};
