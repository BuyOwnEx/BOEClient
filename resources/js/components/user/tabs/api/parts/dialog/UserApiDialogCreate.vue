<template>
	<v-dialog v-model="dialog" width="400">
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				small
				tile
				:class="[$vuetify.rtl ? 'ml-1' : 'mr-1']"
				:loading="creating"
				color="success"
				v-bind="attrs"
				v-on="on"
			>
				Создать API
			</v-btn>
		</template>

		<v-card class="user-api-dialog-create">
			<v-card-title class="common-dialog__title common-dialog__title--success">
				Создать API
			</v-card-title>

			<v-form
				v-model="valid"
				ref="form"
				class="common-dialog__content"
				@submit.prevent="create"
			>
				<v-card-text>
					<v-text-field
						v-model="form.name"
						class="mt-0"
						label="API name"
						counter="64"
						:rules="[rules.required, rules.max64char]"
						dense
						autofocus
					/>

					<v-checkbox
						v-model="trading"
						:ripple="false"
						hide-details
						dense
						label="Торговля"
					/>
					<v-checkbox
						v-model="withdraw"
						:ripple="false"
						hide-details
						dense
						label="Вывод средств"
					/>
				</v-card-text>

				<v-divider />

				<v-card-actions class="common-dialog__actions">
					<v-spacer />

					<v-btn small tile text plain @click="close">
						Закрыть
					</v-btn>

					<v-spacer />

					<v-btn
						:loading="creating"
						type="submit"
						color="primary"
						small
						tile
						text
						plain
					>
						Создать
					</v-btn>

					<v-spacer />
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
import formValidationRules from '../../../../../../mixins/common/formValidationRules';

export default {
	name: 'UserApiDialogCreate',

	mixins: [formValidationRules],

	data() {
		return {
			dialog: false,
			creating: false,
			valid: false,

			trading: false,
			withdraw: false,

			form: {
				name: '',
			},
		};
	},

	computed: {
		enabledAbilities() {
			const result = [];

			if (this.trading) result.push('trading');
			if (this.withdraw) result.push('withdraw');

			return result;
		},
	},

	methods: {
		async create() {
			if (this.form.name.trim() === '' || !this.valid) {
				this.close();
				return;
			}

			try {
				this.startLoading();

				const formData = {
					...this.form,
					abilities: this.enabledAbilities,
				};

				const { data } = await axios.post(
					'/trader/ext/new_api_token',
					formData
				);

				this.$emit('create', data.data.accessToken);
				this.close();
			} catch (e) {
				console.error(e);
			} finally {
				this.stopLoading();
			}
		},

		startLoading() {
			this.creating = true;
		},
		stopLoading() {
			this.creating = false;
		},
		close() {
			this.dialog = false;
			this.$refs.form.reset();
		},
	},
};
</script>

<style lang="sass" scoped>
.user-api-dialog-create
	::v-deep.v-input--checkbox
		margin-top: 0
</style>
