window._ = require('lodash');

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
require('./axios-interceptors.js');
window.moment = require('moment-timezone');