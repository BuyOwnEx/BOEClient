<template>
    <v-app>
        <!-- Layout component -->
        <component :is="currentLayout">
            <transition name="fade" mode="out-in">
                <trading />
            </transition>
        </component>

        <v-snackbar v-model="toast.show" :timeout="toast.timeout" :color="toast.color" bottom>
            {{ toast.message }}
            <v-btn v-if="toast.timeout === 0" color="white" text @click="toast.show = false">{{ $t('common.close') }}</v-btn>
        </v-snackbar>

        <!-- Demo customization menu -->
        <!--<customization-menu />-->
    </v-app>
</template>

<script>
    import { mapState } from 'vuex'
    import CustomizationMenu from './components/demo/CustomizationMenu'
    import config from './configs'
    import defaultLayout from './layouts/DefaultLayout'
    import Trading from "./pages/trading/Trading";
    export default {
        name: "TradingApp",
        components: {
            Trading,
            CustomizationMenu,
            defaultLayout
        },
        data: () => ({
            currentLayout: 'defaultLayout',
        }),
        computed: {
            ...mapState('app', ['toast']),
        },
        head: {
            link: [
                // adds config/icons into the html head tag
                ...config.icons.map((href) => ({ rel: 'stylesheet', href }))
            ]
        }
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
