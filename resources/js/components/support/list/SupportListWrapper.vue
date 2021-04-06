<template>
	<v-card class="d-flex flex-grow-1">
		<CommonLoading v-if="!ticketsData" class="mt-6" />
		<SupportList v-else :key="ticketsData.length" :tickets-prop="ticketsData" @refresh='refresh'/>
	</v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SupportList from './SupportList';
import CommonLoading from '../../common/CommonLoading';

export default {
	name: 'SupportListWrapper',

	components: { SupportList, CommonLoading },

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

	computed: {
		...mapState('support', ['supportStatuses', 'priorityList']),
		...mapGetters({
			getTicketsByStatus: 'support/getTicketsByStatus',
			getTicketsByPriority: 'support/getTicketsByPriority',
			getTicketsByPriorityAndStatus: 'support/getTicketsByPriorityAndStatus',
		}),

		ticketsData() {
			const isAllStatuses = this.statusToShow === 'all';
			const isAllPriorities = this.priorityToShow === 'all';
			const isStatus =
				this.supportStatuses.findIndex(s => s.key === this.statusToShow) !== -1;
			const isPriority =
				this.priorityList.findIndex(p => p.key === this.priorityToShow) !== -1;

			const all = isAllStatuses && isAllPriorities;
			const priority = isAllStatuses && !isAllPriorities && isPriority;
			const status = isAllPriorities && !isAllStatuses && isStatus;

			if (all) return this.getTicketsByStatus('all');
			else if (priority) return this.getTicketsByPriority(this.priorityToShow);
			else if (status) return this.getTicketsByStatus(this.statusToShow);
			else
				return this.getTicketsByPriorityAndStatus(
					this.priorityToShow,
					this.statusToShow
				);
		},
	},

	methods: {
		refresh() {
			this.$emit('refresh')
		}
	}
};
</script>

<style scoped></style>
