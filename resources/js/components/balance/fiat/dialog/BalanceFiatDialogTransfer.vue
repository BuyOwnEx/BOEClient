<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.replenish') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title">
				{{ $t('common.replenishment_funds') }} {{ currencyObj.currency }}
			</v-card-title>

			<v-card-text class="common-dialog__content">
			</v-card-text>

			<v-divider />

			<v-card-actions class="common-dialog__actions">
				<v-spacer />
				<v-btn plain tile text small @click="close">
					{{ $t('common.cancel') }}
				</v-btn>
				<v-spacer />
				<v-btn
					:loading="loading"
					:disabled="!valid"
					color="primary"
					tile
					text
					plain
					small
					@click="apply"
				>
					{{ $t('common.transfer') }}
				</v-btn>
				<v-spacer />
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		name: 'BalanceFiatDialogTransfer',

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

<style scoped>

</style>