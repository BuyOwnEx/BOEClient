<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on, attrs }">
			<span v-bind="attrs" v-on="on">
				<slot></slot>
			</span>
		</template>

		<v-card>
			<slot name="card">
				<v-card-title class="common-dialog__title">
					<slot name="title"></slot>
				</v-card-title>

				<v-card-text class="common-dialog__content">
					<slot name="content"></slot>
				</v-card-text>

				<v-divider />

				<v-card-actions class="common-dialog__actions">
					<slot name="actions">
						<v-spacer />

						<slot name="close">
							<v-btn small tile text @click="close">
								Закрыть
							</v-btn>
						</slot>

						<v-spacer />

						<slot name="confirm">
							<v-btn :color="confirmColor" small tile text @click="confirm">
								{{ confirmText }}
							</v-btn>
						</slot>

						<v-spacer />
					</slot>
				</v-card-actions>
			</slot>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'CommonDialog',

	props: {
		confirmText: {
			type: String,
			required: false,
			default: 'Принять',
		},
		confirmColor: {
			type: String,
			required: false,
			default: 'primary',
		},
	},

	data() {
		return {
			dialog: false,
		};
	},

	methods: {
		confirm() {
			this.$emit('confirm');
			this.close();
		},

		close() {
			this.dialog = false;
		},
	},
};
</script>

<style scoped></style>
