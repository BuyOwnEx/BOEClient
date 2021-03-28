<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on, attrs }">
			<v-btn small tile :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" :loading="creating" color="success" v-bind="attrs" v-on="on">
				Создать API
			</v-btn>
		</template>

		<v-card>
			<v-card-title class="pb-0">Создать API</v-card-title>

			<v-form ref="form" class="user-api-create__form" @submit.prevent="create">
				<v-card-text>
					<v-text-field
						v-model="form.name"
						label="API name"
						hide-details
						outlined
						dense
					/>
				</v-card-text>

				<v-divider />

				<v-card-actions>
					<v-spacer />

					<v-btn small tile text @click="close">
						Закрыть
					</v-btn>

					<v-spacer />

					<v-btn :loading="creating" type="submit" color="primary" small tile text>
						Создать
					</v-btn>

					<v-spacer />
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'UserApiDialogCreate',

	data() {
		return {
			dialog: false,
			creating: false,
			form: {
				name: '',
				abilities: "'trading','withdraw'",
			},
		};
	},

	methods: {
		async create() {
			if (this.form.name.trim() === '') {
				this.close();
				return;
			}

			try {
				this.startLoading();

				const { data } = await axios.post(
					'/trader/ext/new_api_token',
					this.form
				);

				this.$emit('create', data.data.accessToken);
				this.close();
				this.clearForm();
			} catch (e) {
				console.error(e);
			} finally {
				this.stopLoading();
			}
		},

		clearForm() {
			this.$refs.form.reset();
		},
		startLoading() {
			this.creating = true;
		},
		stopLoading() {
			this.creating = false;
		},
		close() {
			this.dialog = false;
		},
	},
};
</script>

<style scoped></style>
