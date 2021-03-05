export default {
	data() {
		return {
			dialog: false,
		};
	},
	methods: {
		closeDialog() {
			this.dialog = false;
		},
		confirm() {
			this.$emit('confirm');
			this.closeDialog();
		},
	},
}