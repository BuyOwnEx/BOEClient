<template>
	<v-dialog v-model="dialog" content-class="confirm-dialog">
		<template v-slot:activator="{ on, attrs }">
			<div v-bind="attrs" v-on="on">
				<slot></slot>
			</div>
		</template>

		<v-card>
			<v-card-title class="own-list-confirm-dialog__header">
				<slot name="header">Подтверждение отмены</slot>
			</v-card-title>

			<v-card-text>
				<slot name="text">Вы уверены, что хотите отменить ордер?</slot>
			</v-card-text>

			<v-card-actions>
				<slot name="actions">
					<v-spacer />
					<v-btn
						class="text-uppercase"
						style="letter-spacing: 1px"
						color="grey"
						text
						tile
						plain
						@click="closeDialog"
					>
						Отмена
					</v-btn>
					<v-spacer />
					<v-btn
						class="text-uppercase"
						style="letter-spacing: 1px"
						color="success"
						text
						tile
						plain
						@click="confirm"
					>
						Подтвердить
					</v-btn>
					<v-spacer />
				</slot>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import confirmDialog from '../../../../mixins/trading/confirmDialog';

export default {
	name: 'OwnListConfirmDialog',

	mixins: [confirmDialog],
};
</script>

<style scoped lang="sass">
.own-list-confirm-dialog
	&__header
		font-weight: 600 !important
		padding: 8px 24px 8px !important
</style>
