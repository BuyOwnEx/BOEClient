<template>
	<div class="support-page d-flex flex-grow-1 flex-row">
		<v-navigation-drawer
			v-model="drawer"
			class="support-page__sidebar elevation-1 rounded flex-shrink-0"
			:app="$vuetify.breakpoint.mdAndDown"
			:permanent="$vuetify.breakpoint.lgAndUp"
			width="240"
			floating
		>
			<SupportSidebarMenu
				:processing-quantity="processingQuantity"
				@update="updateType"
			/>
		</v-navigation-drawer>

		<div class="support-page__content-wrapper d-flex flex-grow-1 flex-column">
			<v-toolbar class="support-page__toolbar flex-grow-0 hidden-lg-and-up">
				<v-app-bar-nav-icon @click="drawer = !drawer" />
				<div class="title font-weight-bold">Поддержка</div>
			</v-toolbar>

			<keep-alive>
				<component :is="supportTypeComponentToShow" :key="type" />
			</keep-alive>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import SupportSidebarMenu from '../../components/support/sidebar/SupportSidebarMenu';
import SupportTypeProcessing from '../../components/support/type/SupportTypeProcessing';
import SupportTypeCompleted from '../../components/support/type/SupportTypeCompleted';
import SupportTypeClosed from '../../components/support/type/SupportTypeClosed';

export default {
	name: 'Support',

	components: {
		SupportSidebarMenu,
		SupportTypeProcessing,
		SupportTypeCompleted,
		SupportTypeClosed,
	},

	data() {
		return {
			drawer: false,
			type: 'processing',
		};
	},

	computed: {
		...mapGetters({
			processingQuantity: 'support/getProcessingTicketsQuantity',
		}),

		supportTypeComponentToShow() {
			const firstCharToUppercase = this.type.charAt(0).toUpperCase();
			const restOfWord = this.type.slice(1);
			return 'SupportType' + firstCharToUppercase + restOfWord;
		},
	},

	methods: {
		...mapActions({
			fetchTicketsStore: 'support/fetchTickets',
			fetchPriorityListStore: 'support/fetchPriorityList',
			fetchStatusList: 'support/fetchStatusList',
			fetchTagList: 'support/fetchTagList',
		}),

		updateType(type) {
			this.type = type;
		},
	},

	created() {
		// this.fetchTicketsStore();
		// this.fetchPriorityListStore();
		// this.fetchStatusList();
		// this.fetchTagList();
	},
};
</script>

<style lang="sass" scoped>
.support
	&__sidebar
		margin-right: 5px
		position: sticky
		top: 69px !important
	&__toolbar
		margin-bottom: 5px

	@media screen and (max-width: 1263px)
		&__sidebar
			position: fixed
			top: 0 !important

.v-application--is-rtl
	.notifications
		&__sidebar
			margin-right: 0
			margin-left: 5px
</style>
