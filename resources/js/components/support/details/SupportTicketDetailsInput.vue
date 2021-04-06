<template>
	<div class="email-editor">
		<editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
			<div class="pa-1">
				<v-btn
					icon
					tile
					:class="{ 'is-active': isActive.bold() }"
					@click="commands.bold"
				>
					<v-icon>mdi-format-bold</v-icon>
				</v-btn>

				<v-btn
					icon
					tile
					:class="{ 'is-active': isActive.italic() }"
					@click="commands.italic"
				>
					<v-icon>mdi-format-italic</v-icon>
				</v-btn>

				<v-btn
					icon
					tile
					:class="{ 'is-active': isActive.strike() }"
					@click="commands.strike"
				>
					<v-icon>mdi-format-strikethrough</v-icon>
				</v-btn>

				<v-btn
					icon
					tile
					:class="{ 'is-active': isActive.underline() }"
					@click="commands.underline"
				>
					<v-icon>mdi-format-underline</v-icon>
				</v-btn>

				<v-btn
					icon
					tile
					:class="{ 'is-active': isActive.paragraph() }"
					@click="commands.paragraph"
				>
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

				<v-btn
					icon
					tile
					:class="{ 'is-active': isActive.bullet_list() }"
					@click="commands.bullet_list"
				>
					<v-icon>mdi-format-list-bulleted</v-icon>
				</v-btn>

				<v-btn
					icon
					tile
					:class="{ 'is-active': isActive.ordered_list() }"
					@click="commands.ordered_list"
				>
					<v-icon>mdi-format-list-numbered</v-icon>
				</v-btn>

				<v-btn
					icon
					tile
					:class="{ 'is-active': isActive.blockquote() }"
					@click="commands.blockquote"
				>
					<v-icon>mdi-format-quote-close</v-icon>
				</v-btn>

				<v-btn
					icon
					tile
					:class="{ 'is-active': isActive.code_block() }"
					@click="commands.code_block"
				>
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

		<editor-content class="editor__content pa-3 py-4" :editor="editor" />

		<v-divider />

		<div class="d-flex align-center pa-2">
			<v-btn :loading="loading" color="primary" @click="addComment">
				{{ $t('email.send') }}
			</v-btn>

			<v-file-input
				v-model="image"
				class="pa-0 mx-1"
				accept="image/*"
				hide-input
			/>
		</div>
	</div>
</template>

<script>
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

export default {
	name: 'SupportTicketDetailsInput',

	components: {
		EditorContent,
		EditorMenuBar,
	},

	props: {
		ticketId: {
			type: Number,
			required: true,
		},
		loading: {
			type: Boolean,
			required: true,
		},
		clear: {
			type: Boolean,
			required: true,
		},
	},

	data() {
		return {
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
			image: null,
		};
	},

	watch: {
		clear(val) {
			if (val) {
				this.editor.clearContent();
				this.image = null;
				this.$emit('cleared');
			}
		},
	},

	beforeDestroy() {
		this.editor.destroy();
	},

	methods: {
		addComment() {
			const payload = {
				ticketId: this.ticketId,
				body: this.editor.getHTML(),
				image: this.image,
			};
			const bodyJSON = this.editor.getJSON();

			this.$emit('add', { payload, bodyJSON });
		},
	},
};
</script>

<style lang="scss">
.email-editor {
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

.theme--dark {
	.editor__content blockquote p {
		color: white;
	}
}
</style>
