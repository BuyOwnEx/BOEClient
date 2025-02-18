<template>
	<CommonDialog
		confirm-color="error"
    :confirm-text="$t('common.delete')"
		header-color="error"
		@confirm="deleteOne"
	>
		<template #default>
			<v-btn color="error" small tile v-if="$vuetify.breakpoint.smAndUp">
				{{ $t('user.api.dialog.delete_one.title') }}
			</v-btn>

			<v-btn v-else icon color="error" small>
				<v-icon>
					mdi-delete
				</v-icon>
			</v-btn>
		</template>

		<template #title>
			{{ $t('user.api.dialog.delete_one.title') }}
		</template>

		<template #content>
			{{ $t('user.api.dialog.delete_one.description') }}
			<b>{{ name }} </b>?
		</template>
	</CommonDialog>
</template>

<script>
import CommonDialog from '@/components/common/CommonDialog.vue';

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
			this.$emit('delete');
			await axios.post('/trader/ext/delete_api_token', { id: this.id });
		},
	},
};
</script>
