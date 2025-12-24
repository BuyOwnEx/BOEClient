<template>
	<div class="tickets-menu d-flex flex-grow-1 flex-row">
		<v-navigation-drawer
			v-model="drawer"
			class="tickets-menu__sidebar elevation-0 rounded flex-shrink-0"
			:app="$vuetify.breakpoint.mdAndDown"
			:permanent="$vuetify.breakpoint.lgAndUp"
			width="240"
			floating
      right
		>
			<SupportSidebarMenu @update-status="updateStatus" @update-priority="updatePriority" />
		</v-navigation-drawer>

		<v-card class="tickets d-flex flex-grow-1 flex-column">
      <v-data-table
          class="pt-1 px-1 pt-sm-2 px-sm-2 fill-height"
          mobile-breakpoint="960"
          :calculate-widths="true"
          :headers="headers"
          :options="options"
          :items="items"
          :items-per-page="itemsPerPage"
          :footer-props="footer_props"
          :loading="loading"
      >
        <template #top>
          <div class="d-flex justify-space-between">
            <CommonPageTitle class="mx-1 pa-0">{{ $t('support.title') }}</CommonPageTitle>
            <div class="d-inline-flex align-items-center">
              <v-card-title class="pa-0">
                <v-btn class="pa-0 mr-1" width="48" height="48" :loading="loading" icon @click="fetch">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-card-title>
              <v-toolbar class="tickets-menu__toolbar flex-grow-0 hidden-lg-and-up">
                <v-app-bar-nav-icon @click="drawer = !drawer" />
              </v-toolbar>
            </div>
          </div>
        </template>
        <template #item.ticket="{ item }">
          <v-list-item-content class="ticket-list-item flex-grow-1" style="max-width: 500px">
            <v-list-item-title class="font-weight-bold">
              <Link :path="'/ticket/'+item.id" style="color: inherit">{{ item.title }}</Link>
            </v-list-item-title>
            <v-list-item-subtitle class="text-truncate">{{ item.message }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <template #item.priority="{ item }">
          <v-chip small label :color="priority_color(item.priority)">
            {{ $t('support.priority.'+item.priority) }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip small label :color="status_color(item.status)">
            <v-icon x-small left>
              {{ status_icon(item.status) }}
            </v-icon>
            {{ $t('support.status.'+item.status) }}
          </v-chip>
        </template>
        <template #item.id="{ item }">
          <Link :path="'/ticket/'+item.id" style="color: inherit">{{ item.id }}</Link>
        </template>
        <template #item.date="{ item }">
          <span class="table-date">
            {{ formatDate(item.created_at) }}
          </span>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex flex-row-reverse">
            <CommonTooltip v-if="item.status !== 'closed'" :value="$t('common.close')">
              <close
                :ticket_id="item.id"
                @reload="fetch"
              ></close>
            </CommonTooltip>
            <CommonTooltip :value="$t('common.view')">
              <v-btn
                  :to="'/ticket/'+item.id"
                  icon
                  plain
                  x-small
                  class="mx-1"
              >
                <v-icon color="secondary">mdi-more</v-icon>
              </v-btn>
            </CommonTooltip>
          </div>
        </template>
      </v-data-table>
		</v-card>
	</div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import formatDate from '@/mixins/format/formatDate';
import SupportSidebarMenu from '@/components/support/sidebar/SupportSidebarMenu.vue';
import CommonPageTitle from "@/components/common/CommonPageTitle.vue";
import CommonTooltip from "@/components/common/CommonTooltip.vue";
import Close from "@/components/support/dialog/Close.vue";
import Link from "@/components/common/Link.vue";

export default {
	name: 'Support',
	components: {
    Link,
    CommonTooltip,
    CommonPageTitle,
		SupportSidebarMenu,
    Close
	},
  mixins: [formatDate],
	data() {
		return {
			drawer: false,
			status: 'all',
			priority: 'all',
      totalItems: 0,
      options: {
        sortBy: ['id'],
        sortDesc: [true]
      },
      itemsPerPage: 15,
      sortBy: 'id',
      sortDesc: true,
      footer_props: {
        'items-per-page-options': [15, 50, 100, 500],
        'items-per-page-all-text': '500',
      },
		};
	},
  computed: {
    ...mapState('support', [
      'tickets',
      'total',
      'loading'
    ]),
    headers() {
      return [
        { text: 'ID', value: 'id', width: '50px' },
        { text: this.$t('table_header.date'), value: 'date', width: '150px' },
        { text: this.$t('table_header.ticket'), value: 'ticket' },
        { text: this.$t('table_header.status'), value: 'status', width: '150px' },
        { text: this.$t('table_header.priority'), value: 'priority', width: '120px' },
        { text: this.$t('table_header.actions'), value: 'action', sortable: false, align: 'end', width: '80px' },
      ];
    },
    items() {
      if(this.status === 'all' && this.priority === 'all') return _.filter(this.tickets, item => { return item.status !== 'closed' });
      else if(this.status === 'all' && this.priority !== 'all') return _.filter(this.tickets, item => { return item.priority === this.priority && item.status !== 'closed' });
      else if(this.status === 'closed' && this.priority === 'all') return _.filter(this.tickets, item => { return item.status === 'closed' });
      else if(this.status === 'closed' && this.priority !== 'all') return _.filter(this.tickets, item => { return item.status === 'closed' && item.priority === this.priority });
      else if(this.status !== 'all' && this.status !== 'closed' && this.priority === 'all') return _.filter(this.tickets, item => { return item.status === this.status });
      else if(this.status !== 'all' && this.status !== 'closed' && this.priority !== 'all') return _.filter(this.tickets, item => { return item.status === this.status && item.priority === this.priority });
      else return this.tickets
    },
  },
	methods: {
		...mapActions({
			fetchTicketsStore: 'support/fetchTickets',
      closeTicketStore: 'support/closeTicket',
		}),
		async fetch() {
			await this.fetchTicketsStore();
		},
    async close(ticket_id) {
      await this.closeTicketStore(ticket_id);
    },
		updateStatus(status) {
			this.status = status;
		},
		updatePriority(priority) {
			this.priority = priority;
		},
    priority_color(priority) {
      if(priority === 'low') return 'green';
      else if(priority === 'medium') return 'orange';
      else if(priority === 'high') return 'error';
      else return 'primary';
    },
    status_color(status) {
      if(status === 'new') return 'primary';
      else if(status === 'pending') return 'accent';
      else if(status === 'hold') return 'orange';
      else if(status === 'solved') return 'green';
      else if(status === 'closed') return 'red';
      else return 'primary';
    },
    status_icon(status) {
      if(status === 'new') return 'mdi-moon-new';
      else if(status === 'pending') return 'mdi-circle-slice-2';
      else if(status === 'hold') return 'mdi-timer-pause-outline';
      else if(status === 'solved') return 'mdi-check';
      else if(status === 'closed') return 'mdi-close';
      else return 'mdi-label';
    },
	},
	created() {
		this.fetch();
	},
};
</script>

<style lang="sass" scoped>
.tickets-menu
	&__sidebar
		margin-right: 5px
		@media screen and (max-width: 1263px)
			border-radius: 0 !important
	&__toolbar
		margin-bottom: 5px

.v-application--is-rtl
	.tickets-menu
		&__sidebar
			margin-right: 0
			margin-left: 5px

.ticket-list-item
	@media #{map-get($display-breakpoints, 'lg-and-up')}
		max-width: 500px
	@media #{map-get($display-breakpoints, 'sm-and-down')}
		max-width: 200px !important
</style>
