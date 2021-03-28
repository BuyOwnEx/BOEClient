<template>
	<CommonDialog @confirm='confirm'>
		<template #default>
			<slot></slot>
		</template>

		<template #title>
			<slot name="header">Подтверждение отмены</slot>
		</template>

		<template #content>
			<slot name="content">Вы уверены, что хотите отменить ордер?</slot>
		</template>
	</CommonDialog>
</template>

<script>
import CommonDialog from '../../../common/CommonDialog';

export default {
	name: 'OwnListConfirmDialog',

	components: { CommonDialog },

	methods: {
		confirm() {
			this.$emit('confirm')
		}
	}
};
</script>
