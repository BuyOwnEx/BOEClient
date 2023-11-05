<template>
	<v-card class='text-center w-full error-page pa-3'>
		<v-img :src='ErrorImg' max-height='400' contain />
		<div class='display-2 mt-10'>OOPS! Something went wrong here</div>
		<div class='mt-3 mb-10'>Our experts are working to fix the issue.</div>
	</v-card>
</template>
<script>
import ErrorImg from '@/assets/images/illustrations/500-illustration.svg';

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
