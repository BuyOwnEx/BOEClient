<template>
	<div class="support-sidebar-menu pa-1 pt-0">
		<div class="support-sidebar-menu__fixed-wrapper">
			<div class="mt-2 mb-3">
				<SupportDialogCreate />
			</div>

			<v-list class="mt-2 pa-0" dense nav>
				<v-list-item
					v-for="type in supportTypes"
					:key="type.id"
					:input-value="selectedType === type.key"
					:ripple="false"
					active-class="primary--text"
					@click="navigate(type.key)"
				>
					<v-list-item-icon>
						<v-icon :color="type.color" small>{{ type.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ type.name }}</v-list-item-title>
					</v-list-item-content>

					<v-list-item-action v-if="showQuantity(type.key)">
						<v-badge
							color="primary"
							class="font-weight-bold"
							:content="getQuantity(type.key)"
							inline
						>
						</v-badge>
					</v-list-item-action>
				</v-list-item>
			</v-list>

			<v-list dense nav class="mt-2 pa-0">
				<div class="overline pa-1 mt-2">Приоритет</div>

				<v-list-item
					v-for="priority in priorityList"
					:key="priority.id"
					:input-value="selectedType === priority.key"
					:ripple="false"
					active-class="primary--text"
					@click="navigate(priority.key)"
				>
					<v-list-item-icon>
						<v-icon small :color="priority.color">mdi-label-outline</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ priority.name }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import SupportDialogCreate from '../dialog/SupportDialogCreate';

export default {
	name: 'SupportSidebarMenu',

	components: { SupportDialogCreate },

	data() {
		return {
			selectedType: 'all',
		};
	},

	computed: {
		...mapState('support', ['supportTypes', 'priorityList']),
		...mapGetters({
			getQuantity: 'support/getQuantityByStatus',
		}),
	},

	methods: {
		showQuantity(type) {
			return (
				this.getQuantity(type) > 0 &&
				type !== 'closed' &&
				type !== 'solved' &&
				type !== 'all'
			);
		},

		navigate(type) {
			window.location.hash = type;
			this.selectedType = type;
			this.$emit('update', type);
		},
	},
};
</script>
