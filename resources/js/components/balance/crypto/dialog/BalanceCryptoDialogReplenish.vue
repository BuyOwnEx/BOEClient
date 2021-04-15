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

				<div class="py-2">
					описание
				</div>

				<div class="text-center">
					<QrCode :value="address" :options="{ width: 200 }" />
				</div>

				<div class="text-center pt-1">
					<CommonCopyLabel :text="address" icon="mdi-content-copy" />
				</div>
			</v-card-text>

			<v-divider />

			<v-card-actions class="common-dialog__actions">
				<v-btn small tile text plain block @click="close">
					{{ $t('common.close') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import QrCode from '@chenfengyuan/vue-qrcode';
import CommonLoading from '../../../common/CommonLoading';
import CommonCopyLabel from '../../../common/CommonCopyLabel';

export default {
	name: 'BalanceCryptoDialogReplenish',

	components: { CommonLoading, CommonCopyLabel, QrCode },

	props: {
		currencyObj: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			dialog: false,
		};
	},

	computed: {
		address() {
			return this.currencyObj.address;
		},
	},

	watch: {
		dialog(val) {
			if (val) this.closeMenu();
		},
	},

	methods: {
		...mapActions({
			getAddressStore: 'balance/getAddress',
		}),

		close() {
			this.dialog = false;
		},
		closeMenu() {
			this.$emit('close-menu');
		},
	},

	created() {
		this.getAddressStore(this.currencyObj.currency);
	},
};
</script>
