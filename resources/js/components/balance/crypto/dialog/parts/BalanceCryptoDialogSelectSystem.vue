<template>
  <div class="balance-crypto-dialog-select-system">
    <div class="pb-1">{{ $t('balance.select_network') }}</div>

    <div
        class="balance-crypto-dialog-select-system__item"
        v-for="item in platforms"
        :key="item.id"
    >
      <img
          class="align-self-center balance-crypto-dialog-select-system__item-img pa-1"
          :src="getSystemImage(item.base_currency)"
          :alt="item.base_currency"
          height="90"
          width="90"
      />
      <div class="align-self-center">
        {{item.platform !== null ? item.platform : item.currency }}
      </div>

      <div class="align-self-center balance-crypto-dialog-select-system__item-info pa-2">
        <div>
          {{ $t('balance.min_amount') }}: <b>{{ getMinAmount(item) }} {{ item.currency }}</b>
        </div>
        <div>
          {{ $t('balance.fee') }}: <b>{{ getFee(item) }} {{ item.currency }}</b>
        </div>
        <div>
          {{ $t('balance.status') }}: <b :class="getStateColor(item.state)">{{ getStateName(item.state) }}</b>
        </div>
      </div>
      <div class="align-self-center balance-crypto-dialog-select-system__item-action pa-2">
        <v-btn
            :disabled="(!(item.state === 1 || item.state === 3) && isReplenish) || (!(item.state === 1 || item.state === 2) && !isReplenish)"
            :color="((item.state === 1 || item.state === 3) && isReplenish) || ((item.state === 1 || item.state === 2) && !isReplenish) ? 'success' : ''"
            tile
            text
            small
            @click="select(item)"
        >
          {{ $t('common.select') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BalanceCryptoDialogSelectSystem',
  props: {
    platforms: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator(val) {
        return ['replenish', 'withdraw'].indexOf(val) !== -1;
      },
    },
  },

  data() {
    return {
      minAmount: '',
    };
  },

  computed: {
    isReplenish() {
      return this.type === 'replenish';
    },
  },

  methods: {
    select(item) {
      this.$emit('select', item);
    },

    getSystemImage(name) {
      const filename = name.toLowerCase() + '.png';
      return `/storage/currencies/${filename}`;
    },
    getMinAmount(item) {
      return this.isReplenish ? item.minReplenish : item.minWithdraw;
    },
    getFee(item) {
      return this.isReplenish ? '-' : item.feeWithdraw;
    },
    getStateColor(state) {
      if(this.isReplenish)
      {
        const activeState = state === 1 || state === 3;
        return activeState ? 'success--text' : 'error--text';
      }
      else
      {
        const activeState = state === 1 || state === 2;
        return activeState ? 'success--text' : 'error--text';
      }
    },
    getStateName(state) {
      if(this.isReplenish)
      {
        const activeState = state === 1 || state === 3;
        return activeState ? 'ON' : 'OFF';
      }
      else
      {
        const activeState = state === 1 || state === 2;
        return activeState ? 'ON' : 'OFF';
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.balance-crypto-dialog-select-system
  &__item
    display: flex
    justify-content: space-between
    border: 1px solid #a9a8a838
    @media screen and (max-width: 600px)
      flex-direction: column
    &:not(:first-child)
      margin-top: 8px
  &__item-action
    display: flex
    align-items: center
</style>