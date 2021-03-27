<template>
	<CommonDialog
		confirm-color="error"
		confirm-text="Удалить"
		@confirm="deleteOne"
	>
		<template #default>
			<v-btn v-if="$vuetify.breakpoint.smAndUp">Удалить API</v-btn>

			<v-btn v-else icon>
				<v-icon color="#888888d6">
					mdi-delete
				</v-icon>
			</v-btn>
		</template>

		<template #title>
			Удалить API
		</template>

		<template #content>
			Вы уверены, что хотите удалить API с именем
			<b>{{ name }} </b>?
		</template>
	</CommonDialog>
</template>

<script>
import CommonDialog from '../../../../../common/CommonDialog';

export default {
	name: 'UserApiDialogDeleteOne',

	components: { CommonDialog },

	props: {
		id: {
			type: [Number, String],
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	},

	methods: {
		async deleteOne() {
			try {
				this.$emit('delete');
				await axios.post('/trader/ext/delete_api_token', this.id);
			} catch (e) {
				console.error(e);
			}
		},
	},
};
</script>

<style scoped></style>
