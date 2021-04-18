<template>
	<div class="support-sidebar-menu pa-1 pt-0">
		<div class="mt-2 mb-3">
			<SupportDialogCreate />
		</div>

		<v-list class="mt-2 pa-0" dense nav>
			<div class="overline pa-1 mt-2">{{ $t('support.menu.status') }}</div>

			<v-list-item
				v-for="status in supportStatuses"
				:key="status.id"
				:input-value="selectedStatus === status.key"
				:ripple="false"
				active-class="primary--text"
				@click="updateStatus(status.key)"
			>
				<v-list-item-icon>
					<v-icon :color="status.color" small>{{ status.icon }}</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title>{{ status.name }}</v-list-item-title>
				</v-list-item-content>

				<v-list-item-action v-if="showQuantity(status.key)">
					<v-badge
						color="primary"
						class="font-weight-bold"
						:content="getQuantity(status.key)"
						inline
					>
					</v-badge>
				</v-list-item-action>
			</v-list-item>
		</v-list>

		<v-list dense nav class="mt-2 pa-0">
			<div class="overline pa-1 mt-2">{{ $t('support.menu.priority') }}</div>

			<v-list-item
				v-for="priority in priorityList"
				:key="priority.id"
				:input-value="selectedPriority === priority.key"
				:ripple="false"
				active-class="primary--text"
				@click="updatePriority(priority.key)"
			>
				<v-list-item-icon>
					<v-icon v-if="priority.key === 'all'" small :color="priority.color">
						mdi-dots-horizontal
					</v-icon>
					<v-icon v-else small :color="priority.color">
						mdi-label-outline
					</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title>{{ priority.name }}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

import SupportDialogCreate from '../dialog/SupportDialogCreate';

export default {
	name: 'SupportSidebarMenu',

	components: { SupportDialogCreate },

	data() {
		return {
			selectedStatus: 'all',
			selectedPriority: 'all',
		};
	},

	computed: {
		...mapGetters({
			getQuantity: 'support/getQuantityByStatus',
			supportStatuses: 'support/supportStatuses',
			priorityList: 'support/priorityList',
		}),
	},

	methods: {
		showQuantity(status) {
			return (
				this.getQuantity(status) > 0 &&
				status !== 'closed' &&
				status !== 'solved' &&
				status !== 'all'
			);
		},

		updateStatus(status) {
			this.selectedStatus = status;
			this.$emit('update-status', status);
		},

		updatePriority(priority) {
			this.selectedPriority = priority;
			this.$emit('update-priority', priority);
		},
	},
};
</script>
