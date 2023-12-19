<template>
	<div class="d-flex flex-grow-1">
		<v-navigation-drawer
			v-if="isLogged"
			v-model="drawer"
			class="elevation-1"
			:right="$vuetify.rtl"
			app
			floating
            :mini-variant.sync="mini"
		>
			<template #prepend>
				<v-list-item class="sidebar-header">
					<v-list-item-avatar height="48" min-width="48" width="48">
						<v-img contain :src="Logo"></v-img>
					</v-list-item-avatar>

					<v-list-item-content>
						<v-list-item-title>{{ product.name }}</v-list-item-title>
						<v-list-item-subtitle>
							<small>{{ product.version }}</small>
						</v-list-item-subtitle>
					</v-list-item-content>

                    <v-btn icon @click.stop="mini = !mini">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
				</v-list-item>

				<v-divider />
			</template>

			<MainMenu />
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
						<v-app-bar-nav-icon v-if="isLogged" @click.stop="drawer = !drawer" />
						<v-list-item v-if="!isLogged" style="padding: 0 4px;">
							<v-list-item-avatar height="48" min-width="48" width="48" >
								<v-img contain :src="Logo" />
							</v-list-item-avatar>

							<v-list-item-content class="product-name-version">
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

						<div v-if="product.showCurrencies" class="hidden-xs-only mx-1">
							<ToolbarCurrency />
						</div>

						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">
							<ToolbarApps />
						</div>

						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-if="isLogged">
							<ToolbarNotifications />
						</div>

						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-if="!isLogged">
							<v-btn href="/login" :to="this.$spa ? '/login' : null" tile>{{ $t('menu.login') }}</v-btn>
						</div>

						<div v-if="isLogged">
							<ToolbarUser />
						</div>

						<div v-else>
							<v-btn color="primary" href="/register" :to="this.$spa ? '/register' : null" tile dark>{{ $t('menu.register') }}</v-btn>
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

                <Link class="footer__link" path="/status">{{ $t('status.title') }}</Link>
                <Link class="footer__link" path="/fees">{{ $t('fees.title') }}</Link>
                <Link v-if="isWidthMore400px" class="footer__link" path="/contacts">{{ $t('menu.contacts') }}</Link>
                <Link class="footer__link" path="/overview">{{ $t('menu.overview') }}</Link>
                <Link v-if="isWidthMore400px" class="footer__link" path="/api">{{ $t('menu.api') }}</Link>
                <Link v-if="isWidthMore400px" class="footer__link" path="/terms">{{ $t('docs.terms.title') }}</Link>
                <Link v-if="isWidthMore400px" class="footer__link" path="/policy">{{ $t('docs.policy.title') }}</Link>
			</span>

			<span> Copyright © {{ product.name }} Ltd. 2017 - {{ new Date().getFullYear() }}. All rights reserved </span>
		</v-footer>

		<CommonNotification />
		<CommonSnackbar />
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import Logo from '@/assets/images/logo.png';
import MainMenu from '@/components/layout/navigation/MainMenu.vue';
import ToolbarUser from '@/components/layout/toolbar/ToolbarUser.vue';
import ToolbarApps from '@/components/layout/toolbar/ToolbarApps.vue';
import ToolbarLanguage from '@/components/layout/toolbar/ToolbarLanguage.vue';
import ToolbarCurrency from '@/components/layout/toolbar/ToolbarCurrency.vue';
import ToolbarNotifications from '@/components/layout/toolbar/ToolbarNotifications.vue';
import ToolbarThemeChanger from '@/components/layout/toolbar/ToolbarThemeChanger.vue';
import CommonNotification from '@/components/common/CommonNotification.vue';
import CommonSnackbar from '@/components/common/CommonSnackbar.vue';
import Link from "@/components/common/Link.vue";

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
        Link
	},

	data() {
		return {
            Logo,
			drawer: null,
			isDarkTheme: true,
            mini: true,
		};
	},

	computed: {
		...mapState('app', ['product', 'isContentBoxed', 'menuTheme', 'toolbarTheme', 'isToolbarDetached', 'trader']),
		...mapState('notifications', ['notifications']),
		...mapGetters({
			isLogged: 'app/isLogged',
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

	created() {
		this.$eventHub.$on('set-user', this.getNotifications);
	},

	methods: {
		...mapActions({
			fetchNotificationsStore: 'notifications/fetchNotifications',
		}),
		getNotifications() {
			if (!this.notifications && this.isLogged) this.fetchNotificationsStore();
		}
	},
};
</script>

<style lang="scss" scoped>
.container {
	padding: 5px;
}

.sidebar-header {
	padding: 0 4px;
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

@media screen and (max-width: 599px) {
	.footer {
		font-size: 8px !important;
	}
}

@media screen and (max-width: 540px) {
	.product-name-version {
		display: none;
	}
	.v-application--is-ltr {
		.v-list-item__avatar:first-child {
			margin-right: 10px !important;
		}
	}
	.v-application--is-rtl {
		.v-list-item__avatar:first-child {
			margin-left: 10px !important;
		}
	}
}
</style>
