import moment from 'moment';

export default {
	methods: {
		formatDate(date, type) {
			if (!date) return '—';

			if (type === 'trading') {
				const timestamp = date / 10000 - 62136892800000;
				return moment
					.utc(timestamp)
					.tz(moment.tz.guess())
					.format('YYYY-MM-DD HH:mm:ss');
			} else if (type === 'dateOnly') {
				return new Date(date).toLocaleDateString();
			} else if (type === 'timeOnly') {
				return new Date(date).toLocaleTimeString();
			} else if (type === 'timeAgo') {
				return moment(date).fromNow();
			} else {
				return new Date(date).toLocaleString();
			}
		},
	},
};
