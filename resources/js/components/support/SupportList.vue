<template>
	<v-card class="support-list">
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

		<v-divider />

		<div v-if="tasks.length === 0">
			<div class="px-1 py-6 text-center">All done! No more tasks!</div>
		</div>

		<v-slide-y-transition v-else group tag="div">
			<div
				v-for="task in visibleTasks"
				:key="task.id"
				class="d-flex pa-2 support-list__item align-center"
				@click="$emit('edit-task', task)"
			>
				<v-checkbox
					:input-value="task.completed"
					class="mt-0 pt-0"
					hide-details
					off-icon="mdi-checkbox-blank-circle-outline"
					on-icon="mdi-checkbox-marked-circle"
					@click.stop="task.completed ? setIncomplete(task) : setComplete(task)"
				/>

				<div
					class="support-list__item-content flex-grow-1"
					:class="{ complete: task.completed }"
				>
					<div class="font-weight-bold" v-text="task.title"></div>
					<div v-text="task.description"></div>
					<div>
						<v-chip
							v-for="label in task.labels"
							:key="label"
							:color="getLabelColor(label)"
							class="font-weight-bold mt-1 mr-1"
							outlined
							x-small
						>
							{{ getLabelTitle(label) }}
						</v-chip>
					</div>
				</div>

				<div class="d-flex align-center">
					<v-btn icon @click.stop="deleteTask(task)">
						<v-icon>mdi-delete-outline</v-icon>
					</v-btn>
				</div>
			</div>
		</v-slide-y-transition>
	</v-card>
</template>

<script>
export default {
	name: 'SupportList',

	data() {
		return {
			filter: '',
		};
	},

	methods: {
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

<style scoped></style>
