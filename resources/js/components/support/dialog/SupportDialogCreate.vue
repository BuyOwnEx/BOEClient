<template>
	<v-dialog v-model="dialog" width="600" persistent>
		<template v-slot:activator="{ on, attrs }">
			<v-btn block large v-bind="attrs" v-on="on" color="primary">
				Добавить тикет
			</v-btn>
		</template>

		<v-card class="user-api-dialog-create">
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
						solo
						flat
						autofocus
						hide-details
					/>

					<v-divider />

					<v-textarea
						v-model="form.body"
						:placeholder="$t('common.description')"
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
						item-value="id"
						hide-details
						solo
						flat
					>
						<template v-slot:selection="{ attrs, item, parent, selected }">
							<v-chip
								v-if="item === Object(item)"
								class="font-weight-bold"
								v-bind="attrs"
								:color="item.color"
								:input-value="selected"
								outlined
								label
								small
							>
								<span class="pr-2">
									{{ item.name }}
								</span>
								<v-icon small @click="parent.selectItem(item)">
									mdi-close
								</v-icon>
							</v-chip>
						</template>

						<template v-slot:item="{ index, item }">
							<v-chip class="my-1" :color="item.color" label outlined small>
								{{ item.name }}
							</v-chip>
						</template> </v-select
					><v-select
						v-model="form.priority"
						:menu-props="{ bottom: true, offsetY: true }"
						:items="priorityList"
						placeholder="Приоритет"
						item-value="id"
						hide-details
						solo
						flat
					>
						<template v-slot:selection="{ attrs, item, parent, selected }">
							<v-chip
								v-if="item === Object(item)"
								class="font-weight-bold"
								v-bind="attrs"
								:color="item.color"
								:input-value="selected"
								outlined
								label
								small
							>
								<span class="pr-2">
									{{ item.name }}
								</span>
								<v-icon small @click="parent.selectItem(item)">
									mdi-close
								</v-icon>
							</v-chip>
						</template>

						<template v-slot:item="{ index, item }">
							<v-chip class="my-1" :color="item.color" label outlined small>
								{{ item.name }}
							</v-chip>
						</template> </v-select
					><v-select
						v-model="form.priority"
						:menu-props="{ bottom: true, offsetY: true }"
						:items="priorityList"
						placeholder="Приоритет"
						item-value="id"
						hide-details
						solo
						flat
					>
						<template v-slot:selection="{ attrs, item, parent, selected }">
							<v-chip
								v-if="item === Object(item)"
								class="font-weight-bold"
								v-bind="attrs"
								:color="item.color"
								:input-value="selected"
								outlined
								label
								small
							>
								<span class="pr-2">
									{{ item.name }}
								</span>
								<v-icon small @click="parent.selectItem(item)">
									mdi-close
								</v-icon>
							</v-chip>
						</template>

						<template v-slot:item="{ index, item }">
							<v-chip class="my-1" :color="item.color" label outlined small>
								{{ item.name }}
							</v-chip>
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
import { mapState } from 'vuex';

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
				priority: 2,
			},
		};
	},

	computed: {
		...mapState('support', ['priorityList']),
	},

	watch: {
		dialog(value) {
			if (value === true) {
				this.form.subject = '';
				this.form.body = '';
				this.form.priority = 2;
				if (this.$refs.form) this.$refs.form.resetValidation();
			}
		},
	},

	methods: {
		async create() {
			if (
				this.form.subject.trim() === '' ||
				this.form.subject.trim() === '' ||
				!this.valid
			) {
				this.close();
				return;
			}

			try {
				this.startLoading();
				await axios.post('/trader/ticket/create', this.form);
			} catch (e) {
				console.error(e);
			} finally {
				this.stopLoading();
			}
		},

		close() {
			this.dialog = false;
			setTimeout(() => {
				this.token = null;
				this.secretToken = null;
			}, 200);
		},
	},
};
</script>

<style lang="sass" scoped></style>