<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on, attrs }">
			<span v-bind="attrs" v-on="on">
				<slot></slot>
			</span>
		</template>

		<v-card class="common-dialog">
			<slot name="card">
				<v-card-title
					class="common-dialog__title"
					:class="getBackgroundClassColor"
				>
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
							<v-btn small tile text plain @click="close">
								Отмена
							</v-btn>
						</slot>

						<v-spacer />

						<slot name="confirm">
							<v-btn
								class="text-uppercase"
								:color="confirmColor"
								small
								tile
								text
								plain
								@click="confirm"
							>
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
			default: 'Подтвердить',
		},
		confirmColor: {
			type: String,
			required: false,
			default: 'primary',
		},
		headerColor: {
			type: String,
			required: false,
			default: '',
		},
	},

	data() {
		return {
			dialog: false,
		};
	},

	computed: {
		getBackgroundClassColor() {
			if (this.headerColor === 'success')
				return 'common-dialog__title--success';
			else if (this.headerColor === 'error')
				return 'common-dialog__title--error';
		},
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

<style lang="sass">
.common-dialog
	&__title
		font-weight: 600 !important
		padding: 8px 24px 8px !important

		&--success
			background-color: var(--v-success-base)
		&--error
			background-color: var(--v-error-base)

	&__content
		padding-top: 8px !important

	&__actions
		.v-btn
			text-transform: uppercase !important
			letter-spacing: 1px !important

.theme--dark
	.common-dialog
			&__title
				&--success
					background-color: var(--v-success-darken1)
				&--error
					background-color: var(--v-error-darken1)
</style>
