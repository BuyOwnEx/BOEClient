import _ from 'lodash';
window._ = _;

import axios from 'axios';
window.axios = axios;
import store from './store';

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.interceptors.response.use(
    function(response) {
        try {
            let data = response.data;
            let color = 'info';
            if ('success' in data && !data.success) {
                color = 'danger';
            }
            if ('success' in data && data.success) {
                color = 'success';
            }
            if ('message' in data) {
                let notification = {};
                if (typeof data.message === 'object' && 'text' in data.message) {
                    notification = {
                        color: data.message.status,
                        text: data.message.text,
                    };
                } else {
                    notification = {
                        text: data.message,
                        color,
                    };
                }
                store.commit('snackbar/SHOW_MESSAGE', notification);
                if (data.success === false) return Promise.reject(data);
            }
        } catch (e) {
            // do nothing
        }
        return response;
    },
    function(error) {
        let timeout = 6000;
        try {
            if (error.response.status === 401 || error.response.status === 419) {
                window.location.href='/login';
            }
            else if (error.response.status === 503) {
                window.location.href='/maintenance';
            }
            else if (error.response.status === 422) {
                let errors = _.get(error, 'response.data');
                if (errors !== undefined && _.size(errors) > 0) {
                    _.each(errors, type => {
                        _.each(type, message => {
                            const notification = {
                                color: 'error',
                                text: message,
                            };
                            store.commit('snackbar/SHOW_MESSAGE', notification);
                        });
                    });
                }
            }
            else {
                let message = _.get(error, 'response.data.message');
                if (message !== undefined) {
                    let notification = {};
                    if (
                        typeof error.response.data.message === 'object' &&
                        'text' in error.response.data.message
                    ) {
                        notification.status = error.response.data.message.status;
                        notification.text = error.response.data.message.text;
                        notification.timeout = _.get(
                            error,
                            'response.data.message.timeout',
                            timeout
                        );
                    }
                    else {
                        notification = {
                            text: error.response.data.message,
                            color: 'error',
                        };
                    }
                    store.commit('snackbar/SHOW_MESSAGE', notification);
                }
            }
        } catch (e) {
            // do nothing
        }
        return Promise.reject(error);
    }
);

import moment from "moment-timezone";
window.moment = moment;
