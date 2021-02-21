<template>
  <tbody v-if="bidData" class="bid-list__content__table__body">
    <tr v-for="item in bidData">
      <td>
        <div class="bid-list__content__table__body__item--price">
          <strong class="text-success">
            {{ formatPrice(item.price) }}
          </strong>
        </div>
      </td>

      <td>
        <div class="bid-list__content__table__body__item--amount">
          {{ formatSize(item.actualSize) }}
        </div>
      </td>

      <td>
        <div class="bid-list__content__table__body__item--date">
          {{ calculateVolume(item.price, item.actualSize) }}
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script>
import BigNumber from "bignumber.js";
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import formatPrice from "../../../../../mixins/trading/formatPrice";
import formatSize from "../../../../../mixins/trading/formatSize";

export default {
  name: "BidListTableBody",

  mixins: [formatPrice, formatSize],

  props: {
    bidData: {
      type: Array,
      required: true
    },
    amountDepth: {
      type: Number,
      required: true
    },
    volumeDepth: {
      type: Number,
      required: true
    },
    best: {
      type: Number,
      required: true
    }
  },

  methods: {
    calculateVolume(price, actualSize) {
      return BigNumber(price)
        .times(BigNumber(actualSize))
        .toString();
    },
    calculatePercent(actualSize) {
      return BigNumber(actualSize)
        .times(100)
        .div(BigNumber(this.volumeDepth))
        .dp(2)
        .toString();
    }
  }
};
</script>
