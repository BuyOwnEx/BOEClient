<template>
	<v-dialog v-model="dialog" width="600" persistent>
		<template v-slot:activator="{ on, attrs }">
			<v-btn block large v-bind="attrs" v-on="on" color="primary">
				Добавить тикет
			</v-btn>
		</template>

		<v-card class="support-dialog-create">
			<v-card-title class="common-dialog__title justify-space-between">
				<span>Создать тикет</span>
				<v-btn icon @click="close">
					<v-icon>
						mdi-close
					</v-icon>
				</v-btn>
			</v-card-title>

			<v-card-text class="common-dialog__content">
				<v-form v-model="valid" ref="form">
					<v-text-field
						v-model="form.subject"
						:placeholder="$t('common.title')"
						:rules="[rules.required]"
						solo
						flat
						autofocus
						hide-details
					/>

					<v-divider />

					<v-textarea
						v-model="form.body"
						:placeholder="$t('common.description')"
						:rules="[rules.required]"
						hide-details
						auto-grow
						solo
						flat
					/>

					<v-select
						v-model="form.priority"
						:menu-props="{ bottom: true, offsetY: true }"
						:items="priorityList"
						placeholder="Приоритет"
						item-value="key"
						hide-details
						solo
						flat
					>
						<template v-slot:selection="{ attrs, item, parent, selected }">
							<span
								class="font-weight-bold pr-2"
								:class="[`${item.color}--text`]"
							>
								{{ item.name }}
							</span>
						</template>

						<template v-slot:item="{ item }">
							<span
								class="font-weight-bold my-1"
								:class="[`${item.color}--text`]"
							>
								{{ item.name }}
							</span>
						</template>
					</v-select>
				</v-form>
			</v-card-text>

			<v-divider />

			<v-card-actions class="common-dialog__actions">
				<v-spacer />

				<v-btn small tile text plain @click="close">
					Закрыть
				</v-btn>

				<v-spacer />

				<v-btn
					:loading="loading"
					:disabled="!valid"
					type="submit"
					color="primary"
					small
					tile
					text
					plain
					@click="create"
				>
					Создать
				</v-btn>

				<v-spacer />
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import formValidationRules from '../../../mixins/common/formValidationRules';
import loadingMixin from '../../../mixins/common/loadingMixin';

export default {
	name: 'UserApiDialogCreate',

	mixins: [formValidationRules, loadingMixin],

	data() {
		return {
			dialog: false,
			valid: false,

			form: {
				subject: '',
				body: '',
				priority: 'normal',
			},
		};
	},

	computed: {
		...mapState('support', ['priorityList']),
	},

	watch: {
		dialog(value) {
			if (value === true) {
				this.$nextTick(() => {
					this.form.subject = '';
					this.form.body = '';
					this.form.priority = 'normal';
					this.$refs.form.resetValidation();
				});
			}
		},
	},

	methods: {
		...mapActions({
			addTicketStore: 'support/addTicket',
		}),

		async create() {
			try {
				this.startLoading();

				await this.addTicketStore(this.form);

				this.close();
			} finally {
				this.stopLoading();
			}
		},

		close() {
			this.dialog = false;
		},
	},
};
</script>

<style lang="sass" scoped>
.support-dialog-create
	::v-deep.v-input__slot
		padding: 0
</style>
