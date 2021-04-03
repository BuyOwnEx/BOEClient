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
		typeToShow: {
			type: String,
			required: true,
		},
	},

	components: { SupportList },

	computed: {
		...mapState('support', ['tickets', 'supportTypes', 'priorityList']),
		...mapGetters({
			getTicketsByStatus: 'support/getTicketsByStatus',
			getTicketsByPriority: 'support/getTicketsByPriority',
		}),

		ticketsData() {
			const isAllTickets = this.typeToShow === 'all';
			const isPriority =
				this.priorityList.findIndex(p => p.key === this.typeToShow) !== -1;

			if (isAllTickets) return this.tickets;
			else if (isPriority) return this.getTicketsByPriority(this.typeToShow);
			else return this.getTicketsByStatus(this.typeToShow);
		},
	},
};
</script>

<style scoped></style>
