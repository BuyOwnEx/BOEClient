<template>
	<div class="balance-fiat-dialog-alert">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'BalanceFiatDialogAlert',
};
</script>

<style lang="sass" scoped>
.balance-fiat-dialog-alert
	color: white
	background-color: #ff7365d6
	padding: 8px 16px
</style>
