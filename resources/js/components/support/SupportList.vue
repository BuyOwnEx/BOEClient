<template>
	<v-card class="support-list">
		<div>
			<v-text-field
				v-model="filter"
				class="pa-1 py-2 support-list__filter elevation-1"
				placeholder="Filter tasks"
				prepend-inner-icon="mdi-magnify"
				hide-details
				block
				clearable
				solo
				flat
			/>
		</div>

		<v-divider />

		<div v-if="tickets.length === 0">
			<div class="px-1 py-6 text-center overline">Тикетов нет</div>
		</div>

		<v-list v-else class="pa-0">
			<v-list-item
				v-for="ticket in tickets"
				:key="ticket.id"
				class="support-list__item d-flex pa-2 align-center"
				:class="{
					'support-list__item--completed': ticket.status !== 'processing',
				}"
				@click="openTicketDetails(ticket)"
			>
				<v-list-item-content class="support-list__item-content flex-grow-1">
					<v-list-item-title class="font-weight-bold">
						{{ ticket.subject }}
					</v-list-item-title>

					<v-list-item-subtitle>{{ ticket.body }}</v-list-item-subtitle>

					<div v-if="ticket.status === 'processing'">
						<v-chip
							:color="getCategoryColor(ticket.category)"
							class="font-weight-bold mt-1 mr-1"
							small
							outlined
						>
							{{ getCategoryName(ticket.category) }}
						</v-chip>
						<v-chip
							:color="getPriorityColor(ticket.priority)"
							class="font-weight-bold mt-1 mr-1"
							small
							outlined
						>
							{{ getPriorityName(ticket.priority) }}
						</v-chip>
					</div>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'SupportList',

	props: {
		ticketsProp: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			tickets: this.ticketsProp,
			filter: '',
		};
	},

	computed: {
		...mapState('support', ['categoryList', 'priorityList']),
	},

	watch: {
		ticketsProp(val) {
			this.tickets = val;
		},
	},

	methods: {
		openTicketDetails(ticket) {
			console.log(ticket);
		},

		getCategoryColor(itemCategory) {
			return this.categoryList.find(item => item.key === itemCategory).color;
		},
		getCategoryName(itemCategory) {
			return this.categoryList.find(item => item.key === itemCategory).name;
		},
		getPriorityColor(itemPriority) {
			return this.priorityList.find(item => item.key === itemPriority).color;
		},
		getPriorityName(itemPriority) {
			return this.priorityList.find(item => item.key === itemPriority).name;
		},
		getLabelColor(id) {
			const label = this.labels.find(l => l.id === id);
			return label ? label.color : '';
		},
		getLabelTitle(id) {
			const label = this.labels.find(l => l.id === id);
			return label ? label.title : '';
		},
	},
};
</script>

<style lang="sass" scoped>
.support-list
	display: flex
	flex-grow: 1
	flex-flow: column
	&__item
		border-bottom: 1px solid #8c8c8c1a
		&:last-child
			border-bottom: none
		&--completed
			text-decoration: line-through
</style>
