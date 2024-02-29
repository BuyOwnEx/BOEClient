export default {
	methods: {
		formatDate(date, type) {
			if (!date) return '—';

			switch (type) {
				case 'trading':
					const timestamp = date / 10000 - 62135596800000;
					return this.$moment
						.utc(timestamp)
						.utcOffset(this.$moment().utcOffset())
						.format('YYYY-MM-DD HH:mm:ss');
				case 'dateOnly':
					return new Date(date).toLocaleDateString();
				case 'timeOnly':
					return new Date(date).toLocaleTimeString();
				case 'timeAgo':
					const userLang = this.$store.state.app.trader.language || 'en';
					return this.$moment(date)
						.utcOffset(this.$moment().utcOffset())
						.locale(userLang)
						.fromNow();
				default:
					return new Date(date).toLocaleString();
			}
		},
	},
};
