<template>
	<v-card class="user-api-create">
		<v-card-title>
			Создать Свой API
		</v-card-title>

		<v-card-text>
			<v-form class="user-api-create__form" @submit.prevent="createApi">
				<v-text-field
					v-model="form.name"
					label="API name"
					hide-details
					outlined
					dense
				/>
				<v-btn type="submit" :class="[$vuetify.rtl ? 'mr-1' : 'ml-1']">
					Создать
				</v-btn>
			</v-form>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'UserApiCreate',

	data() {
		return {
			form: {
				name: '',
				abilities: "'trading','withdraw'",
			},
		};
	},

	methods: {
		createApi(event) {
			axios.post('/trader/ext/new_api_token', this.form).then(response => {
				console.log(response.data);
			});
		},
	},
};
</script>

<style lang="sass" scoped>
.user-api-create
	&__form
		display: flex
		align-items: center

	::v-deep.v-input
		display: inline-flex
		max-width: 20%
	::v-deep.v-btn
		display: inline-flex
</style>
