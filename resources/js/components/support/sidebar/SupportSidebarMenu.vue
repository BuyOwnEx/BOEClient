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

					<v-list-item-action
						v-if="isProcessingTypeAndQuantityMoreZero(type.key)"
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
