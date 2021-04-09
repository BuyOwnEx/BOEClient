<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on, attrs }">
			<v-list-item v-bind="attrs" v-on="on">
				<span>{{ $t('common.replenish') }}</span>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title">
				{{ $t('balance.replenishment') }}
			</v-card-title>

			<CommonLoading v-if="!address" class="mb-6" />
			<v-card-text v-else class="common-dialog__content">
				<div>
					<div>
						{{ $t('balance.min_replenish_amount') }}:
						<b>
							{{ currencyObject.minReplenish }} {{ currencyObject.currency }}
						</b>
					</div>

					<div>
						{{ $t('balance.replenish_fee') }}:
						<b>{{ currencyObject.fee }} {{ currencyObject.currency }}</b>
					</div>
				</div>

				<v-text-field
					v-model="amount"
					class="my-1"
					:placeholder="$t('common.amount')"
					:suffix="currencyObject.currency"
					dense
				/>

				<div class="text-center">
					<QrCode :value="address" :options="{ width: 200 }" />
				</div>

				<div class="text-center">{{ address }}</div>
			</v-card-text>

			<v-divider />

			<v-card-actions class="common-dialog__actions">
				<v-spacer />
				<v-btn small tile text plain @click="close">
					{{ $t('common.cancel') }}
				</v-btn>
				<v-spacer />
				<v-btn
					class="text-uppercase"
					color="primary"
					small
					tile
					text
					plain
					@click="confirm"
				>
					{{ $t('common.replenish') }}
				</v-btn>
				<v-spacer />
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import QrCode from '@chenfengyuan/vue-qrcode';
import CommonDialog from '../../common/CommonDialog';
import CommonLoading from '../../common/CommonLoading';

export default {
	name: 'BalanceCommonDialogReplenish',

	components: { CommonLoading, CommonDialog, QrCode },

	props: {
		address: {
			type: String,
			default: '',
		},
		currencyObject: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			amount: null,
			dialog: false,
		};
	},

	watch: {
		dialog(val) {
			if (val) this.$emit('closeMenu');
		},
	},

	methods: {
		confirm() {
			console.log('confirm');
		},
		close() {
			this.dialog = false;
		},

		closeMenu() {
			this.$emit('closeMenu');
		},
	},
	mounted() {
		axios.get('/trader/ext/get_address',{
			params: {currency:this.currencyObject.currency.toUpperCase()},
		}).then(response => {
			console.log(response);
		});
	}
};
</script>
