<template>
	<div class="support-list min-w-0">
		<div class="support-list__top px-2 d-flex align-center">
			<v-btn v-if="ticketDetails" icon @click="ticketDetails = null">
				<v-icon>mdi-arrow-left</v-icon>
			</v-btn>

			<v-btn
				v-if="isDetailsStatusNotClosed"
				class="mx-2"
				:loading="loading"
				@click="closeTicket"
			>
				{{ $t('support.close_ticket') }}
			</v-btn>

			<v-btn v-if="!ticketDetails" :loading="loading" icon @click="refresh">
				<v-icon>mdi-refresh</v-icon>
			</v-btn>

			<v-spacer />

			<div v-if="ticketsProp.length" class="d-flex align-center">
				<div class="caption mr-1">
					{{ pagesText }}
				</div>
				<v-btn icon :disabled="currentPage === 1" @click="getPrevPage">
					<v-icon>mdi-chevron-left</v-icon>
				</v-btn>
				<v-btn icon :disabled="currentPage === totalPages" @click="getNextPage">
					<v-icon>mdi-chevron-right</v-icon>
				</v-btn>
			</div>
		</div>

		<v-divider />

		<div v-if="ticketsProp.length === 0">
			<div class="py-6 text-center overline">
				{{ $t('support.no_tickets') }}
			</div>
		</div>

		<v-list v-else-if="ticketsProp.length && !ticketDetails" class="pa-0">
			<v-list-item
				v-for="ticket in paginatedTickets"
				:key="ticket.id"
				class="support-list__item d-flex pa-2 align-center"
				:ripple="false"
				@click="openTicketDetails(ticket)"
			>
				<v-list-item-content class="support-list__item-content flex-grow-1">
					<v-list-item-title class="font-weight-bold">
						{{ ticket.subject }}
					</v-list-item-title>

					<v-list-item-subtitle>{{ ticket.description }}</v-list-item-subtitle>

					<v-list-item-subtitle>
						<span
							v-for="tag in ticket.tags"
							:key="tag"
							class="support-list__tag primary--text"
						>
							#{{ tag }}
						</span>
					</v-list-item-subtitle>
				</v-list-item-content>

				<v-list-item-action>
					<v-list-item-action-text>
						{{ formatDate(ticket.updated_at, 'timeAgo') }}
					</v-list-item-action-text>
				</v-list-item-action>
			</v-list-item>
		</v-list>

		<SupportTicketDetails v-else-if="ticketDetails" :ticket="ticketDetails" />
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import formatDate from '@/mixins/format/formatDate';
import loadingMixin from '@/mixins/common/loadingMixin';

export default {
	name: 'SupportList',

	components: {
		SupportTicketDetails: () => import('@/components/support/details/SupportTicketDetails.vue'),
	},

	mixins: [formatDate, loadingMixin],

	props: {
		ticketsProp: {
			type: Array,
			required: true,
		},
		ticketsStatus: {
			type: String,
			required: true,
		},
		isPriority: {
			type: Boolean,
			required: true,
		},
		closedTicketsQuantity: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			ticketDetails: null,
			currentPage: 1,
		};
	},

	computed: {
		...mapState('support', [
			'totalTicketsCount',
			'nextPage',
			'prevPage',
			'perPage',
		]),

		pagesText() {
			const firstElement = this.currentPage * this.perPage - this.perPage + 1;
			const showedElements = Math.min(
				this.currentPage * this.perPage,
				this.getTicketsQuantity()
			);
			return `${firstElement} - ${showedElements} of ${this.getTicketsQuantity()}`;
		},

		isDetailsStatusNotClosed() {
			return this.ticketDetails && this.ticketDetails.status !== 'closed';
		},
		paginatedTickets() {
			const from = this.currentPage * this.perPage - this.perPage;
			const to = this.currentPage * this.perPage;
			return this.ticketsProp.slice(from, to);
		},
		totalPages() {
			return Math.ceil(this.ticketsProp.length / this.perPage);
		},
	},

	methods: {
		...mapActions({
			fetchPage: 'support/fetchNextOrPrevPage',
			closeTicketStore: 'support/closeTicket',
		}),
		openTicketDetails(ticket) {
			this.resetScroll();
			this.ticketDetails = ticket;
		},

		refresh() {
			this.$emit('refresh');
		},
		getPrevPage() {
			this.currentPage--;
			// this.fetchPage({ type: 'next', page: this.nextPage });
		},
		getNextPage() {
			this.currentPage++;
			// this.fetchPage({ type: 'prev', page: this.prevPage });
		},
		getTicketsQuantity() {
			if (this.ticketsStatus === 'all' && !this.isPriority)
				return this.totalTicketsCount - this.closedTicketsQuantity;
			else return this.ticketsProp.length;
		},

		async closeTicket() {
			try {
				this.startLoading();
				const id = this.ticketDetails.id;

				await this.closeTicketStore(id);

				this.ticketDetails = null;
			} finally {
				this.stopLoading();
			}
		},

		resetScroll() {
			window.scrollTo(0, 0);
		},
	},
};
</script>

<style lang="sass" scoped>
.support-list
	display: flex
	flex-grow: 1
	flex-flow: column
	&__top
		height: 82px
	&__item:not(:last-child)
		border-bottom: 1px solid #8c8c8c1a
	&__tag
		font-size: 0.8rem
		padding-right: 4px
</style>
