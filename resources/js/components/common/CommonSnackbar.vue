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

		<template #action="{ attrs }">
			<v-btn v-bind="attrs" icon @click="hideSnackbar">
				<v-icon>
					mdi-close
				</v-icon>
			</v-btn>
		</template>
	</v-snackbar>
</template>

<script>
export default {
	name: 'CommonSnackbar',

	data() {
		return {
			show: false,
			message: null,
			color: null,
			timeout: null,
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
				this.message = state.snackbar.snack.text;
				this.color = state.snackbar.snack.color;
				this.timeout = state.snackbar.snack.timeout;
				this.multiline = state.snackbar.snack.text > 100;
				this.show = true;
			}
		});
	},
};
</script>

<style scoped></style>
