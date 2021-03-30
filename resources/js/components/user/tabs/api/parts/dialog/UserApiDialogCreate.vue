<template>
	<v-dialog v-model="dialog" width="400">
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				:class="[$vuetify.rtl ? 'ml-1' : 'mr-1']"
				color="success"
				v-bind="attrs"
				v-on="on"
				small
				tile
			>
				Создать API
			</v-btn>
		</template>

		<v-card class="user-api-dialog-create">
			<v-card-title class="common-dialog__title common-dialog__title--success">
				Создать API
			</v-card-title>

			<v-form
				v-show="!token"
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
						:loading="loading"
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

			<div v-show="token">
				<v-card-text>
					<div>
						Скопируйте данные АПИ ключи, поскольку при закрытии диалогового окна
						API Key будет отображен как SHA 256 хэш, а Secret Key будет скрыт
					</div>
					<div class="pt-2">
						<span class="user-api-dialog-create__token-name">API Key: </span>
						<div class="user-api-dialog-create__token">
							<CopyLabel :text="token" />
						</div>
					</div>
					<div class="pt-1">
						<span class="user-api-dialog-create__token-name">Secret Key: </span>
						<div class="user-api-dialog-create__token">
							<CopyLabel :text="secretToken" />
						</div>
					</div>
				</v-card-text>

				<v-card-actions class="common-dialog__actions">
					<v-spacer />
					<v-btn small tile text plain @click="close">
						Закрыть
					</v-btn>
					<v-spacer />
				</v-card-actions>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import CopyLabel from '../../../../../common/CopyLabel';

import formValidationRules from '../../../../../../mixins/common/formValidationRules';
import loadingMixin from '../../../../../../mixins/common/loadingMixin';

export default {
	name: 'UserApiDialogCreate',

	components: { CopyLabel },

	mixins: [formValidationRules, loadingMixin],

	data() {
		return {
			dialog: false,
			valid: false,

			token: null,
			secretToken: null,

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

	watch: {
		dialog(value) {
			if (value === true) {
				this.form.name = '';
				this.trading = false;
				this.withdraw = false;
				if (this.$refs.form) this.$refs.form.resetValidation();
			}
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

				this.token = data.data.plainTextToken;
				this.secretToken = data.data.plainTextSecretToken;

				this.$emit('create', data.data.accessToken);
			} catch (e) {
				console.error(e);
			} finally {
				this.stopLoading();
			}
		},

		close() {
			this.dialog = false;
			setTimeout(() => {
				this.token = null;
				this.secretToken = null;
			}, 200);
		},
	},
};
</script>

<style lang="sass" scoped>
.user-api-dialog-create
	&__token
		word-break: break-all
	&__token-name
		font-weight: 600

	::v-deep.v-input--checkbox
		margin-top: 0
</style>
