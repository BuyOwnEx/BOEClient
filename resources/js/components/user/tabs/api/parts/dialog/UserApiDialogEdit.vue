<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on, attrs }">
			<span :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-bind="attrs" v-on="on">
				<v-btn v-if="$vuetify.breakpoint.smAndUp" :loading="editing">
					Редактировать разрешения
				</v-btn>

				<v-btn v-else icon>
					<v-icon color='#888888d6'>
						mdi-pencil
					</v-icon>
				</v-btn>
			</span>
		</template>

		<v-card>
			<v-card-title class="pb-0">Редактирвать разрешения</v-card-title>

			<v-form
				ref="form"
				class="user-api-dialog-create__form"
				@submit.prevent="edit"
			>
				<v-card-text>
					<v-checkbox
						v-model="form.trading"
						class="mt-0"
						:ripple="false"
						label="Торговля"
						hide-details
						dense
					/>
					<v-checkbox
						v-model="form.withdraw"
						class="mt-0"
						label="Вывод средств"
						:ripple="false"
						hide-details
						dense
					/>
				</v-card-text>

				<v-divider />

				<v-card-actions>
					<v-spacer />

					<v-btn text @click="close">
						Закрыть
					</v-btn>

					<v-spacer />

					<v-btn :loading="editing" type="submit" color="primary" text>
						Редактировать
					</v-btn>

					<v-spacer />
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
import CommonDialog from '../../../../../common/CommonDialog';

export default {
	name: 'UserApiDialogEdit',

	components: { CommonDialog },

	props: {
		apiItem: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			dialog: false,
			editing: false,
			form: {
				trading: false,
				withdraw: false,
			},
		};
	},

	computed: {
		isNoChanges() {
			const isTradingNoChange =
				this.apiItem.abilities.trading === this.form.trading;
			const isWithdrawNoChange =
				this.apiItem.abilities.withdraw === this.form.withdraw;

			return isTradingNoChange && isWithdrawNoChange;
		},
	},

	methods: {
		async edit() {
			if (this.isNoChanges) {
				this.close();
			}

			try {
				this.startLoading();

				// const { data } = await axios.post('', this.form);
				await new Promise(res => {
					setTimeout(() => {
						res();
					}, 1000);
				});

				this.$emit('edit', this.form);
				this.close();
				this.clearForm();
			} catch (e) {
				console.error(e);
			} finally {
				this.stopLoading();
			}
		},

		clearForm() {
			this.form.trading = this.apiItem.abilities.trading;
			this.form.withdraw = this.apiItem.abilities.withdraw;
		},
		startLoading() {
			this.editing = true;
		},
		stopLoading() {
			this.editing = false;
		},
		close() {
			this.dialog = false;
		},
	},

	mounted() {
		this.form.trading = this.apiItem.trading;
		this.form.withdraw = this.apiItem.withdraw;
	},
};
</script>

<style lang="sass" scoped>
.user-api-dialog-create
	::v-deep.v-input--checkbox
		display: inline-flex
		width: 50%
</style>
