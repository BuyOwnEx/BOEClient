export default {
	namespaced: true,

	state: () => ({
		isAddressValidated: false,
	}),

	mutations: {
		SET_ADDRESS_VALIDATION_STATUS(state, status) {
			state.isAddressValidated = status
		}
	},

	actions: {
		async validateAddress(_, payload) {
			await axios.post('/trader/ext/validate_address', payload)
		}
	}
}