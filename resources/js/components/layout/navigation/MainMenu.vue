<template>
	<v-list nav dense>
		<nav-menu :menu="filteredNavItems" />
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
					link: '/',
				},
				{
					icon: 'mdi-home',
					key: 'menu.overview',
					text: 'Market overview',
					link: '/overview',
				},
				{
					icon: 'mdi-autorenew',
					key: 'menu.transactions',
					text: 'Transactions',
					link: '/transactions',
				},
				{
					icon: 'mdi-cached',
					key: 'menu.fiat_transactions',
					text: 'Transactions (fiat)',
					link: '/fiat_transactions',
				},
				{
					icon: 'mdi-swap-horizontal',
					key: 'menu.transfers',
					text: 'Transfers',
					link: '/transfers',
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
					icon: 'mdi-information-outline',
					key: 'menu.notifications',
					text: 'Notifications',
					link: '/notifications',
				},
			],
		};
	},

	computed: {
    ...mapState('trading', ['all_currencies','allCurrencyListInit']),
    ...mapState('app', ['product']),
		filteredNavItems() {
			if((this.all_currencies?.filter(c => c.type === 'fiat')?.length || 0) > 0)
      {
        if(!this.product.enabledSupport)
          return this.items.filter(item => item.key !== 'menu.support');
        else return this.items;
      }
			else
      {
        if(!this.product.enabledSupport)
				  return this.items.filter(item => (item.key !== 'menu.fiat_transactions' && item.key !== 'menu.support'));
        else return this.items.filter(item => item.key !== 'menu.fiat_transactions');
			}
		},
    hasCurrencies() {
      return this.allCurrencyListInit;
    },
	},
  mounted() {
    if(!this.hasCurrencies)
      this.$store.dispatch('trading/getAllCurrencyListFromServer');
  },
};
</script>
