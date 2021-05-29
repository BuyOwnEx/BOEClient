<template>
	<v-dialog v-model="dialog" width="800">
		<template #activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.replenish') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title">
				{{ $t('common.replenishment_funds') }} {{ currency }}
			</v-card-title>

			<v-card-text class="common-dialog__content pb-1">
				<v-stepper v-model="step">
					<v-stepper-items>
						<v-stepper-content step="1">
							<BalanceFiatDialogSelectSystem
								class="mb-6"
								:systems-data="currencyObj.payment_systems"
								type="replenish"
								@select="selectPaymentSystem"
							/>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn block plain tile text small @click="close">
									{{ $t('common.close') }}
								</v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>

						<v-stepper-content step="2">
							<div class="mb-6">
								<BalanceFiatDialogAlert>
									{{ $t('balance.dialog.fiat_replenishment_alert') }}
								</BalanceFiatDialogAlert>

								<div
									v-if="selectedSystem"
									class="balance-fiat-dialog-replenish__replenish-info pt-2"
								>
									{{
										$t('balance.dialog.fiat_replenishment_description', {
											payment: selectedSystem.name,
										})
									}}
								</div>

								<v-form>
									<v-text-field
										v-model="amount"
										:placeholder="$t('balance.amount')"
										:suffix="currency"
										autofocus
										@keydown="validateNumber"
										@paste.prevent
									/>
								</v-form>
							</div>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn plain tile text small @click="back">
									{{ $t('common.back') }}
								</v-btn>
								<v-spacer />
								<v-btn
									:loading="loading"
									:disabled="!amount.trim()"
									color="primary"
									tile
									text
									plain
									small
									@click="replenish"
								>
									{{ $t('common.replenish') }}
								</v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import BalanceFiatDialogSelectSystem from './parts/BalanceFiatDialogSelectSystem';
import BalanceFiatDialogAlert from './parts/BalanceFiatDialogAlert';

import loadingMixin from '../../../../mixins/common/loadingMixin';
import validateInputMixin from '../../../../mixins/common/validateInputMixin';
import dialogMethodsMixin from '../../../../mixins/common/dialogMethodsMixin';

export default {
	name: 'BalanceFiatDialogReplenish',

	components: { BalanceFiatDialogSelectSystem, BalanceFiatDialogAlert },

	mixins: [loadingMixin, validateInputMixin, dialogMethodsMixin],

	props: {
		currencyObj: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			selectedSystem: null,
			amount: '',

			step: 1,
		};
	},

	computed: {
		totalAmount() {
			const total = Number(this.amount) - this.selectedSystem?.withdrawFee;
			return total || 0;
		},

		minWithdraw() {
			return this.selectedSystem?.minWithdraw;
		},
		maxWithdraw() {
			return Math.min(this.selectedSystem?.maxWithdraw, this.currencyObj.safe);
		},
		currency() {
			return this.currencyObj.currency;
		},
	},

	methods: {
		replenish() {
			try {
				this.startLoading();
			} finally {
				this.stopLoading();
			}
		},
		selectPaymentSystem(system) {
			this.selectedSystem = system;
			this.step++;
		},

		back() {
			this.step--;
		},
		clearData() {
			this.amount = '';
			this.selectedSystem = null;
			this.step = 1;
		},
	},
};
</script>
