<template>
	<div class="d-flex flex-grow-1">
		<v-navigation-drawer
			v-if="isLogged"
			v-model="drawer"
			class="elevation-1"
			:right="$vuetify.rtl"
			:light="menuTheme === 'light'"
			:dark="menuTheme === 'dark'"
			app
			floating
			expand-on-hover
		>
			<template v-slot:prepend>
				<v-list-item style="padding: 0 4px;">
					<v-list-item-avatar height="48" min-width="48" width="48">
						<v-img src="/images/logo.png"></v-img>
					</v-list-item-avatar>

					<v-list-item-content>
						<v-list-item-title>{{ product.name }}</v-list-item-title>
						<v-list-item-subtitle>
							<small>{{ product.version }}</small>
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>

				<v-divider />
			</template>

			<MainMenu :menu="navigation.menu" />
		</v-navigation-drawer>

		<v-app-bar
			app
			:color="isToolbarDetached ? 'surface' : undefined"
			:flat="isToolbarDetached"
			:light="toolbarTheme === 'light'"
			:dark="toolbarTheme === 'dark'"
		>
			<v-card
				class="flex-grow-1 d-flex"
				maxHeight="56"
				:class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']"
				:flat="!isToolbarDetached"
			>
				<div class="d-flex flex-grow-1 align-center">
					<div class="d-flex flex-grow-1 align-center">
						<v-app-bar-nav-icon
							v-if="isLogged"
							@click.stop="drawer = !drawer"
						/>
						<v-list-item v-if="!isLogged" style="padding: 0 4px;">
							<v-list-item-avatar height="48" min-width="48" width="48">
								<v-img src="/images/logo.png" />
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title>
									{{ product.name }}
								</v-list-item-title>
								<v-list-item-subtitle>
									<small>
										{{ product.version }}
									</small>
								</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>

						<v-spacer class="d-none d-lg-block" />
						<v-spacer class="d-block" />

						<ToolbarThemeChanger />

						<ToolbarLanguage />

						<div class="hidden-xs-only mx-1">
							<ToolbarCurrency />
						</div>

						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">
							<ToolbarApps />
						</div>

						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-if="isLogged">
							<ToolbarNotifications />
						</div>

						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-if="!isLogged">
							<v-btn depressed :href="'/login'">Login</v-btn>
						</div>

						<div v-if="isLogged">
							<ToolbarUser />
						</div>

						<div v-else>
							<v-btn tile color="primary" dark>Register</v-btn>
						</div>
					</div>
				</div>
			</v-card>
		</v-app-bar>

		<v-main class="main">
			<v-container class="fill-height" :fluid="!isContentBoxed">
				<v-layout>
					<slot></slot>
				</v-layout>
			</v-container>
		</v-main>

		<v-footer class="footer overline" :height="calculateFooterHeight" inset app>
			<span>
				<a class="text-decoration-none pr-1" href="/status">
					Состояние системы
				</a>

				<a class="text-decoration-none pr-1" href="/fees">
					Комиссии и лимиты
				</a>

				<a
					v-if="isWidthMore400px"
					class="text-decoration-none pr-1"
					href="/contacts"
				>
					Контакты
				</a>

				<a class="text-decoration-none pr-1" href="/overview">
					Обзор рынка
				</a>

				<a
					v-if="isWidthMore400px"
					class="text-decoration-none pr-1"
					href="/api"
				>
					API
				</a>

				<a
					v-if="isWidthMore400px"
					class="text-decoration-none pr-1"
					href="/terms"
				>
					Правила системы
				</a>

				<a
					v-if="isWidthMore400px"
					class="text-decoration-none pr-1"
					href="/policy"
				>
					Политика конфиденциальности
				</a>
			</span>

			<span>
				Copyright © BuyOwnEx Ltd. 2017 - {{ new Date().getFullYear() }}. All
				rights reserved
			</span>
		</v-footer>

		<CommonNotification />
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import config from '../configs';

import MainMenu from '../components/navigation/MainMenu';
import ToolbarUser from '../components/toolbar/ToolbarUser';
import ToolbarApps from '../components/toolbar/ToolbarApps';
import ToolbarLanguage from '../components/toolbar/ToolbarLanguage';
import ToolbarCurrency from '../components/toolbar/ToolbarCurrency';
import ToolbarNotifications from '../components/toolbar/ToolbarNotifications';
import ToolbarThemeChanger from '../components/toolbar/ToolbarThemeChanger';
import CommonNotification from '../components/common/CommonNotification';

export default {
	components: {
		MainMenu,
		ToolbarUser,
		ToolbarApps,
		ToolbarLanguage,
		ToolbarCurrency,
		ToolbarNotifications,
		ToolbarThemeChanger,
		CommonNotification,
	},
	data() {
		return {
			drawer: null,
			isDarkTheme: true,
		};
	},
	computed: {
		...mapState('app', [
			'product',
			'isContentBoxed',
			'menuTheme',
			'toolbarTheme',
			'isToolbarDetached',
			'trader',
		]),
		...mapGetters('app', ['isLogged']),

		navigation() {
			return this.isLogged ? config.navigation : config.guest_navigation;
		},

		calculateFooterHeight() {
			const width = this.$vuetify.breakpoint.width;
			const isMediumBreakpoint = width < 1264 && width > 960;
			const isMobile = this.$vuetify.breakpoint.smAndDown;

			if (isMediumBreakpoint) return 40;
			else if (isMobile) return 58;
			else return 29;
		},
		isWidthMore400px() {
			return this.$vuetify.breakpoint.width >= 400;
		},
	},

	mounted() {
		this.$store.dispatch('snackbar/showMessage', {
			text: 'Test Text Snackbar',
		});
	},
};
</script>

<style scoped>
.buy-button {
	box-shadow: 1px 1px 18px #ee44aa;
}
.container {
	padding: 5px;
}

.footer {
	display: flex;
	justify-content: space-between;
	font-size: 9px !important;
	letter-spacing: 1px !important;
	-webkit-transform: translateZ(0);
}
@media screen and (max-width: 960px) {
	.main {
		padding-bottom: 105px !important;
	}
}
@media screen and (max-width: 600px) {
	.footer {
		font-size: 8px !important;
	}
}
</style>
