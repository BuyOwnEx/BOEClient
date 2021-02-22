<template>
	<div class='d-flex flex-grow-1'>
		<!-- Navigation -->
		<v-navigation-drawer
			v-if='isLogged'
			v-model='drawer'
			app
			floating
			expand-on-hover
			class='elevation-1'
			:right='$vuetify.rtl'
			:light="menuTheme === 'light'"
			:dark="menuTheme === 'dark'"
		>
			<!-- Navigation menu info -->
			<template v-slot:prepend>
				<v-list-item style='padding: 0 4px;'>
					<v-list-item-avatar height='48' min-width='48' width='48'>
						<v-img src='/images/logo.png'></v-img>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title>{{ product.name }}</v-list-item-title>
						<v-list-item-subtitle
						><small>{{ product.version }}</small></v-list-item-subtitle
						>
					</v-list-item-content>
				</v-list-item>
				<v-divider></v-divider>
			</template>

			<!-- Navigation menu -->
			<main-menu :menu='navigation.menu' />

			<!-- Navigation menu footer -->
			<template v-slot:append>
				<!-- Footer navigation links -->
				<div class='pa-1 text-center'>
					<v-btn
						v-for='(item, index) in navigation.footer'
						:key='index'
						:href='item.href'
						:target='item.target'
						small
						text
					>
						{{ item.key ? $t(item.key) : item.text }}
					</v-btn>
				</div>
			</template>
		</v-navigation-drawer>

		<!-- Toolbar -->
		<v-app-bar
			app
			:color="isToolbarDetached ? 'surface' : undefined"
			:flat='isToolbarDetached'
			:light="toolbarTheme === 'light'"
			:dark="toolbarTheme === 'dark'"
		>
			<v-card
				class='flex-grow-1 d-flex'
				maxHeight='56'
				:class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']"
				:flat='!isToolbarDetached'
			>
				<div class='d-flex flex-grow-1 align-center'>
					<div class='d-flex flex-grow-1 align-center'>
						<v-app-bar-nav-icon
							v-if='isLogged'
							@click.stop='drawer = !drawer'
						></v-app-bar-nav-icon>
						<v-list-item v-if='!isLogged' style='padding: 0 4px;'>
							<v-list-item-avatar height='48' min-width='48' width='48'>
								<v-img src='/images/logo.png'></v-img>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title>{{ product.name }}</v-list-item-title>
								<v-list-item-subtitle
								><small>{{ product.version }}</small></v-list-item-subtitle
								>
							</v-list-item-content>
						</v-list-item>
						<v-spacer class='d-none d-lg-block'></v-spacer>

						<v-spacer class='d-block'></v-spacer>

						<v-switch
							class='d-block'
							:class="[$vuetify.rtl ? 'ml-1' : 'mr-1']"
							v-model='theme'
							dense
							flat
							hide-details
							:label="`${theme === true ? 'dark' : 'light'}`"
						></v-switch>

						<toolbar-language />

						<div class='hidden-xs-only mx-1'>
							<toolbar-currency />
						</div>

						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">
							<toolbar-apps />
						</div>

						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-if='isLogged'>
							<toolbar-notifications />
						</div>

						<div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-if='!isLogged'>
							<v-btn depressed :href="'/login'">Login</v-btn>
						</div>

						<div v-if='isLogged'>
							<toolbar-user />
						</div>

						<div v-else>
							<v-btn tile color='primary' dark>Register</v-btn>
						</div>
					</div>
				</div>
			</v-card>
		</v-app-bar>

		<v-main>
			<v-container class='fill-height' :fluid='!isContentBoxed'>
				<v-layout>
					<slot></slot>
				</v-layout>
			</v-container>

			<v-footer app inset height='29'>
				<v-spacer></v-spacer>
				<div class='overline'>
					Built with
					<v-icon small color='pink'>mdi-heart</v-icon>
					<a
						class='text-decoration-none'
						href='https://indielayer.com'
						target='_blank'
					>@indielayer</a
					>
				</div>
			</v-footer>
		</v-main>
	</div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';

// navigation menu configurations
import config from '../configs';

import MainMenu from '../components/navigation/MainMenu';
import ToolbarUser from '../components/toolbar/ToolbarUser';
import ToolbarApps from '../components/toolbar/ToolbarApps';
import ToolbarLanguage from '../components/toolbar/ToolbarLanguage';
import ToolbarCurrency from '../components/toolbar/ToolbarCurrency';
import ToolbarNotifications from '../components/toolbar/ToolbarNotifications';

export default {
	components: {
		MainMenu,
		ToolbarUser,
		ToolbarApps,
		ToolbarLanguage,
		ToolbarCurrency,
		ToolbarNotifications,
	},
	data() {
		return {
			drawer: null,
			theme: 0,
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
	},
	watch: {
		theme(val) {
			this.setGlobalTheme(val === false ? 'light' : 'dark');
		},
	},
	methods: {
		...mapMutations('app', ['setGlobalTheme']),
		setTheme() {
			this.$vuetify.theme.dark = this.theme === 'dark';
		},
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
</style>
