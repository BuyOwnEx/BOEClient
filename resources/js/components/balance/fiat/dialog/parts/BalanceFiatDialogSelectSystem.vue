<template>
	<div class="balance-fiat-dialog-select-system">
		<div class="pb-1">Выберите платёжную систему</div>

		<div
			class="balance-fiat-dialog-select-system__item"
			v-for="item in systemsData"
			:key="item.id"
		>
			<div class="balance-fiat-dialog-select-system__item-img"></div>
			<div class="balance-fiat-dialog-select-system__item-info">
				<div>
					Мин. сумма: <b>{{ getMinAmount(item) }} {{ item.currency }}</b>
				</div>
				<div>
					Комиссия: <b>{{ getFee(item) }} {{ item.currency }}</b>
				</div>
				<div>
					Статус: <b :class="getStatusColor(item.status)">{{ item.status }}</b>
				</div>
			</div>
			<div class="balance-fiat-dialog-select-system__item-action">
				<v-btn
					:disabled="item.status !== 'active'"
					color="primary"
					tile
					small
					@click="select(item)"
				>
					Выбрать
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
		padding: 16px 12px
		&:not(:first-child)
			margin-top: 8px
	&__item-action
		display: flex
		align-items: center
</style>
