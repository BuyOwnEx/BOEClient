export default {
	namespaced: true,

	actions: {
		async validateAddress(_, payload) {
			await axios.post('/trader/ext/validate_address', payload)
		}
	}
}