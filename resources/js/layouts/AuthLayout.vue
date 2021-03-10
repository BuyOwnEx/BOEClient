<template>
	<div
		class="auth-layout d-flex text-center flex-column flex-md-row flex-grow-1"
	>
		<div class="auth-layout__header">
			<ToolbarLanguage />
			<ToolbarThemeChanger />
		</div>

		<v-sheet
			class="layout-side mx-auto d-none d-md-flex flex-md-column justify-space-between"
			style="background: linear-gradient(5deg, rgba(26, 55, 122, 0.75) 0%, rgba(255, 255, 255, 0) 60%);"
		>
			<canvas class="waves" id="waves"></canvas>

			<div class="mt-3 mt-md-10 pa-2">
				<div class="display-2 font-weight-bold primary--text">
					{{ product.name }}
				</div>

				<div class="title my-2">be the future. be the crypto</div>

				<v-btn href="/" class="my-4" plain>Take me back</v-btn>
			</div>

			<div class="pa-2 mb-1">
				<v-img max-width="250" src="/images/logo_full.png" class="ma-auto" />
			</div>
		</v-sheet>

		<div
			class="pa-2 pa-md-4 flex-grow-1 align-center justify-center d-flex flex-column"
		>
			<div class="layout-content ma-auto w-full">
				<slot></slot>
			</div>
			<div class="overline mt-4">
				{{ product.name }} - {{ product.version }}
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import ToolbarThemeChanger from '../components/toolbar/ToolbarThemeChanger';
import ToolbarLanguage from '../components/toolbar/ToolbarLanguage';

export default {
	components: { ToolbarThemeChanger, ToolbarLanguage },

	data() {
		return {};
	},

	computed: {
		...mapState('app', ['product']),
	},

	methods: {},
};
</script>

<style scoped lang="scss">
.layout-side {
	width: 420px;
}

.layout-content {
	max-width: 480px;
}

.waves {
	width: 100%;
	max-height: 100%;
	position: absolute;
	top: 0;
	left: -2px;
	height: 100vh;
}

.auth-layout {
	background-color: #ababab21;
	&__header {
		position: absolute;
		top: 32px;
		right: 64px;
		bottom: 0;
		z-index: 1;
	}
}
</style>
