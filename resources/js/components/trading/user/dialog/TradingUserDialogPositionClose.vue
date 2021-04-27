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
					<v-btn color="blue darken-1" text @click="apply" :loading="loading" :disabled="loading">
						{{ actionTitle }}</v-btn
					>
					<v-spacer />
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-form>
</template>

<script>
import loadingMixin from '../../../../mixins/common/loadingMixin';
import dialogMethodsMixin from '../../../../mixins/common/dialogMethodsMixin';

export default {
	name: 'TradingUserDialogPositionClose',

	mixins: [loadingMixin, dialogMethodsMixin],

	props: {
		id: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			valid: true,
			formTitle: 'Closing position',
			menuTitle: this.$t('trading.close_position'),
			cancelTitle: 'Cancel',
			actionTitle: 'Close',
			form: {
				position: this.id,
			},
		};
	},

	methods: {
		apply() {
			this.startLoading();
			axios
				.post('/trader/ext/position/close', this.form)
				.then(response => {
					if (response.data.success === true) {
						this.close();
					}
				})
				.finally(() => {
					this.stopLoading();
				});
		},

		clearData() {
			this.$refs.form.reset();
		},
	},
};
</script>
