<template>
    <v-app>
        <!-- Layout component -->
        <component :is="currentLayout">
            <transition name="fade" mode="out-in">
                <component v-bind:is="component"></component>
            </transition>
        </component>

        <v-snackbar v-model="toast.show" :timeout="toast.timeout" :color="toast.color" bottom>
            {{ toast.message }}
            <v-btn v-if="toast.timeout === 0" color="white" text @click="toast.show = false">{{ $t('common.close') }}</v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
    import { mapState } from 'vuex'
    import config from './configs'
    import authLayout from './layouts/AuthLayout'
    export default {
        name: "AuthApp",
        components: {

            authLayout
        },
        data: () => ({
            currentLayout: 'authLayout',
            component: null,
        }),
        computed: {
            ...mapState('app', ['toast']),
        },
        head: {
            link: [
                // adds config/icons into the html head tag
                ...config.icons.map((href) => ({ rel: 'stylesheet', href }))
            ]
        },
        created: function () {
            this.component = this.$component;
            this.lang = this.$lang;
        }
    }
</script>

<style scoped>

</style>