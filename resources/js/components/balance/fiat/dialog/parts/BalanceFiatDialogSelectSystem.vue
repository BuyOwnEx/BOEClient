<template>
	<div class="balance-fiat-dialog-select-system">
		<div class="pb-1">{{ $t('balance.select_payment_system') }}</div>

		<div
			class="balance-fiat-dialog-select-system__item"
			v-for="item in systemsData"
			:key="item.id"
		>
			<img
				class="balance-fiat-dialog-select-system__item-img"
				:src="getSystemImage(item.name)"
				:alt="item.name"
				height="90"
				width="90"
			/>

			<div class="balance-fiat-dialog-select-system__item-info pa-2">
				<div>
					{{ $t('balance.min_amount') }}:
					<b>{{ getMinAmount(item) }} {{ item.currency }}</b>
				</div>
				<div>
					{{ $t('balance.fee') }}: <b>{{ getFee(item) }} {{ item.currency }}</b>
				</div>
				<div>
					{{ $t('balance.status') }}:
					<b :class="getStatusColor(item.status)">{{ item.status }}</b>
				</div>
			</div>
			<div class="balance-fiat-dialog-select-system__item-action pa-2">
				<v-btn
					:disabled="item.status !== 'active'"
					color="primary"
					tile
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
	name: 'BalanceFiatDialogSelectSystem',

	props: {
		systemsData: {
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
			return `/images/balance//${filename}`;
		},
		getMinAmount(item) {
			return this.isReplenish ? item.minReplenish : item.minWithdraw;
		},
		getFee(item) {
			return this.isReplenish ? item.replenishFee : item.withdrawFee;
		},
		getStatusColor(status) {
			const activeStatus = status === 'active';
			return activeStatus ? 'success--text' : 'error--text';
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
		&:not(:first-child)
			margin-top: 8px
	&__item-action
		display: flex
		align-items: center
</style>
