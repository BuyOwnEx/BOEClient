import moment from "moment";

export default {
  methods: {
    formatDate(date) {
      const timestamp = date / 10000 - 62136892800000;
      return moment
        .utc(timestamp)
        .tz(moment.tz.guess())
        .format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
