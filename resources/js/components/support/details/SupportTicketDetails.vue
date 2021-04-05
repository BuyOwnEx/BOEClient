<template>
	<div class="support-ticket-details">
		<div class="d-flex pa-2">
			<div class="text-h6">
				{{ ticket.subject }}
			</div>
		</div>

		<CommonLoading v-if="!comments" />

		<div v-else class="pa-2">
			<v-expansion-panels v-model="commentsExpanded" multiple>
				<v-expansion-panel v-for="item in comments" :key="item.id">
					<v-expansion-panel-header>
						<template v-slot:default="{ open }">
							<div class="d-flex">
								<v-avatar size="36" v-html="getGeneratedAvatar(item.author)" />
								<div class="mx-2 min-w-0">
									<div class="font-weight-bold mb-1">
										{{ item.author }}
									</div>
									<div
										v-show="!open"
										class="support-ticket-details__item-text text-truncate"
									>
										{{ item.body }}
									</div>
								</div>
							</div>
						</template>

						<template v-slot:actions>
							<span class="support-ticket-details__date">
								{{ formatDate(item.created_at, 'timeAgo') }}
							</span>
						</template>
					</v-expansion-panel-header>

					<v-expansion-panel-content>
						<div v-html="item.html_body" />
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>

			<v-card v-if="!isClosedTicket" class="mt-4">
				<SupportTicketDetailsInput />
			</v-card>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SupportTicketDetailsInput from './SupportTicketDetailsInput';
import CommonLoading from '../../common/CommonLoading';

import formatDate from '../../../mixins/format/formatDate';

export default {
	name: 'SupportTicketDetails',

	components: { SupportTicketDetailsInput, CommonLoading },

	mixins: [formatDate],

	props: {
		ticket: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			comments: null,
			commentsExpanded: [3],
		};
	},

	computed: {
		...mapGetters({
			getGeneratedAvatar: 'user/getGeneratedAvatar',
		}),
	},

	created() {
		this.fetch();
	},

	methods: {
		...mapActions({
			fetchComments: 'support/fetchCommentsById',
		}),
		async fetch() {
			this.comments = await this.fetchComments(this.ticket.id);
			console.log(this.comments);
		},

		isClosedTicket() {
			return this.ticket.status !== 'closed';
		},
	},
};
</script>

<style lang="sass" scoped>
.support-ticket-details
	&__item-text
		padding-bottom: 2px
	&__date
		min-width: 80px
		display: flex
		justify-content: flex-end
		font-size: 0.8rem
</style>
