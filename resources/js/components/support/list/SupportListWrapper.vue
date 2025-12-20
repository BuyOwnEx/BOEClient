<template>
	<v-card class="d-flex flex-grow-1">
		<CommonLoading v-if="!ticketsData" class="mt-6" />
		<SupportList
			v-else
			:key="listKey"
			:tickets-prop="ticketsData"
			:tickets-status="statusToShow"
			:is-priority="Boolean(priorityToShow)"
			:closed-tickets-quantity="get_quantity_by_status('closed')"
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
			support_statuses: 'support/support_statuses',
      priority_list: 'support/priority_list',
      get_tickets_by_status: 'support/get_tickets_by_status',
      get_tickets_by_priority: 'support/get_tickets_by_priority',
      get_tickets_by_priority_and_status: 'support/get_tickets_by_priority_and_status',
      get_quantity_by_status: 'support/get_quantity_by_status',
		}),

		ticketsData() {
			const isAllStatuses = this.statusToShow === 'all';
			const isAllPriorities = this.priorityToShow === 'all';
			const isStatus = this.support_statuses.findIndex(s => s.key === this.statusToShow) !== -1;
			const isPriority = this.priority_list.findIndex(p => p.key === this.priorityToShow) !== -1;

			const all = isAllStatuses && isAllPriorities;
			const priority = isAllStatuses && !isAllPriorities && isPriority;
			const status = isAllPriorities && !isAllStatuses && isStatus;

			if (all) return this.get_tickets_by_status('all');
			else if (priority) return this.get_tickets_by_priority(this.priorityToShow);
			else if (status) return this.get_tickets_by_status(this.statusToShow);
			else return this.get_tickets_by_priority_and_status(this.priorityToShow, this.statusToShow);
		},

		listKey() {
			return this.ticketsData.uuid;
		},
	},

	methods: {
		refresh() {
			this.$emit('refresh');
		},
	},
};
</script>
