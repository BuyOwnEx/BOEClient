<template>
	<v-form ref="form" v-model="valid">
		<v-dialog v-model="dialog" max-width="500px">
			<template #activator="{ on }">
				<v-list-item dense v-on="on">
					<v-list-item-title>{{ $t('trading.position.close_position') }}</v-list-item-title>
				</v-list-item>
			</template>

			<v-card>
				<v-card-title class="common-dialog__title">
					{{ $t('trading.position.close_title') }}
				</v-card-title>

				<v-card-text class="common-dialog__content">
					{{ $t('trading.position.close_description') }}
				</v-card-text>

				<v-card-actions class="common-dialog__actions">
					<v-spacer />
					<v-btn small tile text plain @click="close">
						{{ $t('common.cancel') }}
					</v-btn>
					<v-spacer />
					<v-btn :loading="loading" :disabled="loading" color="primary" small tile text plain @click="apply">
						{{ $t('common.close') }}
					</v-btn>
					<v-spacer />
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-form>
</template>

<script>
import loadingMixin from '@/mixins/common/loadingMixin';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin';

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
