<template>
	<v-dialog
		ref="dialog"
		v-model="dialogProp"
		:fullscreen="$vuetify.breakpoint.mdAndDown"
		no-click-animation
		persistent
		width="600"
	>
		<v-card>
			<v-card-title class="common-dialog__title d-flex flex-nowrap">
				<span>
					{{ subject }}
				</span>
				<v-spacer />
				<v-btn class="mb-auto" icon @click="close">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>

			<v-divider />

			<v-card-text class="common-dialog__content">
				{{ text }}
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'NotificationsDetail',

	props: {
		dialogProp: {
			type: Boolean,
			required: false,
			default: false,
		},
		subject: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			dialog: false,
		};
	},

	watch: {
		dialog() {
			this.$nextTick(this.$refs.dialog.showScroll);
		},
		dialogProp(val) {
			this.dialog = val;
		},
	},

	methods: {
		close() {
			this.$emit('close');
		},
	},
};
</script>
