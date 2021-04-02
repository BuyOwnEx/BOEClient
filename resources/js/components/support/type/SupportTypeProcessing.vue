<template>
	<div class="d-flex flex-grow-1">
		<SupportList
			:key="processingTickets.length"
			:tickets-prop="processingTickets"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import SupportList from '../SupportList';

export default {
	name: 'SupportTypeProcessing',

	components: { SupportList },

	computed: {
		...mapGetters({
			processingTickets: 'support/getProcessingTickets',
		}),
	},
};
</script>

<style scoped></style>
