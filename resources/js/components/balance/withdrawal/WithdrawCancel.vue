<template>
	<v-dialog v-model="dialog" width="800">
		<template v-slot:activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.cancel') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title"> {{ $t('common.confirmation') }} </v-card-title>

			<v-card-text class="common-dialog__content">
				{{ $t('balance.dialog.cancel_withdrawal_description') }}
			</v-card-text>

			<v-card-actions class="common-dialog__actions">
				<v-spacer />
				<v-btn plain tile text small @click="close">
					{{ $t('common.close') }}
				</v-btn>
				<v-spacer />
				<v-btn color="primary" plain tile text small @click="confirm">
					{{ $t('common.confirm') }}
				</v-btn>
				<v-spacer />
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'WithdrawCancel',

	props: {
		withdrawObj: {
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
			if (val) {
				this.closeMenu();
			}
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
