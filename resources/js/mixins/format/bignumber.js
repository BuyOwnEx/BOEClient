import BigNumber from "bignumber.js";
BigNumber.config({ EXPONENTIAL_AT: [-35, 35] });
export default {
  methods: {
    BigNumber: function (item) {
      return BigNumber(item);
    },
  }
};
