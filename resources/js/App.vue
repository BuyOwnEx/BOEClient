<template>
	<v-app>
		<component :is="this.$route.meta.layout" v-if="isRouterLoaded">
			<transition name="fade" mode="out-in">
				<router-view />
			</transition>
		</component>
	</v-app>
</template>

<script>

import config from './configs';

export default {
	computed: {
		isRouterLoaded: function() {
			return this.$route.name !== null;
		},
	},
	head: {
		link: [
			// adds config/icons into the html head tag
			...config.icons.map(href => ({ rel: 'stylesheet', href })),
		]
	},
    /*watch: {
        $route: {
            immediate: true,
            handler(to, from) {
                if(to.name === 'login')
                {
                  if(this.$user) this.$router.push('/'+import.meta.env.VITE_CONFIG_START_AUTHED_PAGE);
                }
                if(to.name === 'trading')
                {
                    document.title = config.product.name + ' - ' + this.$trading_currency + '/' + this.$trading_market;
                    if(this.$trading_currency !== to.params.currency || this.$trading_market !== to.params.market)
                    {
                        this.$router.push('/');
                    }
                }
                else
                    document.title = config.product.name + ' - ' + this.$t(to.meta.title) || config.product.name;
            }
        },
    },*/
    mounted() {
        //this.$store.commit('app/setAuthUser', { user: this.$user, vm: this });
        this.$store.commit('app/setConfig', { config: this.$config, vm: this });
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
