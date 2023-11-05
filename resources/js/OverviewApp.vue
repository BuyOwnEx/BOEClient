<template>
    <v-app>
        <layout>
            <transition name="fade" mode="out-in">
                <overview />
            </transition>
        </layout>
    </v-app>
</template>

<script>
import config from './configs';
import Layout from "./layouts/DefaultLayout.vue";
import Overview from './pages/overview/Overview.vue'
export default {
    name: "OverviewApp",
    components: {
        Layout,
        Overview
    },
    head: {
        link: [
            // adds config/icons into the html head tag
            ...config.icons.map(href => ({ rel: 'stylesheet', href })),
        ],
    },
    mounted() {
        this.$store.commit('app/setAuthUser', { user: this.$user, vm: this });
        this.$store.commit('app/setConfig', { config: this.$config, vm: this });
    },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition-duration: 0.2s;
    transition-property: opacity;
    transition-timing-function: ease;
}
.fade-enter,
.fade-leave-active {
    opacity: 0;
}
</style>
