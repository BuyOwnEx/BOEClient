import moment from 'moment';

export default {
	methods: {
		formatDate(date, type) {
			if (!date) return '—';

			switch (type) {
				case 'trading':
					const timestamp = date / 10000 - 62136892800000;
					return moment
						.utc(timestamp)
						.tz(moment.tz.guess())
						.format('YYYY-MM-DD HH:mm:ss');
				case 'dateOnly':
					return new Date(date).toLocaleDateString();
				case 'timeOnly':
					return new Date(date).toLocaleTimeString();
				case 'timeAgo':
					const userLang = this.$store.state.app.trader.language || 'en';
					return moment(date)
						.locale(userLang)
						.fromNow();
				default:
					return new Date(date).toLocaleString();
			}
		},
	},
};
