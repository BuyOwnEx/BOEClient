<template>
	<v-dialog v-model="dialog" width="800">
		<template v-slot:activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.cancel') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title"> {{ $t('common.confirmation') }} </v-card-title>

			<v-card-text class="common-dialog__content">
				{{
					$t('balance.dialog.cancel_withdrawal_description', {
						amount,
						currency,
					})
				}}
			</v-card-text>

			<v-card-actions class="common-dialog__actions">
				<v-spacer />

				<v-btn plain tile text small @click="close">
					{{ $t('common.close') }}
				</v-btn>
				<v-spacer />
				<v-btn color="primary" :loading="loading" plain tile text small @click="confirm">
					{{ $t('common.confirm') }}
				</v-btn>

				<v-spacer />
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import loadingMixin from '../../../mixins/common/loadingMixin';
import dialogMethodsMixin from '../../../mixins/common/dialogMethodsMixin';

export default {
	name: 'WithdrawCancel',

	mixins: [loadingMixin, dialogMethodsMixin],

	props: {
		withdrawObj: {
			type: Object,
			required: true,
		},
		isCrypto: {
			type: Boolean,
			required: true,
		},
	},

	computed: {
		currency() {
			return this.withdrawObj.currency;
		},
		amount() {
			return this.withdrawObj.amount;
		},
	},

	methods: {
		...mapMutations({
			updateCurrencyAmountStore: 'user/UPDATE_CURRENCY_AMOUNT',
		}),
		...mapActions({
			cancelCryptoWithdrawalStore: 'balance/cancelCryptoWithdrawal',
			cancelFiatWithdrawalStore: 'balance/cancelFiatWithdrawal',
		}),

		async confirm() {
			try {
				this.startLoading();

				const ID = this.withdrawObj.id;
				const isSuccess = await this.cancelWithdrawal(ID);

				if (isSuccess) {
					this.$emit('cancel', ID);
					this.updateCurrencyAmountStore({ currency: this.currency, amount: this.amount });
					this.close();
				}
			} finally {
				this.stopLoading();
			}
		},

		async cancelWithdrawal(ID) {
			return this.isCrypto ? await this.cancelCryptoWithdrawalStore(ID) : await this.cancelFiatWithdrawalStore(ID);
		},
	},
};
</script>
