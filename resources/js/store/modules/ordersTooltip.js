export default {
	namespaced: true,
	state: {
		selectedRowIndex: -1,
		averagePrice: '',
		sumSize: '',
		sumVolume: '',
		activeTooltipType: '',
	},

	getters: {
		isAboveThanHoverElement: state => itemToCompareIndex => {
			const mainItemIndex = state.selectedRowIndex;
			return itemToCompareIndex <= mainItemIndex;
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

		SET_DATA_FOR_TOOLTIP(state, ordersData) {
			let averagePrice = 0;
			let sumSize = 0;
			let sumVolume = 0;
			let itemsBeforeMainIndex;
			const mainItemIndex = state.selectedRowIndex;

			itemsBeforeMainIndex = ordersData.filter(
				(item, index) => index <= mainItemIndex,
			);

			itemsBeforeMainIndex.forEach(item => {
				averagePrice += item.price;
				sumSize += item.actualSize;
				sumVolume += item.price * item.actualSize;
			});

			state.averagePrice = (averagePrice / itemsBeforeMainIndex.length).toFixed(
				2,
			);
			state.sumSize = sumSize.toFixed(4);
			state.sumVolume = sumVolume.toFixed(4);
		},
		CLEAR_SELECTED_ROW_INDEX(state) {
			state.selectedRowIndex = -1;
		},
	},

	actions: {
		selectedItemHoverHandler({ commit }, { item, type, ordersData }) {
			const payload = {
				ordersData,
				item,
			};

			commit('SET_SELECTED_ROW_INDEX', payload);
			commit('SET_ACTIVE_TOOLTIP_TYPE', type);
			commit('SET_DATA_FOR_TOOLTIP', ordersData);
		},
		clearSelectedRowIndex({ commit }) {
			commit('CLEAR_SELECTED_ROW_INDEX');
		},
	},
};
