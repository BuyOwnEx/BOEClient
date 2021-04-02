<template>
	<div class="pa-1 pt-0">
		<div class="mt-2 mb-3">
			<SupportDialogCreate />
		</div>

		<v-list class="mt-2 pa-0" dense nav>
			<v-list-item
				v-for="item in supportTypes"
				:key="item.type"
				:input-value="selectedType === item.type"
				:ripple="false"
				active-class="primary--text"
				@click="navigate(item.type)"
			>
				<v-list-item-icon>
					<v-icon :color="item.color" small>{{ item.icon }}</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title>{{ item.name }}</v-list-item-title>
				</v-list-item-content>

				<v-list-item-action
					v-if="isProcessingTypeAndQuantityMoreZero(item.type)"
				>
					<v-badge
						color="primary"
						class="font-weight-bold"
						:content="processingQuantity"
						inline
					>
					</v-badge>
				</v-list-item-action>
			</v-list-item>
		</v-list>

		<!--		<v-list dense nav class="mt-2 pa-0">-->
		<!--			<div class="overline pa-1 mt-2">{{ $t('todo.labels') }}</div>-->

		<!--			<v-list-item-->
		<!--				v-for="label in labels"-->
		<!--				:key="label.id"-->
		<!--				active-class="primary&#45;&#45;text"-->
		<!--			>-->
		<!--				<v-list-item-icon>-->
		<!--					<v-icon small :color="label.color">mdi-label-outline</v-icon>-->
		<!--				</v-list-item-icon>-->

		<!--				<v-list-item-content>-->
		<!--					<v-list-item-title>{{ label.title }}</v-list-item-title>-->
		<!--				</v-list-item-content>-->
		<!--			</v-list-item>-->
		<!--		</v-list>-->
	</div>
</template>

<script>
import { mapState } from 'vuex';

import SupportDialogCreate from '../dialog/SupportDialogCreate';

export default {
	name: 'SupportSidebarMenu',

	components: { SupportDialogCreate },

	props: {
		processingQuantity: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			selectedType: 'processing',
		};
	},

	computed: {
		...mapState('support', ['supportTypes']),
	},

	methods: {
		navigate(type) {
			window.location.hash = type;
			this.selectedType = type;
			this.$emit('update', type);
		},
		isProcessingTypeAndQuantityMoreZero(type) {
			return type === 'processing' && this.processingQuantity > 0;
		},
	},
};
</script>

<style scoped></style>
