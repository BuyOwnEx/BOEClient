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
			<div class="px-1 py-6 text-center">Тикетов нет</div>
		</div>

		<v-slide-y-transition v-else group tag="div">
			<div
				v-for="ticket in tickets"
				:key="ticket.id"
				class="d-flex pa-2 support-list__item align-center"
				@click="$emit('edit-task', ticket)"
			>
				<v-checkbox
					:input-value="ticket.completed"
					class="mt-0 pt-0"
					hide-details
					off-icon="mdi-checkbox-blank-circle-outline"
					on-icon="mdi-checkbox-marked-circle"
					@click.stop="
						ticket.completed ? setIncomplete(ticket) : setComplete(ticket)
					"
				/>

				<div
					class="support-list__item-content flex-grow-1"
					:class="{ complete: ticket.completed }"
				>
					<div class="font-weight-bold">{{ ticket.subject }}</div>
					<div>{{ ticket.body }}</div>

					<div>
						<v-chip
							:color="getCategoryColor(ticket.category)"
							class="font-weight-bold mt-1 mr-1"
							outlined
							x-small
						>
							{{ getCategoryColor(ticket.category) }}
						</v-chip>
						<v-chip
							:color="getPriorityTitle(ticket.priority)"
							class="font-weight-bold mt-1 mr-1"
							outlined
							x-small
						>
							{{ getPriorityTitle(ticket.priority) }}
						</v-chip>
					</div>
				</div>
			</div>
		</v-slide-y-transition>
	</v-card>
</template>

<script>
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

	watch: {
		ticketsProp(val) {
			this.tickets = val;
		},
	},

	methods: {
		getCategoryColor() {},
		getCategoryTitle() {},
		getPriorityColor() {},
		getPriorityTitle() {},

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
</style>
