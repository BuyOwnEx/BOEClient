<template>
	<div>
		<span>{{ availableText || $t('trading.order.available') }}:</span>

		<b :class="getAvailableClasses" @click="setAmount">
			{{ available }}
			{{ currency.toUpperCase() }}
		</b>
		<small v-if='smallText'> ({{ smallText }}: {{ small }} {{ currency }}) </small>
	</div>
</template>

<script>
export default {
	name: 'CommonAvailable',

	props: {
		available: {
			type: [String, Number],
			required: true,
		},
		small: {
			type: [String, Number],
			required: false,
		},
		currency: {
			type: String,
			required: true,
		},

		availableText: {
			type: String,
			required: false,
		},
		smallText: {
			type: String,
			required: false,
		},
		nonClickable: {
			type: Boolean,
			required: false,
			default: false,
		},
	},

	computed: {
		getAvailableClasses() {
			return this.nonClickable ? '' : 'clickable non-selectable dashed';
		},
	},

	methods: {
		setAmount() {
			this.$emit('set', this.available);
		},
	},
};
</script>
