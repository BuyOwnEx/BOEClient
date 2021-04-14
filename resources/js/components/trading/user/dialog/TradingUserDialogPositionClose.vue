<template>
	<v-form ref="form" v-model="valid">
		<v-dialog v-model="dialog" max-width="500px">
			<template v-slot:activator="{ on }">
				<v-list-item dense v-on="on">
					<v-list-item-title>{{ menuTitle }}</v-list-item-title>
				</v-list-item>
			</template>

			<v-card>
				<v-card-title class="common-dialog__title">
					<span class="headline">{{ formTitle }}</span>
				</v-card-title>

				<v-card-text class="common-dialog__content">
					{{ $t('trading.dialogs.descriptions.close_position') }}
				</v-card-text>

				<v-card-actions class="common-dialog__actions">
					<v-spacer />
					<v-btn color="blue darken-1" text @click="close">
						{{ cancelTitle }}
					</v-btn>
					<v-spacer />
					<v-btn
						color="blue darken-1"
						text
						@click="apply"
						:loading="loading"
						:disabled="loading"
					>
						{{ actionTitle }}</v-btn
					>
					<v-spacer />
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-form>
</template>

<script>
export default {
	name: 'TradingUserDialogPositionClose',

	props: {
		id: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			dialog: false,
			valid: true,
			loading: false,
			formTitle: 'Closing position',
			menuTitle: this.$t('trading.close_position'),
			cancelTitle: 'Cancel',
			actionTitle: 'Close',
			form: {
				position: this.id,
			},
		};
	},

	watch: {
		dialog(val) {
			if (val) this.$emit('closeMenu');
		},
	},

	methods: {
		apply() {
			let self = this;
			this.loading = true;
			axios
				.post('/trader/ext/position/close', this.form)
				.then(response => {
					if (response.data.success === true) {
						self.close();
					}
				})
				.finally(function() {
					self.loading = false;
				});
		},

		reset() {
			this.$refs.form.reset();
		},

		close() {
			this.dialog = false;
			this.reset();
		},
	},
};
</script>
