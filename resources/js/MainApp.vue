<template>
	<v-app>
		<layout>
			<transition name="fade" mode="out-in">
				<component :is="component"></component>
			</transition>
        </layout>
	</v-app>
</template>

<script>
import config from './configs';
import Layout from "./layouts/DefaultLayout.vue";
export default {
	name: 'MainApp',
    components: {
        Layout
    },
	data: () => ({
		component: null,
	}),
  computed: {
    loader() {
      return () => import(`./pages/main/${this.$component}`+`.vue`);
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
	mounted() {
		//this.$store.commit('app/setAuthUser', { user: this.$user, vm: this });
		//this.$store.commit('app/setConfig', { config: this.$config, vm: this });
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
