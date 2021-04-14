export default {
	methods: {
		pushErrorNotification(text, type) {
			if (type) {
				switch (type) {
					case 'incorrect':
						this.$store.commit('snackbar/SHOW_MESSAGE', {
							text: this.$t('forms_validation.incorrect_data'),
							color: 'error',
						});
						break;
					default: {
						this.$store.commit('snackbar/SHOW_MESSAGE', {
							text: this.$t('forms_validation.fill_all_fields'),
							color: 'error',
						});
						break;
					}
				}
			} else if (text) {
				this.$store.commit('snackbar/SHOW_MESSAGE', {
					text,
					color: 'error',
				});
			}
		},

		pushNotification(text, color, timeout) {
			this.$store.commit('snackbar/SHOW_MESSAGE', {
				text,
				color,
				timeout,
			});
		},
	},
};
