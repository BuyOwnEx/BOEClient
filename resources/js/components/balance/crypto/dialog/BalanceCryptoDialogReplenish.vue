<template>
	<v-dialog v-model="dialog" width="500">
		<template #activator="{ on, attrs }">
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

      <v-card-text class="common-dialog__content pb-1">
        <v-stepper v-model="step">
          <v-stepper-items>
            <v-stepper-content class="pa-0" step="1">
              <BalanceCryptoDialogSelectSystem
                  class="mb-2"
                  :platforms="currencyObj.platforms"
                  type="replenish"
                  @select="selectPlatform"
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

            <v-stepper-content class="pa-0" step="2">
              <CommonLoading v-if="!selectedPlatform" class="mb-6" />
              <v-card-text v-else class="common-dialog__content">
                <div>
                  <div>
                    {{ $t('balance.min_replenish_amount') }}:
                    <b> {{ selectedPlatform.minReplenish }} {{ selectedPlatform.currency }} </b>
                  </div>

                  <div>
                    {{ $t('balance.replenish_fee') }}:
                    <b>0 {{ selectedPlatform.currency }}</b>
                  </div>
                </div>

                <div class="py-2 error--text">
                  {{$t('balance.replenish_crypto_description', [selectedPlatform.platform !== null ? selectedPlatform.platform : selectedPlatform.base_currency])}}
                </div>

                <div class="text-center">
                  <QrCode :value="address" :options="{ width: 200 }" />
                </div>

                <div class="text-center pt-1">
                  <CommonCopyLabel :text="address" icon="mdi-content-copy" />
                </div>
              </v-card-text>

              <v-divider />

              <div class="common-dialog__actions d-flex pt-1">
                <v-spacer />
                <v-btn plain tile text small @click="back">
                  {{ $t('common.back') }}
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

import QrCode from '@chenfengyuan/vue-qrcode';
import CommonLoading from '../../../common/CommonLoading';
import CommonCopyLabel from '../../../common/CommonCopyLabel';
import dialogMethodsMixin from '../../../../mixins/common/dialogMethodsMixin';
import BalanceCryptoDialogSelectSystem from './parts/BalanceCryptoDialogSelectSystem';
import { mapActions } from 'vuex';

export default {
	name: 'BalanceCryptoDialogReplenish',

	components: { BalanceCryptoDialogSelectSystem, CommonLoading, CommonCopyLabel, QrCode },

	mixins: [dialogMethodsMixin],

	props: {
		currencyObj: {
			type: Object,
			required: true,
		},
	},

  data() {
    return {
      selectedPlatform: null,
      step: 1,
    };
  },

	computed: {
		address() {
			return this.selectedPlatform ? this.selectedPlatform.address : '-';
		},
	},

	methods: {
    ...mapActions({
      getAddressStore: 'balance/getAddress',
    }),
    selectPlatform(platform) {
      this.selectedPlatform = platform;
      this.getAddressStore(this.selectedPlatform);
      this.step++;
    },
    back() {
      this.step--;
    },
	},
};
</script>
