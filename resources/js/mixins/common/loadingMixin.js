export default {
	data() {
		return {
			loading: false
		};
	},

	methods: {
		startLoading() {
			this.loading = true
		},
		stopLoading() {
			this.loading = false
		}
	}
}