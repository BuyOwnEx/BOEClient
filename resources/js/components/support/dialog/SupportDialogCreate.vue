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

					<div class="editor">
						<editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
							<div class="pa-1">
								<v-btn icon tile :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
									<v-icon>mdi-format-bold</v-icon>
								</v-btn>

								<v-btn icon tile :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
									<v-icon>mdi-format-italic</v-icon>
								</v-btn>

								<v-btn icon tile :class="{ 'is-active': isActive.strike() }" @click="commands.strike">
									<v-icon>mdi-format-strikethrough</v-icon>
								</v-btn>

								<v-btn icon tile :class="{ 'is-active': isActive.underline() }" @click="commands.underline">
									<v-icon>mdi-format-underline</v-icon>
								</v-btn>

								<v-btn icon tile :class="{ 'is-active': isActive.paragraph() }" @click="commands.paragraph">
									<v-icon>mdi-format-paragraph</v-icon>
								</v-btn>

								<v-btn
									icon
									tile
									:class="{ 'is-active': isActive.heading({ level: 1 }) }"
									@click="commands.heading({ level: 1 })"
								>
									H1
								</v-btn>

								<v-btn
									icon
									tile
									:class="{ 'is-active': isActive.heading({ level: 2 }) }"
									@click="commands.heading({ level: 2 })"
								>
									H2
								</v-btn>

								<v-btn
									icon
									tile
									:class="{ 'is-active': isActive.heading({ level: 3 }) }"
									@click="commands.heading({ level: 3 })"
								>
									H3
								</v-btn>

								<v-btn icon tile :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list">
									<v-icon>mdi-format-list-bulleted</v-icon>
								</v-btn>

								<v-btn icon tile :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list">
									<v-icon>mdi-format-list-numbered</v-icon>
								</v-btn>

								<v-btn icon tile :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote">
									<v-icon>mdi-format-quote-close</v-icon>
								</v-btn>

								<v-btn icon tile :class="{ 'is-active': isActive.code_block() }" @click="commands.code_block">
									<v-icon>mdi-code-tags</v-icon>
								</v-btn>

								<v-btn icon tile @click="commands.horizontal_rule">
									<v-icon>mdi-minus</v-icon>
								</v-btn>

								<v-btn icon tile @click="commands.undo">
									<v-icon>mdi-undo</v-icon>
								</v-btn>

								<v-btn icon tile @click="commands.redo">
									<v-icon>mdi-redo</v-icon>
								</v-btn>
							</div>
						</editor-menu-bar>
						<v-divider />
						<editor-content class="editor__content ticket-editor-content py-2" :editor="editor" />
						<v-divider />
					</div>

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

import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
	Blockquote,
	CodeBlock,
	HardBreak,
	Heading,
	HorizontalRule,
	OrderedList,
	BulletList,
	ListItem,
	TodoItem,
	TodoList,
	Bold,
	Code,
	Italic,
	Link,
	Strike,
	Underline,
	History,
} from 'tiptap-extensions';

import formValidationRules from '../../../mixins/common/formValidationRules';
import loadingMixin from '../../../mixins/common/loadingMixin';
import showNotificationMixin from '../../../mixins/common/showNotificationMixin';
import dialogMethodsMixin from '../../../mixins/common/dialogMethodsMixin';

export default {
	name: 'UserApiDialogCreate',

	components: {
		EditorContent,
		EditorMenuBar,
	},

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

			editor: new Editor({
				extensions: [
					new Blockquote(),
					new BulletList(),
					new CodeBlock(),
					new HardBreak(),
					new Heading({ levels: [1, 2, 3] }),
					new HorizontalRule(),
					new ListItem(),
					new OrderedList(),
					new TodoItem(),
					new TodoList(),
					new Link(),
					new Bold(),
					new Code(),
					new Italic(),
					new Strike(),
					new Underline(),
					new History(),
				],
				content: `
				  Default message
				`,
			}),
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

	beforeDestroy() {
		this.editor.destroy();
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

		clearData() {
			this.form.subject = '';
			this.form.priority = null;
			this.form.file = null;
			this.editor.clearContent();
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
	.ticket-editor-content {
		padding: 0 12px;
	}
	::v-deep.v-input__slot {
		padding: 0;
	}

	.editor {
		position: relative;

		.v-btn {
			&.is-active {
				background-color: #f1f1f1;
			}
		}

		.editor__content {
			overflow-wrap: break-word;
			word-wrap: break-word;
			word-break: break-word;

			* {
				caret-color: currentColor;
			}

			.ProseMirror {
				&:focus {
					outline: none;
				}
			}

			ul,
			ol {
				padding-left: 1rem;
			}

			li > p,
			li > ol,
			li > ul {
				margin: 0;
			}

			a {
				color: inherit;
			}

			blockquote {
				border-left: 3px solid #b1b1b166;
				color: rgba(0, 0, 0, 0.8);
				padding-left: 0.8rem;
				font-style: italic;

				p {
					margin: 0;
				}
			}

			img {
				max-width: 100%;
				border-radius: 3px;
			}

			table {
				border-collapse: collapse;
				table-layout: fixed;
				width: 100%;
				margin: 0;
				overflow: hidden;

				td,
				th {
					min-width: 1em;
					border: 2px solid #fafafa;
					padding: 3px 5px;
					vertical-align: top;
					box-sizing: border-box;
					position: relative;

					> * {
						margin-bottom: 0;
					}
				}

				th {
					font-weight: bold;
					text-align: left;
				}

				.selectedCell:after {
					z-index: 2;
					position: absolute;
					content: '';
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					background: rgba(200, 200, 255, 0.4);
					pointer-events: none;
				}

				.column-resize-handle {
					position: absolute;
					right: -2px;
					top: 0;
					bottom: 0;
					width: 4px;
					z-index: 20;
					background-color: #adf;
					pointer-events: none;
				}
			}

			.tableWrapper {
				margin: 1em 0;
				overflow-x: auto;
			}

			.resize-cursor {
				cursor: ew-resize;
				cursor: col-resize;
			}
		}
	}
}
.theme--dark .support-dialog-create {
	.editor__content blockquote p {
		color: white;
	}
}
</style>
