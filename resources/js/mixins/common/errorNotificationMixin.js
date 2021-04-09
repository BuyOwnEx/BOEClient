export default {
	methods: {
		pushErrorNotification(text) {
			if (text)
				this.$store.commit('snackbar/addNotification', {
					text,
					status: 'error',
				});
			else
				this.$store.commit('snackbar/addNotification', {
					text: this.$t('forms_validation.fill_all_fields'),
					status: 'error',
				});
		},
	},
};
