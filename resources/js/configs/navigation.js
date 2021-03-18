import menuApps from './menus/apps.menu';
import menuPages from './menus/pages.menu';

export default {
	// main navigation - side menu
	menu: [{
		text: '',
		key: '',
		items: [
			{ icon: 'mdi-view-dashboard-outline', key: 'menu.dashboard', text: 'Dashboard', link: '/dashboard' },
			{ icon: 'mdi-finance', key: 'menu.trading', text: 'Trading', link: '/' },
			{ icon: 'mdi-home', key: 'menu.overview', text: 'Market overview', link: '/overview' },
			{ icon: 'mdi-autorenew', key: 'menu.transactions', text: 'Transactions', link: '/transactions' },
			{
				icon: 'mdi-cached',
				key: 'menu.fiat_transactions',
				text: 'Transactions (fiat)',
				link: '/fiat_transactions',
			},
			{ icon: 'mdi-swap-horizontal', key: 'menu.transfers', text: 'Transfers', link: '/transfers' },
			/*{ icon: 'mdi-poll', key: 'menu.offers', text: 'Margin offers', link: '/offers' },*/
			{ icon: 'mdi-file-document-outline', key: 'menu.orders', text: 'Orders', link: '/orders' },
			{ icon: 'mdi-checkbox-marked-outline', key: 'menu.deals', text: 'Deals', link: '/deals' },
			{ icon: 'mdi-currency-usd', key: 'menu.balance', text: 'Balance', link: '/balance' },
			{ icon: 'mdi-account-cash', key: 'menu.refs', text: 'Referral payments', link: '/ref_payments' },
			{ icon: 'mdi-message-outline', key: 'menu.support', text: 'Support', link: '/support' },
			{ icon: 'mdi-cogs', key: 'menu.profile', text: 'Profile', link: '/profile' },
			{ icon: 'mdi-information-outline', key: 'menu.notifications', text: 'Notifications', link: '/notifications' },
		],
	}/*, {
    text: 'Apps',
    items: menuApps
  }, {
    text: 'Landing Pages',
    items: [
      { icon: 'mdi-airplane-landing', key: 'menu.landingPage', text: 'Landing Page', link: '/landing' },
      { icon: 'mdi-cash-usd-outline', key: 'menu.pricingPage', text: 'Pricing Page', link: '/landing/pricing' }
    ]
  }, {
    text: 'Pages',
    key: 'menu.pages',
    items: menuPages
  }, {
    text: 'Other',
    key: 'menu.others',
    items: [
      { icon: 'mdi-file-outline', key: 'menu.blank', text: 'Blank Page', link: '/blank' },
      { key: 'menu.levels', text: 'Menu Levels',
        items: [
          { text: 'Menu Levels 2.1' },
          { text: 'Menu Levels 2.2',
            items: [
              { text: 'Menu Levels 3.1' },
              { text: 'Menu Levels 3.2' }
            ]
          }
        ]
      },
      { key: 'menu.disabled', text: 'Menu Disabled', disabled: true }
    ]
  }*/],
	/*
			// footer links
			footer: [{
					text: 'Docs',
					key: 'menu.docs',
					href: 'https://vuetifyjs.com',
					target: '_blank'
			}]*/
};
