<template>
	<v-app>
		<component :is="currentLayout" v-if="isRouterLoaded">
			<transition name="fade" mode="out-in">
				<router-view />
			</transition>
		</component>
	</v-app>
</template>

<script>

import config from './configs';

import defaultLayout from './layouts/DefaultLayout';
import landingLayout from './layouts/LandingLayout';
import simpleLayout from './layouts/SimpleLayout';
import authLayout from './layouts/AuthLayout';
import errorLayout from './layouts/ErrorLayout';

export default {
	components: {
		defaultLayout,
		landingLayout,
		simpleLayout,
		authLayout,
		errorLayout,
	},
	computed: {
		isRouterLoaded: function() {
			return this.$route.name !== null;
		},
		currentLayout: function() {
			const layout = this.$route.meta.layout || 'default';
			return layout + 'Layout';
		},
	},
	head: {
		link: [
			// adds config/icons into the html head tag
			...config.icons.map(href => ({ rel: 'stylesheet', href })),
		],
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
