<template>
	<v-dialog v-model="dialog" width="600" persistent>
		<template #activator="{ on, attrs }">
			<v-btn block large v-bind="attrs" v-on="on" color="primary">
				{{ $t('support.create_ticket') }}
			</v-btn>
		</template>

		<v-card class="support-dialog-create">
			<v-card-title class="common-dialog__title common-dialog__title--primary justify-space-between">
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
            class="mb-2"
						v-model="form.title"
						:placeholder="$t('common.title')"
						:rules="[rules.required, rules.max64char, rules.messageText]"
            :error-messages="errors.title"
            @input="errors.title = []"
            @change="errors.title = []"
            counter="64"
						flat
						autofocus
					/>

					<v-divider />

          <v-textarea
              v-model="form.message"
              :placeholder="$t('common.description')"
              :rules="[rules.required, rules.max4096char, rules.messageText]"
              :error-messages="errors.message"
              @input="errors.message = []"
              @change="errors.message = []"
              counter="4096"
              flat
          ></v-textarea>

					<v-select
						v-model="form.priority"
						class="mb-1"
						:menu-props="{ bottom: true, offsetY: true }"
						:items="priority_list_select"
						:placeholder="$t('support.menu.priority')"
            :rules="[rules.required]"
						item-value="key"
						hide-details
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
              v-model="form.files"
              :label="$t('support.attach_files')"
              :hint="$t('support.files_hint')"
              accept="image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
              prepend-icon="mdi-paperclip"
              :error-messages="errors.files"
              @input="errors.files = []"
              @change="errors.files = []"
              :rules="[rules.max5files, rules.maxMultiFilesSize15MB, rules.uploadDocTypes]"
              multiple
              :counter="5"
              :show-size="1000"
              persistent-hint
              clearable
          ></v-file-input>
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
	name: 'Add',
	mixins: [formValidationRules, loadingMixin, showNotificationMixin, dialogMethodsMixin],
	data() {
		return {
			valid: false,
			form: {
				title: '',
				message: '',
				priority: null,
				files: null,
			},
      errors: {
        title: [],
        message: [],
        priority: [],
        files: []
      },
		};
	},
	computed: {
		...mapGetters({
			support_statuses: 'support/support_statuses',
			priority_list: 'support/priority_list',
		}),
		priority_list_select() {
			return this.priority_list.filter(p => p.key !== 'all');
		},
	},
	methods: {
		...mapActions({
			addTicketStore: 'support/addTicket',
		}),
		async create() {
			if (!this.form.title.trim()) {
        this.pushErrorNotification(_, 'incorrect');
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
			this.form.title = '';
      this.form.message = '';
			this.form.priority = null;
			this.form.file = null;
			this.$nextTick(() => {
				this.$refs.form.resetValidation();
			});
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
    &--primary
      background-color: var(--v-primary-base)

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
      &--primary
        background-color: var(--v-primary-darken1)
</style>
