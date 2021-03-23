<template>
	<div class="auth-layout flex-md-row ">
		<div class="auth-layout__header">
			<ToolbarLanguage class="auth-layout__lang" />
			<ToolbarThemeChanger
				class="auth-layout__theme mr-md-0 ml-md-0"
				:class="[$vuetify.rtl ? 'mr-1' : 'ml-1']"
			/>
		</div>

		<v-sheet
			class="auth-layout__side mx-auto d-none d-md-flex flex-md-column justify-space-between"
		>
			<canvas class="waves" id="waves"></canvas>

			<div class="auth-layout__side-top mt-3 mt-md-1 pa-2">
				<a href="/">
					<v-img
						min-height="103"
						max-width="250"
						src="/images/logo_full.png"
						class="ma-auto"
					/>
				</a>

				<div class="auth-layout__slogan title my-2 white--text">
					{{ product.slogan }}
				</div>
			</div>

			<div class="auth-layout__links overline pa-1 mb-1">
				<span>
					<a class="white--text" href="/">Торговля</a>
					<a class="white--text" href="/fees">
						Комиссии и лимиты
					</a>
					<a class="white--text" href="/status">
						Состояние системы
					</a>
					<a class="white--text" href="/api">API</a>
				</span>
			</div>
		</v-sheet>

		<div
			class="pa-2 pa-md-4 flex-grow-1 align-center justify-center d-flex flex-column"
		>
			<div class="layout-content ma-auto w-full">
				<slot></slot>
			</div>

			<div class="overline mt-4">
				<div
					v-if="$vuetify.breakpoint.smAndDown"
					class="auth-layout__links mb-1"
				>
					<a href="/"> Торговля</a>
					<a href="/fees">
						Комиссии и лимиты
					</a>
					<a href="/status">
						Состояние системы
					</a>
					<a href="/api">API</a>
				</div>

				<div>{{ product.name }} - {{ product.version }}</div>
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
		right: 32px;
		z-index: 1;
	}
	&__side {
		width: 420px;
		background: rgba(0, 0, 0, 0)
			linear-gradient(5deg, rgb(20, 47, 109) 0%, rgb(9, 28, 72) 40%) repeat
			scroll 0% 0%;
	}
	&__slogan {
		z-index: 1;
	}
	&__links {
		z-index: 1;
		a {
			text-decoration: none;
			color: unset;
			margin-right: 8px;
		}
	}
}

.v-application--is-rtl .auth-layout {
	&__header {
		text-align: left;
		left: 32px;
		right: unset;
	}
}

.theme--dark .auth-layout {
	background-color: #222;
	&__side {
		background: rgba(0, 0, 0, 0)
			linear-gradient(
				5deg,
				rgba(3, 164, 194, 0.55) 0%,
				rgba(255, 255, 255, 0) 60%
			)
			repeat scroll 0 0;
	}
}

@media screen and (max-width: 960px) {
	.auth-layout {
		&__header {
			top: 16px;
			right: 8px;
		}
	}
	.v-application--is-rtl .auth-layout {
		&__header {
			left: 8px;
		}
	}
}
</style>
