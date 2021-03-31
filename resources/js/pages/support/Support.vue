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
				@update="updateHash"
			/>
		</v-navigation-drawer>

		<div class="support-page__content-wrapper d-flex flex-grow-1 flex-column">
			<v-toolbar class="support-page__toolbar flex-grow-0 hidden-lg-and-up">
				<v-app-bar-nav-icon @click="drawer = !drawer" />
				<div class="title font-weight-bold">Поддержка</div>
			</v-toolbar>

			<keep-alive>
				<component :is="supportTypeComponentToShow" :key="hash" />
			</keep-alive>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import SupportSidebarMenu from '../../components/support/sidebar/SupportSidebarMenu';

export default {
	name: 'Support',

	components: { SupportSidebarMenu },

	data() {
		return {
			drawer: false,
			hash: '',
		};
	},

	computed: {
		...mapGetters({
			processingQuantity: 'getProcessingTicketsQuantity',
		}),

		supportTypeComponentToShow() {},
	},

	methods: {
		...mapActions({
			fetchTicketsStore: 'support/fetchTickets',
		}),

		updateHash(hash) {
			this.hash = hash;
		},
	},

	created() {
		// this.fetchTicketsStore();
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