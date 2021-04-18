import VueI18n from '../../plugins/vue-i18n';

export default {
	namespaced: true,

	state: () => ({}),

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
	},

	actions: {
		async fetchWithdrawals() {
			const { data } = await axios.get('/trader/ext/balance/all-withdrawals');
			return data.withdrawals;
		},

		async validateAddress(_, payload) {
			await axios.post('/trader/ext/validate_address', payload);
		},
		getAddress(_, currency) {
			axios.get('/trader/ext/get_address', {
				params: { currency },
			});
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
