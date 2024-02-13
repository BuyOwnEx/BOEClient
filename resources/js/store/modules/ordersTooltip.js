import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	namespaced: true,
	state: {
		selectedRowIndex: -1,
		averagePrice: 0,
		sumSize: 0,
		sumVolume: 0,
		activeTooltipType: '',
	},

	getters: {
		isAboveThanHoverElement: state => {
			return (itemToCompareIndex, type) => {
				const isTypeNotActiveTypeInState = type !== state.activeTooltipType;
				const isActiveTypeEmpty = type === '';
				if (isTypeNotActiveTypeInState || isActiveTypeEmpty) return false;

				const mainItemIndex = state.selectedRowIndex;
				return itemToCompareIndex <= mainItemIndex;
			};
		},
	},

	mutations: {
		SET_SELECTED_ROW_INDEX(state, { item, ordersData }) {
			state.selectedRowIndex = ordersData.findIndex(el => {
				return el.price === item.price;
			});
		},

		SET_ACTIVE_TOOLTIP_TYPE(state, type) {
			state.activeTooltipType = type;
		},

		SET_DATA_FOR_TOOLTIP(state, { ordersData, priceScale, amountScale }) {
			let sumPrice = 0;
			let sumSize = 0;
			let sumVolume = 0;
			let itemsBeforeMainIndex;
			const mainItemIndex = state.selectedRowIndex;

			itemsBeforeMainIndex = ordersData.filter(
				(item, index) => index <= mainItemIndex
			);

			itemsBeforeMainIndex.forEach(item => {
				sumPrice = BigNumber.sum(sumPrice, item.price).toNumber();
				sumSize = BigNumber.sum(sumSize, item.actual_size).toNumber();

				const volume = BigNumber(item.price).times(item.actual_size);
				sumVolume = BigNumber.sum(sumVolume, volume).toNumber();
			});

			state.averagePrice = BigNumber(sumPrice)
				.div(itemsBeforeMainIndex.length)
				.toFixed(priceScale, 1);
			state.sumSize = BigNumber(sumSize).toFixed(amountScale, 1);
			state.sumVolume = sumVolume;
		},
		CLEAR_SELECTED_ROW_INDEX(state) {
			state.selectedRowIndex = -1;
		},
	},

	actions: {
		selectedItemHoverHandler({ commit }, payload) {
			commit('SET_SELECTED_ROW_INDEX', payload);
			commit('SET_ACTIVE_TOOLTIP_TYPE', payload.type);
			commit('SET_DATA_FOR_TOOLTIP', payload);
		},

		clearSelectedRowIndex({ commit }) {
			commit('CLEAR_SELECTED_ROW_INDEX');
		},

		updateData({ commit }, payload) {
			commit('SET_DATA_FOR_TOOLTIP', payload);
		},
	},
};
