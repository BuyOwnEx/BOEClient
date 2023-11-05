<template>
    <v-card class='text-center w-full error-page pa-3'>
        <v-img :src='MaintenanceImg' max-height='400' contain />
        <div class='display-2 mt-10'>{{ $t('utility.maintenance') }}</div>
        <div class='mt-3 mb-6'>We will be back soon</div>
    </v-card>
</template>
<script>

import MaintenanceImg from '@/assets/images/illustrations/maintenance-illustration.svg';

export default {
    data() {
        return {
            MaintenanceImg
        };
    }
};
</script>
<style>
.error-page {
    max-width: 500px;
}
</style>
