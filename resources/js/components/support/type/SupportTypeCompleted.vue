<template>
	<div class="d-flex flex-grow-1">
		<SupportList
			:key="completedTickets.length"
			:tickets-prop="completedTickets"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import SupportList from '../SupportList';

export default {
	name: 'SupportTypeCompleted',

	components: { SupportList },

	computed: {
		...mapGetters({
			completedTickets: 'support/getCompletedTickets',
		}),
	},
};
</script>
