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
			<v-card-title class="common-dialog__title">
				{{ $t('common.withdrawal_funds') }} {{ currency }}
			</v-card-title>

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
									alert alert alert alert alert
								</BalanceFiatDialogAlert>

								<div class="py-2">
									для вывода средств... для вывода средств... для вывода
									средств... для вывода средств...
								</div>

								<div
									v-if="selectedSystem"
									class="balance-fiat-dialog-withdraw__withdraw-info"
								>
									<div>
										Текущий баланс:
										<b>{{ currencyObj.safe }} {{ currency }}</b>
									</div>
									<div>
										Мин. сумма:
										<b>{{ selectedSystem.minWithdraw }} {{ currency }}</b>
									</div>
									<div>
										Макс. сумма:
										<b>{{ selectedSystem.maxWithdraw }} {{ currency }}</b>
									</div>
									<div>
										Комиссия:
										<b>{{ selectedSystem.withdrawFee }} {{ currency }}</b>
									</div>
									<div>
										Вы получите:
										<b>{{ totalAmount }} {{ currency }}</b>
									</div>
								</div>

								<v-form v-model="valid">
									<v-select
										v-model="selectedCurrency"
										:placeholder="$t('balance.currency')"
										hide-details
									/>

									<v-text-field
										v-model="amount"
										type="number"
										:rules="amountRules"
										:placeholder="$t('balance.amount')"
										:suffix="currency"
										autofocus
										@keydown="passNumbers"
										@paste.prevent
									/>

									<v-select
										v-model="selectedMethodID"
										:placeholder="$t('balance.amount')"
										hide-details
									/>

									<v-text-field
										v-model="phone"
										type="number"
										:placeholder="$t('balance.amount')"
										@keydown="passNumbers"
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
import BalanceFiatDialogSelectSystem from './parts/BalanceFiatDialogSelectSystem';
import BalanceFiatDialogAlert from './parts/BalanceFiatDialogAlert';

import loadingMixin from '../../../../mixins/common/loadingMixin';
import passNumberMixin from '../../../../mixins/common/passNumberMixin';

export default {
	name: 'BalanceFiatDialogWithdraw',

	components: { BalanceFiatDialogSelectSystem, BalanceFiatDialogAlert },

	mixins: [loadingMixin, passNumberMixin],

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
			selectedCurrency: this.currencyObj.currency,
			selectedMethodID: 1,
			phone: '',

			amountRules: [
				v =>
					!v ||
					v >= this.minWithdraw ||
					this.$t('balance.stepper.withdrawal_params.less_min'),
				v =>
					!v ||
					v <= this.maxWithdraw ||
					this.$t('balance.stepper.withdrawal_params.more_max'),
			],
			valid: false,

			dialog: false,
			step: 1,
		};
	},

	computed: {
		totalAmount() {
			const total = Number(this.amount) - this.selectedSystem?.withdrawFee;
			if (!total || total < 0) return 0;
			return total;
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

	watch: {
		dialog(val) {
			if (val) {
				this.closeMenu();
				this.clearData();
			}
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
		close() {
			this.dialog = false;
		},
		closeMenu() {
			this.$emit('close-menu');
		},
	},
};
</script>
