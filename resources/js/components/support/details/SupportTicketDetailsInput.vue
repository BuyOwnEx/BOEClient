<template>
	<div class="editor">

    <v-textarea
        v-model="body"
        :placeholder="$t('common.description')"
        solo
        flat
        hide-details
    ></v-textarea>

		<v-divider />

		<div class="d-flex align-center pa-2">
			<v-btn :loading="loading" color="primary" @click="addComment">
				{{ $t('common.send') }}
			</v-btn>

			<v-file-input
				v-model="file"
				class="pa-0 mx-1"
				accept="image/png, image/jpeg, image/bmp, application/zip"
				hide-input
			/>
		</div>
	</div>
</template>

<script>

export default {
	name: 'SupportTicketDetailsInput',

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
			body: '',
			file: null,
		};
	},

	watch: {
		clear(val) {
			if (val) {
				this.body = '';
				this.file = null;
				this.$emit('cleared');
			}
		},
	},

	methods: {
		addComment() {
			const comment = {
				ticketId: this.ticketId,
				body: this.body,
				file: this.file,
			};
			this.$emit('add', comment);
		},
	},
};
</script>

<style lang="scss">
.editor {
	position: relative;

	.v-btn {
		&.is-active {
			background-color: #f1f1f1;
		}
	}
}
</style>
