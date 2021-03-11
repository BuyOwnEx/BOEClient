<template>
	<div class="auth-layout flex-md-row ">
		<div class="auth-layout__header">
			<ToolbarLanguage class="auth-layout__lang" />
			<ToolbarThemeChanger class="auth-layout__theme ml-1 ml-md-0" />
		</div>

		<v-sheet
			class="auth-layout__side mx-auto d-none d-md-flex flex-md-column justify-space-between"
		>
			<canvas class="waves" id="waves"></canvas>

			<div class="auth-layout__side-top mt-3 mt-md-1 pa-2">
				<div
					class="auth-layout__company display-2 font-weight-bold primary--text"
				>
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
	display: flex;
	flex-flow: column;
	flex-grow: 1;
	text-align: center;

	&__header {
		position: absolute;
		top: 32px;
		right: 64px;
		bottom: 64px;
		z-index: 1;
	}
	&__side {
		width: 420px;
		background: rgba(0, 0, 0, 0)
			linear-gradient(
				5deg,
				rgba(3, 164, 194, 0.55) 0%,
				rgba(255, 255, 255, 0) 60%
			)
			repeat scroll 0 0;
	}
	&__company {
		color: rgba(3, 164, 194, 0.65) !important;
	}
}
.theme--dark .auth-layout {
	background-color: #222;
}
@media screen and (max-width: 960px) {
	.auth-layout {
		&__header {
			top: 16px;
			right: 8px;
		}
	}
}
</style>
