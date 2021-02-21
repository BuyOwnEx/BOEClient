import configs from '../../configs'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const { product, time, theme, currencies  } = configs;

const { globalTheme, menuTheme, toolbarTheme, isToolbarDetached, isContentBoxed, isRTL } = theme;
const { currency, availableCurrencies } = currencies;

// state initial values
const state = {
  product,
  time,
  // currency
  currency,
  availableCurrencies,

  // themes and layout configurations
  globalTheme,
  menuTheme,
  toolbarTheme,
  isToolbarDetached,
  isContentBoxed,
  isRTL,

  // authorization state
  trader: null,

  // App.vue main toast
  toast: {
    show: false,
    color: 'black',
    message: '',
    timeout: 3000
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
