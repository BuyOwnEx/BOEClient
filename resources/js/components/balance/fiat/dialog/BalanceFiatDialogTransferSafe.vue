<template>

</template>

<script>
export default {
	name: 'BalanceFiatDialogTransferSafe',

	props: {
		currencyObj: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			dialog: false,
		};
	},

	watch: {
		dialog(val) {
			if (val) this.closeMenu();
		},
	},

	methods: {
		close() {
			this.dialog = false;
		},
		closeMenu() {
			this.$emit('close-menu');
		},
	},
};
</script>