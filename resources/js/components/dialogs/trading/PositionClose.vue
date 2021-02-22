<template>
	<v-form ref='form' v-model='valid'>
		<v-dialog v-model='dialog' max-width='500px'>
			<template v-slot:activator='{ on }'>
				<v-list-item dense v-on='on'>
					<v-list-item-title>{{ menuTitle }}</v-list-item-title>
				</v-list-item>
			</template>
			<v-card>
				<v-card-title>
					<span class='headline'>{{ formTitle }}</span>
				</v-card-title>
				<v-card-text>
					{{ $t('trading.dialogs.descriptions.close_position') }}
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color='blue darken-1' text @click='close'>{{ cancelTitle }}</v-btn>
					<v-btn color='blue darken-1' text @click='apply' :loading='loading' :disabled='loading'>{{ actionTitle }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-form>
</template>

<script>
export default {
	name: 'PositionClose',
	props: ['id'],
	data() {
		return {
			dialog: false,
			valid: true,
			loading: false,
			formTitle: 'Closing position',
			menuTitle: this.$t('trading.close_position'),
			cancelTitle: 'Cancel',
			actionTitle: 'Close',
			form: {
				position: this.id,
			},
		};
	},
	computed: {},
	watch: {
		dialog(val) {
			if (val) this.$emit('closeMenu');
			else this.close();
		},
	},
	methods: {
		reset() {
			this.$refs.form.reset();
		},
		close() {
			this.dialog = false;
			this.reset();
		},
		apply() {
			let self = this;
			this.loading = true;
			axios.post('/trader/ext/position/close', this.form)
				.then((response) => {
					if (response.data.success === true) {
						self.close();
					}
				}).finally(function() {
				self.loading = false;
			});
		},
	},
};
</script>

<style scoped>

</style>