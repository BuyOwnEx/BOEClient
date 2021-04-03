<template>
	<div class="d-flex flex-grow-1">
		<SupportList :key="closedTickets.length" :tickets-prop="closedTickets" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import SupportList from '../SupportList';

export default {
	name: 'SupportTypeClosed',

	components: { SupportList },

	computed: {
		...mapGetters({
			closedTickets: 'support/getClosedTickets',
		}),
	},
};
</script>
