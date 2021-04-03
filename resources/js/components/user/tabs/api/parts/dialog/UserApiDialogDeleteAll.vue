<template>
	<CommonDialog
		confirm-color="error"
		confirm-text="Удалить"
		header-color='error'
		@confirm="deleteAll"
	>
		<template #default>
			<v-btn small tile color="error">Удалить все API</v-btn>
		</template>

		<template #title>
			Удалить все API
		</template>

		<template #content>
			Вы уверены, что хотите удалить все API? Изменения нельзя отменить..
			подумайте о себе, о своих близких. Такое решение нельзя совершать не
			обдумав
		</template>
	</CommonDialog>
</template>

<script>
import CommonDialog from '../../../../../common/CommonDialog';

export default {
	name: 'UserApiDialogDeleteAll',

	components: { CommonDialog },

	methods: {
		async deleteAll() {
			try {
				this.$emit('delete');
				await axios.post('/trader/ext/delete_all_api_tokens');
			} catch (e) {
				console.error(e);
			}
		},
	},
};
</script>
