<template>
	<v-app>
		<component :is="currentLayout">
			<transition name="fade" mode="out-in">
				<component v-bind:is="component"></component>
			</transition>
		</component>
	</v-app>
</template>

<script>
import config from './configs';
import defaultLayout from './layouts/DefaultLayout';

export default {
	name: 'MainApp',

	components: {
		defaultLayout,
	},

	data: () => ({
		currentLayout: 'defaultLayout',
		component: null,
	}),

	head: {
		link: [
			// adds config/icons into the html head tag
			...config.icons.map(href => ({ rel: 'stylesheet', href })),
		],
	},

	created() {
		this.component = this.$component;
		this.lang = this.$lang;
	},

	mounted() {
		this.$store.commit('app/setAuthUser', { user: this.$user, vm: this });
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
