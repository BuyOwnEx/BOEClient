export default {
	data() {
		return {
			dialog: false,
		};
	},

	watch: {
		dialog(val) {
			if (val) {
				if (this.clearData) this.clearData();
				this.$emit('close-menu');
			}
		},
	},

	methods: {
		close() {
			this.dialog = false;
		},
	},
};
