<template>
	<v-app>
		<component :is="this.$route.meta.layout" v-if="isRouterLoaded">
			<transition name="fade" mode="out-in">
				<router-view />
			</transition>
		</component>
	</v-app>
</template>

<script>
import config from './configs';
export default {
	computed: {
		isRouterLoaded: function() {
			return this.$route.name !== null;
		},
	},
	head: {
		link: [
			// adds config/icons into the html head tag
			...config.icons.map(href => ({ rel: 'stylesheet', href, undo: false })),
		]
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
