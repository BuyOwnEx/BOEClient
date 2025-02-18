<template>
  <div class="balance-fiat-dialog-select-system">
    <v-card v-if="!is_verified">
      <BalanceFiatDialogAlert>
        {{ $t('fiat.fiat_only_for_verified') }}
      </BalanceFiatDialogAlert>
    </v-card>
    <div class="balance-fiat-dialog-select-system__item" v-else v-for="item in onlyReplenishPlatforms" :key="item.id">
      <img
          class="align-self-center balance-fiat-dialog-select-system__item-img pa-2"
          :src="item.gateway_logo"
          :alt="item.gateway_code"
          height="90"
          width="90"
      />
      <div class="align-self-center">
        <div class="font-weight-bold text-uppercase"> {{ $t('fiat.gateway.replenish.names.' + item.gateway_code.toLowerCase()) }} </div>
        <div> {{ $t('fiat.gateway.replenish.descriptions.' + item.gateway_code.toLowerCase()) }} </div>
      </div>
      <div class="align-self-center balance-fiat-dialog-select-system__item-info pa-2" style="min-width: 200px">
        <div> {{ $t('balance.min_amount') }}: <b>{{ getMinAmount(item) }} {{ item.currency }}</b> </div>
        <div> {{ $t('balance.fee') }}: <i class="text-lowercase">{{ $t('fiat.replenish_calculate_fee') }}</i> </div>
        <div> {{ $t('balance.status') }}: <b :class="getStateColor(item.state)">{{ getStateName(item.state) }}</b> </div>
      </div>
      <div class="align-self-center balance-fiat-dialog-select-system__item-action pa-2">
        <v-btn
            :disabled="(item.state !== 1 && item.state !== 3)"
            :color="(item.state === 1 || item.state === 3) ? 'success' : ''"
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
import BalanceFiatDialogAlert from '@/components/balance/fiat/dialog/parts/BalanceFiatDialogAlert.vue';
export default {
  name: 'SelectReplenishMethod',
  props: {
    platforms: {
      type: Array,
      required: true,
    },
    is_verified: {
      type: Boolean,
      required: true,
    },
    block_status: {
      type: Number,
      required: true,
    },
    trader_status: {
      type: Number,
      required: true,
    }
  },
  components: {
    BalanceFiatDialogAlert
  },
  data() {
    return {
      minAmount: '',
    };
  },

  computed: {
    onlyReplenishPlatforms() {
      return _.filter(this.platforms, item => {
        return (
            item.gateway_is_replenish === true
        );
      });
    }
  },

  methods: {
    select(item) {
      this.$emit('select_platform', { platform: item });
    },
    getMinAmount(item) {
      return item.minReplenish;
    },
    getStateColor(state) {
      const activeState = state === 1 || state === 3;
      return activeState ? 'success--text' : 'error--text';
    },
    getStateName(state) {
      const activeState = state === 1 || state === 3;
      return activeState ? 'ON' : 'OFF';
    },
  },
};
</script>

<style lang="sass" scoped>
.balance-fiat-dialog-select-system
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
    .v-btn
      text-transform: uppercase !important
      letter-spacing: 1px !important
</style>
