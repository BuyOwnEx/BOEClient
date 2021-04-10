<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.withdraw') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title">
				{{ $t('common.withdraw') }}
			</v-card-title>

			<v-card-text class="common-dialog__content">
				вывод
			</v-card-text>

			<v-divider />

			<v-card-actions class="common-dialog__actions">
				<v-btn
					class="text-uppercase"
					small
					tile
					text
					plain
					block
					@click="close"
				>
					{{ $t('common.close') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'BalanceDialogWithdraw',

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
		confirm() {
			console.log('confirm');
		},
		close() {
			this.dialog = false;
		},

		closeMenu() {
			this.$emit('close-menu');
		},
	},
};
</script>
