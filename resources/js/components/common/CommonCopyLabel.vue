<template>
	<v-tooltip bottom>
		<template v-slot:activator="{ on }">
			<span class="clickable" v-on="on" @click="copy">
				<v-icon v-if="icon" small>
					{{ icon }}
				</v-icon>

				<span ref="copyLabel" class="copy-label">
					{{ text }}
				</span>
			</span>
		</template>

		<span>{{ tooltip }}</span>
	</v-tooltip>
</template>

<script>
export default {
	name: 'CommonCopyLabel',

	props: {
		text: {
			type: String,
			default: '',
		},
		icon: {
			type: String,
			required: false,
		},
	},

	data() {
		return {
			tooltip: this.$t('copy.copy'),
			snackText: this.$t('copy.copied_to_clipboard'),

			timeout: null,
		};
	},

	beforeDestroy() {
		if (this.timeout) clearTimeout(this.timeout);
	},

	methods: {
		copy() {
			this.createTextareaAndCopy();
			this.showSnackbar();
			this.showTooltip();
		},
		createTextareaAndCopy() {
			this.$copyText(this.text,this.$refs.copyLabel);
		},
		showSnackbar() {
			this.$store.commit('snackbar/SHOW_MESSAGE', {
				text: this.snackText,
				timeout: 1000,
			});
		},
		showTooltip() {
			this.tooltip = this.$t('copy.copied');
			this.timeout = setTimeout(() => {
				this.tooltip = this.$t('copy.copy');
			}, 2000);
		},
	},
};
</script>

<style scoped>
.copy-label {
	display: inline-block;
	border-bottom: 1px dashed;
}
</style>
