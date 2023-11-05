<template>
	<v-card class='text-center w-full error-page pa-3'>
		<v-img :src='ErrorImg' max-height='400' contain />
		<div class='display-2 mt-10'>404</div>
		<div class='mt-3 mb-6'>Sorry we can't seem to find the page you're looking for.</div>
	</v-card>
</template>
<script>

import ErrorImg from '@/assets/images/illustrations/404-illustration.svg';

export default {
    data() {
        return {
            ErrorImg
        };
    }
};
</script>
<style>
.error-page {
	max-width: 500px;
}
</style>
