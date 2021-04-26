<template>
	<v-dialog v-model="dialog" width="400" :persistent="Boolean(token)">
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				:class="[$vuetify.rtl ? 'ml-1' : 'mr-1']"
				color="success"
				v-bind="attrs"
				v-on="on"
				small
				tile
			>
				{{ $t('user.api.dialog.create.title') }}
			</v-btn>
		</template>

		<v-card class="user-api-dialog-create">
			<v-card-title class="common-dialog__title common-dialog__title--success">
				{{ $t('user.api.dialog.create.title') }}
			</v-card-title>

			<div v-show="!token">
				<v-card-text class="pt-1">
					<v-form v-model="valid" ref="form">
						<v-text-field
							v-model="form.name"
							class="common-dialog__content"
							counter="64"
							:placeholder="$t('user.api.dialog.create.api_name')"
							:rules="[rules.max64char]"
							dense
							autofocus
						/>

						<v-checkbox
							v-model="form.abilities"
							:ripple="false"
							:label="$t('menu.trading')"
							value="trading"
							hide-details
							dense
						/>
						<v-checkbox
							v-model="form.abilities"
							:ripple="false"
							:label="$t('common.withdrawal_funds')"
							value="withdraw"
							hide-details
							dense
						/>
					</v-form>
				</v-card-text>

				<v-divider />

				<v-card-actions class="common-dialog__actions">
					<v-spacer />
					<v-btn small tile text plain @click="close">
						{{ $t('common.close') }}
					</v-btn>
					<v-spacer />
					<v-btn
						:loading="loading"
						:disabled="emptyName"
						color="primary"
						small
						tile
						text
						plain
						@click="create"
					>
						{{ $t('common.create') }}
					</v-btn>
					<v-spacer />
				</v-card-actions>
			</div>

			<div v-show="token">
				<v-card-text>
					<div>
						{{ $t('user.api.dialog.create.copy_tokens_description') }}
					</div>
					<div class="pt-2">
						<span class="user-api-dialog-create__token-name">
							{{ $t('user.api.dialog.create.api_key') }}:
						</span>
						<div class="user-api-dialog-create__token">
							<CommonCopyLabel :text="token" />
						</div>
					</div>
					<div class="pt-1">
						<span class="user-api-dialog-create__token-name">
							{{ $t('user.api.dialog.create.secret_key') }}:
						</span>
						<div class="user-api-dialog-create__token">
							<CommonCopyLabel :text="secretToken" />
						</div>
					</div>
				</v-card-text>

				<v-card-actions class="common-dialog__actions">
					<v-spacer />
					<v-btn small tile text plain @click="close">
						{{ $t('common.close') }}
					</v-btn>
					<v-spacer />
				</v-card-actions>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import CommonCopyLabel from '../../../../common/CommonCopyLabel';

import formValidationRules from '../../../../../mixins/common/formValidationRules';
import loadingMixin from '../../../../../mixins/common/loadingMixin';
import showNotificationMixin from '../../../../../mixins/common/showNotificationMixin';
import dialogMethodsMixin from '../../../../../mixins/common/dialogMethodsMixin';

export default {
	name: 'UserApiDialogCreate',

	components: { CommonCopyLabel },

	mixins: [formValidationRules, loadingMixin, showNotificationMixin, dialogMethodsMixin],

	data() {
		return {
			valid: false,

			token: null,
			secretToken: null,

			form: {
				name: '',
				abilities: [],
			},
		};
	},

	computed: {
		emptyName() {
			return !this.form.name.trim();
		},
	},

	methods: {
		async create() {
			if (!this.valid) {
				this.close();
				this.pushErrorNotification(_, 'incorrect');
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
			} finally {
				this.stopLoading();
			}
		},

		clearData() {
			this.form.name = '';
			this.form.abilities = [];
			this.token = null;
			this.secretToken = null;
		}
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
