<template>
	<v-app>
		<component :is="currentLayout" v-if="isRouterLoaded">
			<transition name="fade" mode="out-in">
				<router-view />
			</transition>
		</component>

		<!-- Demo customization menu -->
		<customization-menu />
	</v-app>
</template>

<script>
// Demo Menu
import CustomizationMenu from './components/demo/CustomizationMenu';

import config from './configs';

// Layouts
import defaultLayout from './layouts/DefaultLayout';
import landingLayout from './layouts/LandingLayout';
import simpleLayout from './layouts/SimpleLayout';
import authLayout from './layouts/AuthLayout';
import errorLayout from './layouts/ErrorLayout';

/*
|---------------------------------------------------------------------
| Main Application Component
|---------------------------------------------------------------------
|
| In charge of choosing the layout according to the router metadata
|
*/
export default {
	components: {
		CustomizationMenu,
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
/**
 * Transition animation between pages
 */
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
