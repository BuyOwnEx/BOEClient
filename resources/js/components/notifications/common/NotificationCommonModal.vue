<template>
	<v-dialog
		ref="dialog"
		v-model="dialog"
		:fullscreen="$vuetify.breakpoint.mdAndDown"
		:hide-overlay="!$vuetify.breakpoint.mdAndDown"
		no-click-animation
		persistent
		width="600"
	>
		<v-card>
			<v-card-title class="common-dialog__title">
				<span>
					{{ notification.title }}
				</span>
				<v-spacer />
				<v-btn icon @click="$emit('close')">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>

			<v-divider />

			<v-card-text class="common-dialog__content">
				{{ notification.text }}
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'NotificationCommonModal',

	props: {
		show: {
			type: Boolean,
			required: true,
		},
		notification: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			dialog: false,
		};
	},

	watch: {
		showCompose(val) {
			this.dialog = val;
		},
		dialog() {
			this.$nextTick(this.$refs.dialog.showScroll);
		},
	},

	mounted() {
		this.dialog = this.show;
	},
};
</script>

<style lang="scss"></style>
