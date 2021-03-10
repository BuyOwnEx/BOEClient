<template>
	<v-app>
		<component :is="currentLayout">
			<transition name="fade" mode="out-in">
				<trading />
			</transition>
		</component>
	</v-app>
</template>

<script>
import config from './configs';

import defaultLayout from './layouts/DefaultLayout';
import Trading from './pages/trading/Trading';

import CustomizationMenu from './components/demo/CustomizationMenu';

export default {
	name: 'TradingApp',
	components: {
		Trading,
		CustomizationMenu,
		defaultLayout,
	},
	data: () => ({
		currentLayout: 'defaultLayout',
	}),
	head: {
		link: [
			// adds config/icons into the html head tag
			...config.icons.map(href => ({ rel: 'stylesheet', href })),
		],
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
