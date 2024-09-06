<template>
	<v-dialog v-model="dialog" width="600" persistent>
		<template #activator="{ on, attrs }">
			<v-btn block large v-bind="attrs" v-on="on" color="primary">
				{{ $t('support.create_ticket') }}
			</v-btn>
		</template>

		<v-card class="support-dialog-create">
			<v-card-title class="common-dialog__title justify-space-between">
				<span>{{ $t('support.create_ticket') }}</span>
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
              solo
              flat
              hide-details
          ></v-textarea>

					<v-select
						v-model="form.priority"
						class="mb-1"
						:menu-props="{ bottom: true, offsetY: true }"
						:items="priorityListToShow"
						:placeholder="$t('support.menu.priority')"
						item-value="key"
						hide-details
						solo
						flat
					>
						<template #selection="{ attrs, item, parent, selected }">
							<span class="font-weight-bold pr-2" :class="[`${item.color}--text`]">
								{{ item.name }}
							</span>
						</template>

						<template #item="{ item }">
							<span class="font-weight-bold my-1" :class="[`${item.color}--text`]">
								{{ item.name }}
							</span>
						</template>
					</v-select>

					<v-file-input
						v-model="form.file"
						class="support-dialog-create__file"
						accept="image/png, image/jpeg, image/bmp, application/zip"
						:label="$t('support.attach_file')"
						:hint="$t('support.file_hint')"
						:rules="[rules.maxFileSize5MB]"
						persistent-hint
						show-size
						small-chips
					>
						<template #selection="{ text }">
							<v-chip small label color="primary">
								{{ text }}
							</v-chip>
						</template>
					</v-file-input>
				</v-form>
			</v-card-text>

			<v-divider />

			<v-card-actions class="common-dialog__actions">
				<v-spacer />

				<v-btn small tile text plain @click="close">
					{{ $t('common.close') }}
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
					{{ $t('common.create') }}
				</v-btn>

				<v-spacer />
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import formValidationRules from '@/mixins/common/formValidationRules';
import loadingMixin from '@/mixins/common/loadingMixin';
import showNotificationMixin from '@/mixins/common/showNotificationMixin';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin';

export default {
	name: 'UserApiDialogCreate',

	mixins: [formValidationRules, loadingMixin, showNotificationMixin, dialogMethodsMixin],

	data() {
		return {
			valid: false,

			form: {
				subject: '',
				body: '',
				priority: null,
				file: null,
			},
		};
	},

	computed: {
		...mapGetters({
			supportStatuses: 'support/supportStatuses',
			priorityList: 'support/priorityList',
		}),

		priorityListToShow() {
			return this.priorityList.filter(p => p.key !== 'all');
		},
	},

	methods: {
		...mapActions({
			addTicketStore: 'support/addTicket',
		}),

		async create() {
			if (!this.form.subject.trim()) {
				this.pushErrorNotification();
				return;
			}

			try {
				this.startLoading();

				await this.addTicketStore(this.form);

				this.close();
			} finally {
				this.stopLoading();
			}
		},

		clearData() {
			this.form.subject = '';
			this.form.priority = null;
			this.form.file = null;
			this.form.body = '';
			this.$nextTick(() => {
				this.$refs.form.resetValidation();
			});
		},
	},
};
</script>

<style lang="scss">
.support-dialog-create {
	&__file {
		padding: 8px 12px;
	}
	::v-deep.v-input__slot {
		padding: 0;
	}
}
</style>
