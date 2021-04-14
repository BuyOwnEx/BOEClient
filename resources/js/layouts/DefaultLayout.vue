<template>
	<div class="d-flex flex-grow-1">
		<v-navigation-drawer
			v-if="isLogged"
			v-model="drawer"
			class="elevation-1"
			:right="$vuetify.rtl"
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

			<MainMenu :user-fiat="isUserFiat" />
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
				<a class="footer__link" href="/status">
					Состояние системы
				</a>

				<a class="footer__link" href="/fees">
					Комиссии и лимиты
				</a>

				<a v-if="isWidthMore400px" class="footer__link" href="/contacts">
					Контакты
				</a>

				<a class="footer__link" href="/overview">
					Обзор рынка
				</a>

				<a v-if="isWidthMore400px" class="footer__link" href="/api">
					API
				</a>

				<a v-if="isWidthMore400px" class="footer__link" href="/terms">
					Правила системы
				</a>

				<a v-if="isWidthMore400px" class="footer__link" href="/policy">
					Политика конфиденциальности
				</a>
			</span>

			<span>
				Copyright © BuyOwnEx Ltd. 2017 - {{ new Date().getFullYear() }}. All
				rights reserved
			</span>
		</v-footer>

		<CommonNotification />
		<CommonSnackbar />
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import MainMenu from '../components/layout/navigation/MainMenu';
import ToolbarUser from '../components/layout/toolbar/ToolbarUser';
import ToolbarApps from '../components/layout/toolbar/ToolbarApps';
import ToolbarLanguage from '../components/layout/toolbar/ToolbarLanguage';
import ToolbarCurrency from '../components/layout/toolbar/ToolbarCurrency';
import ToolbarNotifications from '../components/layout/toolbar/ToolbarNotifications';
import ToolbarThemeChanger from '../components/layout/toolbar/ToolbarThemeChanger';
import CommonNotification from '../components/common/CommonNotification';
import CommonSnackbar from '../components/common/CommonSnackbar';

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
		CommonSnackbar,
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
		...mapGetters({
			isLogged: 'app/isLogged',
			isUserFiat: 'user/isUserFiat',
		}),

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
};
</script>

<style lang="scss" scoped>
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
	&__link {
		text-decoration: none;
		padding-right: 8px;
	}
}

.v-application--is-rtl {
	.footer__link {
		padding-right: 0;
		padding-left: 8px;
	}
}

@media screen and (max-width: 600px) {
	.footer {
		font-size: 8px !important;
	}
}
</style>
