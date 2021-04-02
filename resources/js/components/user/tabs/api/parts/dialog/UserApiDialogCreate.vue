<template>
	<v-dialog v-model="dialog" width="400" :persistent="!!token">
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

			<div v-if="!token">
				<v-card-text class="pt-1">
					<v-form v-model="valid" ref="form">
						<v-text-field
							v-model="form.name"
							class="common-dialog__content"
							counter="64"
							placeholder="API name"
							:rules="[rules.required, rules.max64char]"
							dense
							autofocus
						/>

						<v-checkbox
							v-model="form.abilities"
							:ripple="false"
							value="trading"
							hide-details
							dense
							label="Торговля"
						/>
						<v-checkbox
							v-model="form.abilities"
							:ripple="false"
							value="withdraw"
							hide-details
							dense
							label="Вывод средств"
						/>
					</v-form>
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
						color="primary"
						small
						tile
						text
						plain
						@click="create"
					>
						Создать
					</v-btn>
					<v-spacer />
				</v-card-actions>
			</div>

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

			form: {
				name: '',
				abilities: [],
			},
		};
	},

	watch: {
		dialog(value) {
			if (value === true) {
				this.$nextTick(() => {
					this.form.name = '';
					this.form.abilities = [];
					this.$refs.form.resetValidation();
				});
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

				const { data } = await axios.post(
					'/trader/ext/new_api_token',
					this.form
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
