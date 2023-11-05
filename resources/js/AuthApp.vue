<template>
	<v-app>
        <layout>
            <transition name="fade" mode="out-in">
                <component v-bind:is="component"></component>
            </transition>
        </layout>
	</v-app>
</template>

<script>
import config from './configs';
import Layout from "./layouts/AuthLayout.vue";
export default {
	name: 'AuthApp',
    components: {
        Layout
    },
    data: () => ({
		component: null,
	}),
    computed: {
        loader() {
            return () => import(`./pages/auth/${this.$component}`+`.vue`);
        },
    },
	head: {
		link: [
			// adds config/icons into the html head tag
			...config.icons.map(href => ({ rel: 'stylesheet', href })),
		],
	},
    created() {
        this.loader().then(res => {
            // components can be defined as a function that returns a promise;
            this.component = () => this.loader();
        })
    },
};
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
