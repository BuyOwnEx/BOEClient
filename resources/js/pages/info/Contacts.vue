<template>
	<v-card class="info-page contacts-page flex-grow-1">
		<CommonPageTitle>{{ $t('menu.contacts') }}</CommonPageTitle>
	</v-card>
</template>

<script>
import CommonPageTitle from '../../components/common/CommonPageTitle';

export default {
	name: 'Contacts',

	components: { CommonPageTitle },
};
</script>

<style scoped></style>
