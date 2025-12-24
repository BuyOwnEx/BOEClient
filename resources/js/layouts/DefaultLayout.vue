<template>
	<div class="d-flex flex-grow-1">
		<v-navigation-drawer
			v-if="isLogged"
			v-model="drawer"
			class="elevation-1"
			:right="$vuetify.rtl"
			app
      expand-on-hover
			floating
      :mini-variant="mini"
		>
			<template #prepend>
				<v-list-item class="sidebar-header">
					<v-list-item-avatar height="48" min-width="48" width="48">
            <Link path="/" class="logo_link"><v-img contain :src="Logo" /></Link>
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
      <MainMenuV1 v-if="menu_version === 'v1'" />
      <MainMenuV2 v-else />
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
                <Link path="/" class="logo_link"><v-img contain :src="Logo" /></Link>
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
						<ToolbarLanguage :show-label="false" />
						<div v-if="product.showCurrencies" class="hidden-xs-only mx-1">
							<ToolbarCurrency />
						</div>
						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-if="is_show_toolbar_app">
							<ToolbarApps :is-show-trading="is_show_trading" :is-otc-enabled="isOTCEnabled" />
						</div>
						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-if="isLogged">
							<ToolbarNotifications />
						</div>
            <div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-if="isLogged && is_show_telegram_support">
              <v-btn icon :href="support_telegram_link"><v-icon>mdi-headset</v-icon></v-btn>
            </div>
						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-if="!isLogged && isWidthMore450px">
							<v-btn href="/login" :to="'/login'" tile>{{ $t('menu.login') }}</v-btn>
						</div>
            <div v-else-if="!isLogged && !isWidthMore450px">
              <Link path="/login"><v-icon>mdi-login</v-icon></Link>
            </div>
						<div v-if="isLogged">
							<ToolbarUser />
						</div>
						<div v-else>
							<v-btn v-if="!isLogged && isWidthMore450px" color="primary" href="/register" :to="'/register'" tile dark>{{ $t('menu.register') }}</v-btn>
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
			<span v-if="!isLogged || (isLogged && blockStatus !== null)">
        <Link v-if="is_show_status_page" class="footer__link" path="/status">{{ $t('status.title') }}</Link>
        <Link v-if="is_show_fees_page" class="footer__link" path="/fees">{{ $t('fees.title') }}</Link>
        <Link v-if="isWidthMore400px && is_show_contacts" class="footer__link" path="/contacts">{{ $t('menu.contacts') }}</Link>
        <Link v-if="is_show_markets" class="footer__link" path="/overview">{{ $t('menu.overview') }}</Link>
        <Link v-if="isWidthMore400px && is_show_api_page" class="footer__link" path="/api">{{ $t('menu.api') }}</Link>
        <Link v-if="isWidthMore400px && is_show_knowledge_page" class="footer__link" path="/knowledge">{{ $t('docs.knowledge.title') }}</Link>
        <Link v-if="isWidthMore400px" class="footer__link" path="/terms">{{ $t('docs.terms.title') }}</Link>
        <Link v-if="isWidthMore400px" class="footer__link" path="/policy">{{ $t('docs.policy.title') }}</Link>
			</span>
			<span> {{ product.copyright }} {{ product.copy_start_year }} - {{ new Date().getFullYear() }}. {{ product.all_rights_text }} </span>
		</v-footer>
		<CommonNotification />
		<CommonSnackbar />
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import Logo from '@/assets/images/logo.png';
import MainMenuV1 from '@/components/layout/navigation/v1/MainMenu.vue';
import MainMenuV2 from '@/components/layout/navigation/v2/MainMenu.vue';
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
    MainMenuV1,
    MainMenuV2,
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
      isLoading: true,
		};
	},
	computed: {
		...mapState('app', ['product', 'isContentBoxed', 'menuTheme', 'toolbarTheme', 'isToolbarDetached', 'trader']),
    ...mapState('user', ['blockStatus','verifyStatus','status']),
		...mapState('notifications', ['notifications']),
		...mapGetters({
			isLogged: 'app/isLogged',
		}),
    menu_version() {
      return import.meta.env.VITE_MENU_VERSION === 'v2' ? 'v2' : 'v1'
    },
    is_show_telegram_support() {
      return this.product.showTelegramSupport
    },
    support_telegram_link() {
      return this.product.telegramSupportLink
    },
    is_show_trading() {
      return (this.isLogged && !this.isHideTrading) || (!this.isLogged && this.product.guestShowTrading)
    },
    is_show_toolbar_app() {
      return this.is_show_trading || this.isOTCEnabled
    },
    is_show_status_page() {
      return (this.isLogged && this.product.authedShowStatusPage) || (!this.isLogged && this.product.guestShowStatusPage)
    },
    is_show_fees_page() {
      return (this.isLogged && this.product.authedShowFeesPage) || (!this.isLogged && this.product.guestShowFeesPage)
    },
    is_show_contacts() {
      return (this.isLogged && this.product.authedShowContacts) || (!this.isLogged && this.product.guestShowContacts)
    },
    is_show_api_page() {
      return (this.isLogged && this.product.authedShowAPIPage && !this.isHideTrading) || (!this.isLogged && this.product.guestShowAPIPage)
    },
    is_show_knowledge_page() {
      return (this.isLogged && this.product.authedShowKnowledgePage) || (!this.isLogged && this.product.guestShowKnowledgePage)
    },
    is_show_markets() {
      return (this.isLogged && this.product.authedShowMarkets && !this.isHideTrading) || (!this.isLogged && this.product.guestShowMarkets)
    },
    isHideTrading() {
      return (this.blockStatus & 8) > 0
    },
    isOTCEnabled() {
      return this.product.enabledOTC
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
    isWidthMore450px() {
      return this.$vuetify.breakpoint.width >= 450;
    },
	},
  async created() {
    if(this.isLogged)
      await Promise.all([
        this.getBlockStatusStore(),
        this.getVerificationStatusStore(),
        this.getStatusStore(),
        this.fetchNotificationsStore(),
        this.getAllCurrencies()
      ]);
    else
      await Promise.all([
        this.getAllCurrencies()
      ]);
    this.isLoading = false;
  },
  methods: {
		...mapActions({
			fetchNotificationsStore: 'notifications/fetchNotifications',
      getBlockStatusStore: 'user/getBlockStatus',
      getVerificationStatusStore: 'user/getVerifyStatus',
      getStatusStore: 'user/getStatus',
      getAllCurrencies: 'trading/getAllCurrencyListFromServer'
		}),
	},
};
</script>

<style lang="scss" scoped>
.logo_link {
  width: 48px;
  height: 48px;
  min-width: 48px;
}
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
