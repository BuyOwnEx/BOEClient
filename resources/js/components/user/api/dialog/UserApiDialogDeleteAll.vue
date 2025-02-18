<template>
	<CommonDialog
		confirm-color="error"
    :confirm-text="$t('common.delete')"
		header-color="error"
		@confirm="deleteAll"
	>
		<template #default>
			<v-btn small tile color="error">{{
				$t('user.api.dialog.delete_all.title')
			}}</v-btn>
		</template>

		<template #title>
			{{ $t('user.api.dialog.delete_all.title') }}
		</template>

		<template #content>
			{{ $t('user.api.dialog.delete_all.description') }}
		</template>
	</CommonDialog>
</template>

<script>
import CommonDialog from '@/components/common/CommonDialog.vue';

export default {
	name: 'UserApiDialogDeleteAll',

	components: { CommonDialog },

	methods: {
		async deleteAll() {
			this.$emit('delete');
			await axios.post('/trader/ext/delete_all_api_tokens');
		},
	},
};
</script>
