<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.replenish') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title">
				{{ $t('common.replenishment_funds') }} {{ currencyObj.currency }}
			</v-card-title>

			<CommonLoading v-if="!currencyObj.address" class="mb-6" />
			<v-card-text v-else class="common-dialog__content">
				<div>
					<div>
						{{ $t('balance.min_replenish_amount') }}:
						<b> {{ currencyObj.minReplenish }} {{ currencyObj.currency }} </b>
					</div>

					<div>
						{{ $t('balance.replenish_fee') }}:
						<b>0 {{ currencyObj.currency }}</b>
					</div>
				</div>

				<v-text-field
					v-model="amount"
					class="my-1"
					:placeholder="$t('common.amount')"
					:suffix="currencyObj.currency"
					dense
				/>

				<div class="text-center">
					<QrCode :value="currencyObj.address" :options="{ width: 200 }" />
				</div>

				<div class="text-center pt-1">{{ currencyObj.address }}</div>
			</v-card-text>

			<v-divider />

			<v-card-actions class="common-dialog__actions">
				<v-btn
					class="text-uppercase"
					small
					tile
					text
					plain
					block
					@click="close"
				>
					{{ $t('common.close') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import QrCode from '@chenfengyuan/vue-qrcode';
import CommonLoading from '../../../common/CommonLoading';

export default {
	name: 'BalanceCryptoDialogReplenish',

	components: { CommonLoading, QrCode },

	props: {
		currencyObj: {
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
			if (val) this.closeMenu();
		},
	},

	methods: {
		close() {
			this.dialog = false;
		},
		closeMenu() {
			this.$emit('close-menu');
		},
	},

	created() {
		axios
			.get('/trader/ext/get_address', {
				params: { currency: this.currencyObj.currency.toUpperCase() },
			})
			.then(response => {
				console.log(response);
			});
	},
};
</script>
