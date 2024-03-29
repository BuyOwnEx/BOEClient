<template>
	<div class="balance-fiat-dialog-select-system">
		<div class="pb-1">{{ $t('balance.select_payment_method') }}</div>

		<div
			class="balance-fiat-dialog-select-system__item"
			v-for="item in platforms"
			:key="item.id"
		>
			<img
				class="align-self-center balance-fiat-dialog-select-system__item-img pa-2"
        :src="getGatewayLogo(item.gateway_id)"
        :alt="item.gateway_id"
				height="90"
				width="90"
			/>
      <div class="align-self-center">
        <div>
          {{ $t('fiat.gateway.names.' + getGatewayName(item.gateway_id)) }}
        </div>
        <div>
          {{ $t('fiat.gateway.descriptions.' + getGatewayDescription(item.gateway_id)) }}
        </div>
      </div>

			<div class="align-self-center balance-fiat-dialog-select-system__item-info pa-2" style="min-width: 200px">
				<div>
					{{ $t('balance.min_amount') }}: <b>{{ getMinAmount(item) }} {{ item.currency }}</b>
				</div>
				<div>
					{{ $t('balance.fee') }}: <b>{{ getFee(item.gateway_id, item.currency) }}</b>
				</div>
        <div>
          {{ $t('balance.status') }}: <b :class="getStateColor(item.state)">{{ getStateName(item.state) }}</b>
        </div>
			</div>
			<div class="align-self-center balance-fiat-dialog-select-system__item-action pa-2">
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
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
export default {
	name: 'BalanceFiatDialogSelectSystem',

	props: {
		platforms: {
			type: Array,
			required: true,
		},
    fees: {
      type: Array,
      required: true,
    },
    gateways: {
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
			this.$emit('select_gateway', item);
		},
    getGatewayName(gateway_id)
    {
      let gateway = _.find(this.gateways, item => (item.id === gateway_id));
      return gateway.name;
    },
    getGatewayDescription(gateway_id)
    {
      let gateway = _.find(this.gateways, item => (item.id === gateway_id));
      return gateway.description;
    },
    getGatewayLogo(gateway_id)
    {
      let gateway = _.find(this.gateways, item => (item.id === gateway_id));
      return `/storage/fiat_gateways/${gateway.logo}`;
    },
		getMinAmount(item) {
			return this.isReplenish ? item.minReplenish : item.minWithdraw;
		},
		getFee(gateway_id, currency) {
      let gateway_fee = _.find(this.fees, item => (item.gateway_id === gateway_id && item.currency === currency));
			return this.isReplenish ? this.getReplenishFee(gateway_fee) : this.getWithdrawFee(gateway_fee);
		},
    getReplenishFee(fee) {
      let fix_part = '';
      let percent_part = '';
      if(!BigNumber(fee.bank_replenish_fix_fee).eq(0) || !BigNumber(fee.replenish_fix_fee).eq(0))
      {
        fix_part = BigNumber(fee.bank_replenish_fix_fee).plus(fee.replenish_fix_fee).toString() + ' ' + fee.currency;
      }
      if(!BigNumber(fee.bank_replenish_percent_fee).eq(0) || !BigNumber(fee.replenish_percent_fee).eq(0))
      {
        percent_part = BigNumber(fee.bank_replenish_percent_fee).plus(fee.replenish_percent_fee).toString() + '%';
      }
      if(fix_part !== '' && percent_part !== '')
      {
        if(fee.type === 'OR') return percent_part + '; ' + this.$t('common.min') + ' ' + fix_part;
        else return fix_part + ' + ' + percent_part;
      }
      else {
        if(fix_part !== '') return fix_part;
        if(percent_part !== '') return percent_part;
      }
    },
    getWithdrawFee(fee) {
      let fix_part = '';
      let percent_part = '';
      if(!BigNumber(fee.bank_withdraw_fix_fee).eq(0) || !BigNumber(fee.withdraw_fix_fee).eq(0))
      {
        fix_part = BigNumber(fee.bank_withdraw_fix_fee).plus(fee.withdraw_fix_fee).toString() + ' ' + fee.currency;
      }
      if(!BigNumber(fee.bank_withdraw_percent_fee).eq(0) || !BigNumber(fee.withdraw_percent_fee).eq(0))
      {
        percent_part = BigNumber(fee.bank_withdraw_percent_fee).plus(fee.withdraw_percent_fee).toString() + '%';
      }
      if(fix_part !== '' && percent_part !== '')
      {
        if(fee.type === 'OR') return percent_part + '; ' + this.$t('common.min') + ' ' + fix_part;
        else return fix_part + ' + ' + percent_part;
      }
      else {
        if(fix_part !== '') return fix_part;
        if(percent_part !== '') return percent_part;
      }
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
  mounted() {
    /*axios.get('/trader/ext/all_fiat_fees').then(response => {
      this.fees = response.data.data;
    });*/
  }
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
</style>
