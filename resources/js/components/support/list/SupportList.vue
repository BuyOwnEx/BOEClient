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
				Закрыть тикет
			</v-btn>

			<v-btn v-if="!ticketDetails" :loading="loading" icon @click="refresh">
				<v-icon>mdi-refresh</v-icon>
			</v-btn>

			<v-spacer />

			<div class="caption mr-1">
				1 - {{ tickets.length }} of {{ totalTicketsCount }}
			</div>
			<v-btn icon :disabled="!prevPage" @click="getPrevPage">
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-btn icon :disabled="!nextPage" @click="getNextPage">
				<v-icon>mdi-chevron-right</v-icon>
			</v-btn>
		</div>

		<v-divider />

		<div v-if="tickets.length === 0">
			<div class="py-6 text-center overline">Тикетов нет</div>
		</div>

		<v-list v-else-if="tickets.length && !ticketDetails" class="pa-0">
			<v-list-item
				v-for="ticket in tickets"
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
import SupportTicketDetails from '../details/SupportTicketDetails';

import formatDate from '../../../mixins/format/formatDate';
import loadingMixin from '../../../mixins/common/loadingMixin';

export default {
	name: 'SupportList',

	components: { SupportTicketDetails },

	mixins: [formatDate, loadingMixin],

	props: {
		ticketsProp: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			tickets: this.ticketsProp,
			ticketDetails: null,
		};
	},

	computed: {
		...mapState('support', ['totalTicketsCount', 'nextPage', 'prevPage']),
		isDetailsStatusNotClosed() {
			return this.ticketDetails && this.ticketDetails.status !== 'closed';
		},
	},

	watch: {
		ticketsProp(val) {
			this.resetScroll();
			this.tickets = val;
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
			this.fetchPage({ type: 'next', page: this.nextPage });
		},
		getNextPage() {
			this.fetchPage({ type: 'prev', page: this.prevPage });
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
