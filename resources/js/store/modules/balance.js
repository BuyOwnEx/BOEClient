export default {
	namespaced: true,

	state: () => ({
		isAddressValidated: false,
	}),

	mutations: {
		VALIDATE_ADDRESS(state) {
			state.isAddressValidated = true
		}
	},

	actions: {
		async validateAddress(_, payload) {
			await axios.post('/trader/ext/validate_address', payload)
		}
	}
}