<template>
	<v-container>
		<v-row justify='space-around'>
			<v-date-picker
				v-model='date'
				type='month'
				width='290'
				class='mt-4'
			></v-date-picker>
			<v-date-picker
				v-model='date'
				full-width
				:landscape='$vuetify.breakpoint.smAndUp'
				type='month'
				class='mt-4'
			></v-date-picker>
		</v-row>
	</v-container>
</template>

<script>
export default {
	data: () => ({
		date: new Date().toISOString().substr(0, 7),
	}),
};
</script>
