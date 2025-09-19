<template>
	<v-list nav dense>
		<nav-menu v-if="blockStatus !== null" :menu="filteredNavItems" />
	</v-list>
</template>

<script>
import { mapState } from 'vuex';
import NavMenu from '@/components/layout/navigation/NavMenu.vue';

export default {
	name: 'MainMenu',

	components: {
		NavMenu,
	},

	data() {
		return {
			items: [
				{
					icon: 'mdi-finance',
					key: 'menu.trading',
					text: 'Trading',
					link: '/trading',
				},
        {
          icon: 'mdi-swap-horizontal',
          key: 'menu.exchange',
          text: 'Exchange',
          link: '/exchange',
        },
        {
          icon: 'mdi-human-greeting-proximity',
          key: 'menu.exchange_history',
          text: 'Exchange history',
          link: '/exchange_history',
        },
				{
					icon: 'mdi-home',
					key: 'menu.overview',
					text: 'Market overview',
					link: '/overview',
				},
				{
					icon: 'mdi-file-document-outline',
					key: 'menu.orders',
					text: 'Orders',
					link: '/orders',
				},
				{
					icon: 'mdi-checkbox-marked-outline',
					key: 'menu.deals',
					text: 'Deals',
					link: '/deals',
				},
				{
					icon: 'mdi-currency-usd',
					key: 'menu.balance',
					text: 'Balance',
					link: '/balance',
				},
				{
					icon: 'mdi-account-cash',
					key: 'menu.refs',
					text: 'Referral payments',
					link: '/ref_payments',
				},
				{
					icon: 'mdi-message-outline',
					key: 'menu.support',
					text: 'Support',
					link: '/support',
				},
				{
					icon: 'mdi-cogs',
					key: 'menu.profile',
					text: 'Profile',
					link: '/profile',
				},
        {
          icon: 'mdi-history',
          key: 'menu.history',
          text: 'History',
          link: '/history',
        },
				{
					icon: 'mdi-information-outline',
					key: 'menu.notifications',
					text: 'Notifications',
					link: '/notifications',
				},
			],
		};
	},

	computed: {
    ...mapState('app', ['product']),
    ...mapState('user', ['blockStatus']),
    isHideTrading() {
      return (this.blockStatus & 8) > 0
    },
    isOTCEnabled() {
      return this.product.enabledOTC
    },
		filteredNavItems() {
      let filtered = this.items;
      if(!this.product.enabledSupport)
        filtered = _.omitBy(filtered, function(item) { return item.key === 'menu.support'; });
      if(!this.product.authedShowMarkets || this.isHideTrading)
        filtered = _.omitBy(filtered, function(item) { return item.key === 'menu.overview'; });
      if(this.isHideTrading)
        filtered = _.omitBy(filtered, function(item) { return item.key === 'menu.trading'; });
      if(!this.isOTCEnabled)
        filtered = _.omitBy(filtered, function(item) { return item.key === 'menu.exchange_history'; });
      if(!this.isOTCEnabled)
        filtered = _.omitBy(filtered, function(item) { return item.key === 'menu.exchange'; });
      if(this.isHideTrading)
        filtered = _.omitBy(filtered, function(item) { return item.key === 'menu.orders'; });
      if(this.isHideTrading)
        filtered = _.omitBy(filtered, function(item) { return item.key === 'menu.deals'; });
      if(this.isHideTrading || !this.product.enabledReferral)
        filtered = _.omitBy(filtered, function(item) { return item.key === 'menu.refs'; });
      return filtered;
		},
	},
};
</script>
