export default {
	methods: {
		pushErrorNotification(text) {
			if (text)
				this.$store.commit('snackbar/addNotification', {
					text,
					status: 'error',
				});
			// TODO: добавить перевод к text
			else
				this.$store.commit('snackbar/addNotification', {
					text: 'Заполните все поля',
					status: 'error',
				});
		},
	},
};
