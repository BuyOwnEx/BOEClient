<template>
	<v-dialog v-model="dialog" width="600" persistent>
		<template v-slot:activator="{ on, attrs }">
			<v-btn block large v-bind="attrs" v-on="on" color="primary">
				{{$t('support.create_ticket')}}
			</v-btn>
		</template>

		<v-card class="support-dialog-create">
			<v-card-title class="common-dialog__title justify-space-between">
				<span>{{$t('support.create_ticket')}}</span>
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

					<!--					<v-textarea-->
					<!--						v-model="form.body"-->
					<!--						:placeholder="$t('common.description')"-->
					<!--						:rules="[rules.required]"-->
					<!--						hide-details-->
					<!--						auto-grow-->
					<!--						solo-->
					<!--						flat-->
					<!--					/>-->
					<div class="editor">
						<input
							type="text"
							v-model="editor.extensions.options.placeholder.emptyNodeText"
						/>
						<editor-content
							class="editor__content"
							ref="editor"
							:editor="editor"
						/>
					</div>

					<v-divider />

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
						<template v-slot:selection="{ text }">
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
import { mapState, mapActions } from 'vuex';

import { Editor, EditorContent } from 'tiptap';
import { Placeholder } from 'tiptap-extensions';

import formValidationRules from '../../../mixins/common/formValidationRules';
import loadingMixin from '../../../mixins/common/loadingMixin';
import errorNotificationMixin from '../../../mixins/common/errorNotificationMixin';

export default {
	name: 'UserApiDialogCreate',

	components: { EditorContent },

	mixins: [formValidationRules, loadingMixin, errorNotificationMixin],

	data() {
		return {
			dialog: false,
			valid: false,

			form: {
				subject: '',
				body: '',
				priority: null,
				file: null,
			},

			editor: new Editor({
				extensions: [
					new Placeholder({
						emptyEditorClass: 'is-editor-empty',
						emptyNodeClass: 'is-empty',
						emptyNodeText: 'Описание',
					}),
				],
				content: '',
			}),
		};
	},

	computed: {
		...mapState('support', ['priorityList']),

		priorityListToShow() {
			return this.priorityList.filter(p => p.key !== 'all');
		},
	},

	watch: {
		dialog(value) {
			if (value === true) {
				this.$nextTick(() => {
					this.form.subject = '';
					this.form.priority = null;
					this.form.file = null;
					this.editor.clearContent();
					this.$refs.form.resetValidation();
				});
			}
		},
	},

	beforeDestroy() {
		this.editor.destroy();
	},

	methods: {
		...mapActions({
			addTicketStore: 'support/addTicket',
		}),

		async create() {
			if (this.form.subject.trim() === '') {
				this.pushErrorNotification();
				return;
			}

			try {
				this.startLoading();

				const payload = {
					...this.form,
					body: this.editor.getHTML(),
				};
				await this.addTicketStore(payload);

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

<style lang="scss" scoped>
.support-dialog-create {
	&__file {
		padding: 8px 12px;
	}

	::v-deep.v-input__slot {
		padding: 0;
	}

	.editor {
		position: relative;
		padding: 12px;
		&__content {
			outline: none;
			.ProseMirror:focus {
				background: yellow !important;
				outline: none !important;
			}
			p.is-editor-empty:first-child::before {
				content: attr(data-empty-text);
				float: left;
				color: #aaa;
				pointer-events: none;
				height: 0;
			}
		}
	}
}
</style>
