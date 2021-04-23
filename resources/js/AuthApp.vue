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
import authLayout from './layouts/AuthLayout';

export default {
	name: 'AuthApp',

	components: {
		authLayout,
	},

	data: () => ({
		currentLayout: 'authLayout',
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
};
</script>
