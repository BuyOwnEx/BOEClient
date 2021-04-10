<template>
	<v-tooltip bottom>
		<template v-slot:activator="{ on }">
			<div
				ref="copylabel"
				class="copylabel animate__faster"
				v-on="on"
				@click.stop.prevent="copy"
			>
				{{ text }}
			</div>
		</template>
		<span>{{ tooltip }}</span>
	</v-tooltip>
</template>

<script>
export default {
	name: 'CopyLabel',

	props: {
		text: {
			type: String,
			default: '',
		},
		toastText: {
			type: String,
			default: 'Copied to clipboard!',
		},
	},

	data() {
		return {
			tooltip: 'Copy',
			timeout: null,
		};
	},

	beforeDestroy() {
		if (this.timeout) clearTimeout(this.timeout);
	},

	methods: {
		copy() {
			this.$clipboard(this.text, this.toastText);
			this.tooltip = 'Copied!';

			this.timeout = setTimeout(() => {
				this.tooltip = 'Copy';
			}, 2000);
		},
	},
};
</script>

<style scoped>
.copylabel {
	cursor: pointer;
	display: inline-block;
	border-bottom: 1px dashed;
}
</style>
