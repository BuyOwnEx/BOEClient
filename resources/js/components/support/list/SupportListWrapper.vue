<template>
	<div class="d-flex flex-grow-1">
		<SupportList :key="ticketsData.length" :tickets-prop="ticketsData" />
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SupportList from './SupportList';

export default {
	name: 'SupportListWrapper',

	props: {
		statusToShow: {
			type: String,
			required: true,
		},
		priorityToShow: {
			type: String,
			required: true,
		},
	},

	components: { SupportList },

	computed: {
		...mapState('support', ['tickets', 'supportStatuses', 'priorityList']),
		...mapGetters({
			getTicketsByStatus: 'support/getTicketsByStatus',
			getTicketsByPriority: 'support/getTicketsByPriority',
			getTicketsByPriorityAndStatus: 'support/getTicketsByPriorityAndStatus',
		}),

		ticketsData() {
			const isAllStatuses = this.statusToShow === 'all';
			const isAllPriorities = this.priorityToShow === 'all';
			const isStatus =
					this.supportStatuses.findIndex(p => p.key === this.statusToShow) !== -1;
			const isPriority =
				this.priorityList.findIndex(p => p.key === this.priorityToShow) !== -1;
            if(isAllStatuses && isAllPriorities) return this.tickets;
			else if (isAllStatuses && !isAllPriorities && isPriority) return this.getTicketsByPriority(this.priorityToShow);
			else if (isAllPriorities && !isAllStatuses && isStatus) return this.getTicketsByStatus(this.statusToShow);
			else return this.getTicketsByPriorityAndStatus(this.priorityToShow, this.statusToShow);
		},
	},
};
</script>

<style scoped></style>
