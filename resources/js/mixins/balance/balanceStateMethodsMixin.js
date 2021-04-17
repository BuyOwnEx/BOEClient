export default {
	computed: {
		stateTypes() {
			return this.$store.state.balance.stateTypes
		}
	},

	methods: {
		isReplenish(state) {
			const everythingIsOk = state === 1;
			const onlyReplenish = state === 3;
			return everythingIsOk || onlyReplenish;
		},
		isWithdraw(state) {
			const everythingIsOk = state === 1;
			const onlyWithdraw = state === 2;
			return everythingIsOk || onlyWithdraw;
		},
		getStateIconName(state, type) {
			const status = this.stateTypes.find(t => t.id === state);
			const iconType = `${type}Icon`;
			return status[iconType].name;
		},
		getStateIconColor(state, type) {
			const status = this.stateTypes.find(t => t.id === state);
			const iconType = `${type}Icon`;
			return status[iconType].color;
		},
		getStateTextStatus(state, type) {
			const status = this.stateTypes.find(t => t.id === state);
			return status[type];
		},
	}
}