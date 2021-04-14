export default {
	namespaced: true,

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
