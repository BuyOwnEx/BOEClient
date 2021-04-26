<template>
	<v-dialog v-model="dialog" width="800">
		<template v-slot:activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.withdraw') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title"> {{ $t('common.withdrawal_funds') }} {{ currency }} </v-card-title>

			<v-card-text class="common-dialog__content pb-1">
				<v-stepper v-model="step">
					<v-stepper-items>
						<v-stepper-content step="1">
							<BalanceFiatDialogSelectSystem
								class="mb-6"
								:systems-data="currencyObj.payment_systems"
								type="withdraw"
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
									{{ $t('balance.dialog.fiat_withdrawal_alert') }}
								</BalanceFiatDialogAlert>

								<div v-if="selectedSystem" class="balance-fiat-dialog-withdraw__withdraw-info">
									<div class="py-2">
										{{
											$t('balance.dialog.fiat_withdrawal_description', {
												payment: selectedSystem.name,
											})
										}}
									</div>

									<div>
										{{ $t('balance.current_balance') }}:
										<b class="clickable dashed non-selectable" @click="setCurrentBalance">
											{{ currencyObj.safe }} {{ currency }}
										</b>
									</div>

									<div>
										{{ $t('balance.min_amount') }}:
										<b>{{ selectedSystem.minWithdraw }} {{ currency }}</b>
									</div>

									<div>
										{{ $t('balance.max_amount') }}:
										<b>{{ selectedSystem.maxWithdraw }} {{ currency }}</b>
										<small>
											({{ $t('balance.stepper.withdrawal_params.used_day_limit') }}: {{ currencyObj.daily }}
											{{ currency }})
										</small>
									</div>

									<div>
										{{ $t('balance.fee') }}:
										<b>{{ selectedSystem.withdrawFee }} {{ currency }}</b>
									</div>

									<div>
										{{ $t('balance.you_get') }}:
										<b>{{ totalAmount }} {{ currency }}</b>
									</div>

									<div>
										{{ $t('balance.stepper.withdrawal_params.available_for_withdraw') }}:
										<b class="clickable non-selectable dashed" @click="setAvailableForWithdrawAmount">
											{{ availableForWithdraw }}
											{{ currency }}
										</b>
									</div>
								</div>

								<v-form v-model="valid">
									<v-text-field
										v-model="amount"
										:rules="amountRules"
										:placeholder="$t('balance.amount')"
										:suffix="currency"
										autofocus
										@keydown="validateNumber"
										@paste.prevent
									/>

									<v-select v-model="selectedMethodID" :placeholder="$t('balance.amount')" hide-details />

									<v-text-field v-model="phone" :placeholder="$t('balance.amount')" />
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
									@click="withdraw"
								>
									{{ $t('common.withdraw') }}
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
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import BalanceFiatDialogSelectSystem from './parts/BalanceFiatDialogSelectSystem';
import BalanceFiatDialogAlert from './parts/BalanceFiatDialogAlert';

import loadingMixin from '../../../../mixins/common/loadingMixin';
import validateInputMixin from '../../../../mixins/common/validateInputMixin';
import dialogMethodsMixin from '../../../../mixins/common/dialogMethodsMixin';

export default {
	name: 'BalanceFiatDialogWithdraw',

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
			selectedMethodID: 1,
			phone: '',

			amountRules: [
				v => !v || v >= this.minWithdraw || this.$t('balance.less_min'),
				v => !v || v <= this.maxWithdraw || this.$t('balance.more_max'),
				v => !v || v <= this.currencyObj.safe || this.$t('balance.more_available'),
				v => !v || v <= this.availableForWithdraw || this.$t('balance.more_withdraw_available'),
			],
			valid: false,
			step: 1,
		};
	},

	computed: {
		totalAmount() {
			const total = Number(this.amount) - this.selectedSystem?.withdrawFee;
			if (!total || total < 0) return 0;
			return total;
		},
		availableForWithdraw() {
			return BigNumber.min(this.availableForUser, this.maxAvailable);
		},

		minWithdraw() {
			return this.selectedSystem?.minWithdraw;
		},
		maxWithdraw() {
			return this.selectedSystem?.maxWithdraw;
		},
		currency() {
			return this.currencyObj.currency;
		},
		safe() {
			return BigNumber(this.currencyObj.safe || 0);
		},
		fee() {
			return BigNumber(this.currencyObj.feeWithdraw);
		},
		daily() {
			return BigNumber(this.currencyObj.daily);
		},
		availableForUser() {
			return this.safe.minus(this.fee).gt(0) ? this.safe.minus(this.fee) : BigNumber(0);
		},
		maxAvailable() {
			return BigNumber(this.maxWithdraw).minus(this.daily);
		},
	},

	methods: {
		withdraw() {
			try {
				this.startLoading();
			} finally {
				this.stopLoading();
			}
		},

		setCurrentBalance() {
			this.amount = this.currencyObj.safe.toString();
		},
		setAvailableForWithdrawAmount() {
			this.amount = this.availableForWithdraw.toString();
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
			this.selectedMethodID = 1;
			this.phone = '';
			this.step = 1;
		},
	},
};
</script>
