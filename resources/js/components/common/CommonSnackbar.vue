<template>
	<v-snackbar
		v-model="show"
		:color="color"
		:timeout="timeout"
		:multi-line="multiline"
		right
		bottom
	>
		{{ message }}

		<template v-slot:action="{ attrs }">
			<v-btn v-bind="attrs" text plain @click="hideSnackbar">Close</v-btn>
		</template>
	</v-snackbar>
</template>

<script>
export default {
	name: 'CommonSnackbar',

	data() {
		return {
			show: false,
			message: '',
			color: '',
			timeout: 6000,
			multiline: false,
		};
	},

	methods: {
		hideSnackbar() {
			this.show = false;
		},
	},

	created() {
		this.$store.subscribe((mutation, state) => {
			if (mutation.type === 'snackbar/SHOW_MESSAGE') {
				this.message = state.snackbar.text;
				this.color = state.snackbar.color;
				this.timeout = state.snackbar.timeout;
				this.multiline = state.snackbar.isMultiline;
				this.show = true;
			}
		});
	},
};
</script>

<style scoped></style>
