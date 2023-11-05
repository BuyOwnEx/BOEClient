<template>
	<v-card class="d-flex flex-grow-1">
		<CommonLoading v-if="!ticketsData" class="mt-6" />
		<SupportList
			v-else
			:key="listKey"
			:tickets-prop="ticketsData"
			:tickets-status="statusToShow"
			:is-priority="Boolean(priorityToShow)"
			:closed-tickets-quantity="getQuantityByStatus('closed')"
			@refresh="refresh"
		/>
	</v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SupportList from '@/components/support/list/SupportList.vue';
import CommonLoading from '@/components/common/CommonLoading.vue';

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
		...mapGetters({
			supportStatuses: 'support/supportStatuses',
			priorityList: 'support/priorityList',
			getTicketsByStatus: 'support/getTicketsByStatus',
			getTicketsByPriority: 'support/getTicketsByPriority',
			getTicketsByPriorityAndStatus: 'support/getTicketsByPriorityAndStatus',
			getQuantityByStatus: 'support/getQuantityByStatus',
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

		listKey() {
			return this.ticketsData.length + Math.random();
		},
	},

	methods: {
		refresh() {
			this.$emit('refresh');
		},
	},
};
</script>
