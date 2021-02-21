import BigNumber from "bignumber.js";
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
  methods: {
    formatSize(size) {
      return BigNumber(size)
        .toFixed(5)
        .toString();
    }
  }
};
