export default {
	namespaced: true,
	state: {
		selectedCurrencyOut: null,
		selectedCurrencyIn: null,
		ask_list: null,
		bid_list: null,
		is_reverse_depth: null,
        reserve: null,
        used_limits: null
	},
	getters: {
		selectedPair: state => {
			return state.selectedCurrencyOut + '/' + state.selectedCurrencyIn;
		}
	},
	mutations: {
		setPair(state, payload) {
			state.selectedCurrencyOut = payload.currency_out !== null ? payload.currency_out.toLowerCase() : null;
			state.selectedCurrencyIn = payload.currency_in !== null ? payload.currency_in.toLowerCase() : null;
		},
		setAskList(state, list) {
			state.ask_list = list;
		},
		setBidList(state, list) {
			state.bid_list = list;
		},
		setReverseStatus(state, status) {
			state.is_reverse_depth = status;
		},
        setReserve(state, reserve)
        {
          state.reserve = reserve;
        },
        setUsedLimits(state, data) {
            state.used_limits = data;
        }
	},
	actions: {
		getOrderBookFromExchange({ commit }) {
			return new Promise((resolve, reject) => {
				let queryParams = {
					params: {
						currency_out: this.state.exchange.selectedCurrencyOut,
						currency_in: this.state.exchange.selectedCurrencyIn,
					},
				};
				axios
					.get('/trader/ext/otc_depth', queryParams)
					.then(response => {
						commit('setReverseStatus', response.data.currency_out !== response.data.currency);
						commit('setAskList', response.data.asks_list);
						commit('setBidList', response.data.bids_list);
                        commit('setReserve', response.data.reserve_in);
						resolve(response.data);
					})
					.catch(error => {
						console.log(error);
						reject();
					});
			});
		},
        getUsedLimits({ commit }) {
            return new Promise((resolve, reject) => {
                axios
                    .get('/trader/ext/otc_limits')
                    .then(response => {
                        commit('setUsedLimits', response.data.data);
                        resolve(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                        reject();
                    });
            });
        },
	},
};