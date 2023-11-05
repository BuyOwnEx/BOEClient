export default {
	data() {
		return {
			dialog: false,
		};
	},

	watch: {
		dialog: {
            handler(newValue) {
                if (!newValue) {
                    if (this.clearData) this.clearData();
                    this.$emit('close-menu');
                }
            }
        },
	},

	methods: {
		close() {
			this.dialog = false;
		},
	},
};
