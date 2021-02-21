import menuApps from './menus/apps.menu'
import menuPages from './menus/pages.menu'

export default {
  // main navigation - side menu
  menu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-view-dashboard-outline', key: 'menu.dashboard', text: 'Dashboard', link: '/dashboard' },
      { icon: 'mdi-finance', key: 'menu.trading', text: 'Trading', link: '/' },
      { icon: 'mdi-home', key: 'menu.overview', text: 'Market overview', link: '/trader/overview' },
      { icon: 'mdi-autorenew', key: 'menu.transactions', text: 'Transactions', link: '/trader/transactions' },
      { icon: 'mdi-cached', key: 'menu.fiat_transactions', text: 'Transactions (fiat)', link: '/trader/fiat_transactions' },
      { icon: 'mdi-swap-horizontal', key: 'menu.transfers', text: 'Transfers', link: '/trader/transfers' },
      { icon: 'mdi-poll', key: 'menu.offers', text: 'Margin offers', link: '/trader/offers' },
      { icon: 'mdi-file-document-outline', key: 'menu.orders', text: 'Orders', link: '/trader/orders' },
      { icon: 'mdi-checkbox-marked-outline', key: 'menu.deals', text: 'Deals', link: '/trader/deals' },
      { icon: 'mdi-currency-usd', key: 'menu.balance', text: 'Balance', link: '/trader/balance' },
      { icon: 'mdi-account-cash', key: 'menu.refs', text: 'Referral payments', link: '/trader/ref_payments' },
      { icon: 'mdi-message-outline', key: 'menu.support', text: 'Support', link: '/trader/support' },
      { icon: 'mdi-cogs', key: 'menu.settings', text: 'Trading', link: '/trader/settings' },
      { icon: 'mdi-information-outline', key: 'menu.notifications', text: 'Trading', link: '/trader/notifications' },
    ]
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
}
