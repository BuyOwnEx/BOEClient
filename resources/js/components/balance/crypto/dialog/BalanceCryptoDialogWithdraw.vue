<template>
	<v-dialog v-model="dialog" width="1200">
		<template v-slot:activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.withdraw') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title">
				{{ $t('common.withdrawal_funds') }}
			</v-card-title>

			<v-card-text class="common-dialog__content">
				<v-stepper v-model="e1">
					<v-stepper-header>
						<v-stepper-step :complete="isAddressValidated" step="1">
							{{ $t('balance.stepper.address_validation.title') }}
						</v-stepper-step>

						<v-divider />

						<v-stepper-step :complete="e1 > 2" step="2">
							{{ $t('balance.stepper.withdrawal_params.title') }}
						</v-stepper-step>

						<v-divider />

						<v-stepper-step step="3">
							{{ $t('balance.stepper.confirmation.title') }}
						</v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1">
							<div class="mb-6">
								<div>
									{{ $t('balance.stepper.address_validation.description') }}
								</div>

								<v-text-field
									v-model="address"
									:hint="$t('balance.stepper.address_validation.address_hint')"
									:placeholder="
										$t('balance.stepper.address_validation.address')
									"
									persistent-hint
								/>
							</div>

							<div class="d-flex">
								<v-spacer />
								<v-btn plain tile text>{{ $t('common.cancel') }}</v-btn>
								<v-spacer />
								<v-btn
									:loading="addressLoading"
									color="primary"
									tile
									@click="validateAddress"
								>
									{{ $t('common.continue') }}
								</v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>

						<v-stepper-content step="2">
							<v-card
								class=" mb-6"
								color="grey lighten-1"
								height="200px"
							></v-card>

							<v-btn color="primary" @click="e1 = 3">
								{{ $t('common.continue') }}
							</v-btn>

							<v-btn text>{{ $t('common.cancel') }}</v-btn>
						</v-stepper-content>

						<v-stepper-content step="3">
							<v-card
								class=" mb-6"
								color="grey lighten-1"
								height="200px"
							></v-card>

							<v-btn color="primary" @click="e1 = 1">
								{{ $t('common.continue') }}
							</v-btn>

							<v-btn text>{{ $t('common.cancel') }}</v-btn>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
	name: 'BalanceCryptoDialogWithdraw',

	props: {
		currencyObj: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			address: '',
			addressLoading: false,

			dialog: false,
			e1: 1,
		};
	},

	computed: {
		...mapState('balance', ['isAddressValidated']),
	},

	watch: {
		dialog(val) {
			if (val) {
				this.closeMenu();
				this.address = '';
			}
		},
	},

	methods: {
		...mapActions({
			validateAddressStore: 'balance/validateAddress',
		}),

		async validateAddress() {
			this.addressLoading = true;
			const payload = {
				currency: this.currencyObj.currency,
				address: this.address,
			};
			await this.validateAddressStore(payload);
		},

		close() {
			this.dialog = false;
		},
		closeMenu() {
			this.$emit('close-menu');
		},
	},
};
</script>
