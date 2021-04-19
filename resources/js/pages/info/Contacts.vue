<template>
	<v-card class="info-page contacts-page flex-grow-1">
		<CommonPageTitle>{{ $t('contacts.title') }}</CommonPageTitle>
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
