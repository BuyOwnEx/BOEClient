<template>
  <v-card class="user-verification-tab fill-height d-flex flex-column">
    <v-card-text class="d-flex flex-column flex-grow-1" v-if="loaded">
      <v-row class="d-flex flex-grow-1 justify-space-between" v-if="kyc_state === null || (kyc_state === 'rejected' && !is_verified)">
        <v-col class="pb-1 pt-1" cols="12" md="5">
          <v-card flat class="user-account-tab-verification-description">
            <v-card-title>{{ $t('kyc.manual.legal.title') }}</v-card-title>
            <v-card-subtitle class="pb-0">
              <span class="font-italic caption">{{ $t('kyc.manual.legal.description') }}</span>
            </v-card-subtitle>
          </v-card>
          <v-card flat>
            <v-card-text>
              <v-form v-model="isValidCompRequestForm">
                <v-select
                    v-if="resident === 'non_resident'"
                    v-model="comp_data.country"
                    :items="countries_available"
                    :item-text="(item) => { return $t('countries.'+item.iso.toLowerCase())}"
                    item-value="iso"
                    :label="$t('kyc.country')"
                    :hint="$t('kyc.select_resident_country')"
                    :rules="[rules.required]"
                    autofocus
                    persistent-hint
                    hide-details="auto"
                    required
                    class="required mb-2"
                >
                  <template #item="{item, on, attr}">
                    <v-list-item v-bind="attr" v-on="on">
                      <v-list-item-icon>
                        <v-img
                            class="elevation-0 d-inline-flex"
                            style="vertical-align: middle"
                            :src="item.logo"
                            max-height="16"
                            max-width="16"
                        ></v-img>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="$t('countries.'+item.iso.toLowerCase())"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{item}">
                    <v-img
                        class="elevation-0 d-inline-flex"
                        style="vertical-align: middle"
                        :src="item.logo"
                        max-height="16"
                        max-width="16"
                    ></v-img>
                    <span class="ml-1">{{ $t('countries.'+item.iso.toLowerCase()) }}</span>
                  </template>
                </v-select>

                <v-text-field
                    class="mb-1 pt-1"
                    v-model="comp_data.name"
                    :label="getCompNameLabel"
                    :hint="getCompNameHint"
                    :rules="compNameRules"
                    persistent-hint
                    outlined
                />

                <v-text-field
                    v-model="comp_data.reg_number"
                    :label="getCompRegNoLabel"
                    :hint="getCompRegNoHint"
                    :rules="regNoRules"
                    v-mask="document_mask"
                    :error-messages="errors.reg_number"
                    persistent-hint
                    clearable
                    required
                    class="required mb-1"
                    @input="errors.reg_number = []"
                >
                </v-text-field>

                <v-text-field
                    v-model="comp_data.tax_number"
                    :label="$t('kyc.manual.legal.form.inn')"
                    :hint="$t('kyc.manual.legal.hints.inn')"
                    :rules="taxNoRules"
                    v-mask="tax_id_mask"
                    :error-messages="errors.tax_number"
                    persistent-hint
                    clearable
                    required
                    class="required mb-1"
                    @input="errors.tax_number = []"
                >
                </v-text-field>

                <v-text-field
                    v-model="comp_data.address"
                    :label="$t('kyc.manual.legal.form.address')"
                    :hint="$t('kyc.manual.legal.hints.address')"
                    :rules="[rules.required]"
                    :error-messages="errors.address"
                    persistent-hint
                    clearable
                    required
                    class="required mb-1"
                    @input="errors.address = []"
                />

                <v-file-input
                    v-model="comp_data.file_doc"
                    :label="getFileDocLabel"
                    :hint="getFileDocHint"
                    :accept="getFileDocAccept"
                    :prepend-icon="getFileDocIcon"
                    :error-messages="errors.file_doc"
                    @input="errors.file_doc = []"
                    @change="errors.file_doc = []"
                    :rules="product.kybLocalUploadType === 'letter' ? [rules.required, rules.maxFileSize2MB] : [rules.required, rules.maxFileSize15MB]"
                    persistent-hint
                    clearable
                    required
                    class="required"
                ></v-file-input>
              </v-form>
            </v-card-text>
          </v-card>
          <v-card flat>
            <v-card-actions class="common-dialog__actions">
              <v-spacer />
              <v-btn color="success" :disabled="!compRequestAvailable" tile block @click="sendCompKYCRequest">
                {{ $t('common.send') }}
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col class="pb-1 pt-1" cols="12" md="2">
        </v-col>
        <v-col class="pb-1 pt-1" cols="12" md="5">
          <v-card flat class="user-account-tab-result" v-if="kyc_state === 'rejected' && !is_verified">
            <v-card-subtitle>
              <v-alert
                  :icon="kyc_state_icon(kyc_state, is_verified)"
                  text
                  :type="kyc_state_alert_type(kyc_state, is_verified)"
                  class="mb-1"
              >
                {{ kyc_state_alert_text(kyc_state, is_verified) }}
              </v-alert>
              <span class="font-italic caption red--text" v-if="local_comp_data.reason"> {{ $t('kyc.rejected_alert.reason') }}: {{ local_comp_data.reason }}</span>
            </v-card-subtitle>
            <v-card-text>
              <div class="kyc-local-item__info-wrapper">

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.legal.form.name_brief') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_comp_data.company_name }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.legal.form.reg_no') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_comp_data.registration_number }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.legal.form.address') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_comp_data.address }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.legal.form.inn') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_comp_data.tax_id }}</div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ product.kybLocalUploadType === 'zip_docs'? $t('kyc.manual.zip_file_uploaded') : $t('kyc.manual.doc_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.created_at') }}
                  </div>
                  <div class="kyc-local-item__created">
                    {{ formatDate(local_comp_data.created_at) }}
                  </div>
                </div>
                <div class="kyc-local-item__updated-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.updated_at') }}
                  </div>
                  <div class="kyc-local-item__updated">
                    {{ formatDate(local_comp_data.updated_at) }}
                  </div>
                </div>

              </div>
            </v-card-text>

          </v-card>
        </v-col>
      </v-row>
      <v-row class="d-flex flex-grow-1 justify-space-between" v-else-if="(kyc_state === 'accepted' && is_verified) || kyc_state === 'new'">
        <v-col class="pb-1 pt-1" cols="12" md="5">
          <v-card flat class="user-account-tab-result">
            <v-card-subtitle>
              <v-alert
                  :icon="kyc_state_icon(kyc_state, is_verified)"
                  text
                  :type="kyc_state_alert_type(kyc_state, is_verified)"
                  class="mb-0"
              >
                {{ kyc_state_alert_text(kyc_state, is_verified) }}
              </v-alert>
            </v-card-subtitle>
            <v-card-text>
              <div class="kyc-local-item__info-wrapper">

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.legal.form.name_brief') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_comp_data.company_name }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.legal.form.reg_no') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_comp_data.registration_number }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.legal.form.inn') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_comp_data.tax_id }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.legal.form.address') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_comp_data.address }}</div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ product.kybLocalUploadType === 'zip_docs'? $t('kyc.manual.zip_file_uploaded') : $t('kyc.manual.doc_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.created_at') }}
                  </div>
                  <div class="kyc-local-item__created">
                    {{ formatDate(local_comp_data.created_at) }}
                  </div>
                </div>
                <div class="kyc-local-item__updated-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.updated_at') }}
                  </div>
                  <div class="kyc-local-item__updated">
                    {{ formatDate(local_comp_data.updated_at) }}
                  </div>
                </div>

              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col class="pb-1 pt-1" cols="12" md="2">
        </v-col>
        <v-col class="pb-1 pt-1" cols="12" md="5">
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import formValidationRules from '@/mixins/common/formValidationRules';
import formatDate from '@/mixins/format/formatDate';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'LocalCompany',
  mixins: [
    formValidationRules,
    formatDate
  ],
  props: {
    residentCountry: {
      type: String,
      required: true
    },
    resident: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isValidCompRequestForm: false,
      loaded: false,
      comp_data: {
        country: this.resident === 'resident' ? this.residentCountry : null,
        reg_number: null,
        address: null,
        tax_number: null,
        name: null,
        created_at: null,
        updated_at: null,
        file_doc: null
      },
      errors: {
        country: [],
        reg_number: [],
        address: [],
        tax_number: [],
        name: [],
        file_doc: []
      },
      countries: [],
    };
  },
  computed: {
    ...mapState({
      kyc_local_comp: state => state.user.kyc_local_comp,
    }),
    ...mapState('app', ['product']),
    isRU() {
      return (this.residentCountry === 'RU' && this.resident === 'resident') || (this.residentCountry !== 'RU' && this.comp_data.country === 'RU')
    },
    isKG() {
      return (this.residentCountry === 'KG' && this.resident === 'resident') || (this.residentCountry !== 'KG' && this.comp_data.country === 'KG')
    },
    compNameRules() {
      if(this.isRU) return [this.rules.required, this.rules.company_name];
      else if(this.isKG) return [this.rules.required, this.rules.company_name_global];
      else return [this.rules.required, this.rules.min5char, this.rules.max256char, this.rules.company_name_global];
    },
    regNoRules() {
      if(this.isRU) return [this.rules.required, this.rules.reg_no_ru];
      else if(this.isKG) return [this.rules.required, this.rules.reg_no_kg];
      else return [this.rules.required, this.rules.min8char, this.rules.max64char];
    },
    taxNoRules() {
      if(this.isRU) return [this.rules.required, this.rules.comp_ip_inn];
      else if(this.isKG) return [this.rules.required, this.rules.comp_inn_kg];
      else return [this.rules.required, this.rules.min8char, this.rules.max40char];
    },
    getFileDocLabel() {
      if(this.product.kybLocalUploadType)
      {
        if(this.product.kybLocalUploadType === 'letter') return this.$t('kyc.file_doc')
        else if(this.product.kybLocalUploadType === 'zip_docs') return this.$t('kyc.zip_file_doc')
        else return this.$t('kyc.file_doc')
      } else return this.$t('kyc.file_doc')
    },
    getFileDocHint() {
      if(this.product.kybLocalUploadType)
      {
        if(this.product.kybLocalUploadType === 'letter') return this.$t('kyc.file_doc_hint')
        else if(this.product.kybLocalUploadType === 'zip_docs') return this.$t('kyc.zip_file_doc_hint')
        else return this.$t('kyc.file_doc_hint')
      } else return this.$t('kyc.file_doc_hint')
    },
    getFileDocAccept() {
      if(this.product.kybLocalUploadType)
      {
        if(this.product.kybLocalUploadType === 'letter') return 'application/pdf'
        else if(this.product.kybLocalUploadType === 'zip_docs') return 'application/zip'
        else return 'application/pdf'
      } else return 'application/pdf'
    },
    getFileDocIcon() {
      if(this.product.kybLocalUploadType)
      {
        if(this.product.kybLocalUploadType === 'letter') return 'mdi-file-pdf-box'
        else if(this.product.kybLocalUploadType === 'zip_docs') return 'mdi-zip-box'
        else return 'mdi-file-pdf-box'
      } else return 'mdi-file-pdf-box'
    },
    getCompNameLabel() {
      if(this.comp_data.country === 'AU') return this.$t('kyc.manual.legal.form.abn');
      else if(this.comp_data.country === 'KG' || this.residentCountry === 'KG' && this.resident === 'resident') return this.$t('kyc.manual.legal.form.kg');
      else if(this.comp_data.country === 'EE') return this.$t('kyc.manual.legal.form.vat_or_name');
      else if(this.comp_data.country === 'JP') return this.$t('kyc.manual.legal.form.corp_no');
      else if(this.comp_data.country === 'HK' ||
          this.comp_data.country === 'GE' ||
          this.comp_data.country === 'IL' ||
          this.comp_data.country === 'SG' ||
          this.comp_data.country === 'TW'
      ) return this.$t('kyc.manual.legal.form.org_name');
      else if(this.comp_data.country === 'AT' ||
          this.comp_data.country === 'RU' ||
          this.comp_data.country === 'KZ' ||
          this.comp_data.country === 'BY' ||
          this.comp_data.country === 'UA' ||
          this.comp_data.country === 'BE' ||
          this.comp_data.country === 'BG' ||
          this.comp_data.country === 'GB' ||
          this.comp_data.country === 'HU' ||
          this.comp_data.country === 'DE' ||
          this.comp_data.country === 'DK' ||
          this.comp_data.country === 'IE' ||
          this.comp_data.country === 'ES' ||
          this.comp_data.country === 'IT' ||
          this.comp_data.country === 'CY' ||
          this.comp_data.country === 'CN' ||
          this.comp_data.country === 'LV' ||
          this.comp_data.country === 'LT' ||
          this.comp_data.country === 'LI' ||
          this.comp_data.country === 'LU' ||
          this.comp_data.country === 'MD' ||
          this.comp_data.country === 'MK' ||
          this.comp_data.country === 'NL' ||
          this.comp_data.country === 'NO' ||
          this.comp_data.country === 'PL' ||
          this.comp_data.country === 'RO' ||
          this.comp_data.country === 'RS' ||
          this.comp_data.country === 'SK' ||
          this.comp_data.country === 'SI' ||
          this.comp_data.country === 'FI' ||
          this.comp_data.country === 'FR' ||
          this.comp_data.country === 'HR' ||
          this.comp_data.country === 'CZ' ||
          this.comp_data.country === 'CH' ||
          this.comp_data.country === 'SE'
      ) return this.$t('kyc.manual.legal.form.name_or_fio');
      else return this.$t('kyc.manual.legal.form.name');
    },
    getCompNameHint() {
      if(this.comp_data.country === 'AU') return this.$t('kyc.manual.legal.hints.abn');
      else if(this.comp_data.country === 'HK') return this.$t('kyc.manual.legal.hints.brn_name');
      else if(this.comp_data.country === 'GE') return this.$t('kyc.manual.legal.hints.ge_name');
      else if(this.comp_data.country === 'IL') return this.$t('kyc.manual.legal.hints.il_name');
      else if(this.comp_data.country === 'KG') return this.$t('kyc.manual.legal.hints.kg');
      else if(this.comp_data.country === 'SG') return this.$t('kyc.manual.legal.hints.sg_name');
      else if(this.comp_data.country === 'TW') return this.$t('kyc.manual.legal.hints.tw_name');
      else if(this.comp_data.country === 'EE') return this.$t('kyc.manual.legal.hints.vat_or_name');
      else if(this.comp_data.country === 'JP') return this.$t('kyc.manual.legal.hints.corp_no');
      else if(this.comp_data.country === 'AT' ||
          this.comp_data.country === 'RU' ||
          this.comp_data.country === 'KZ' ||
          this.comp_data.country === 'BY' ||
          this.comp_data.country === 'UA' ||
          this.comp_data.country === 'BE' ||
          this.comp_data.country === 'BG' ||
          this.comp_data.country === 'GB' ||
          this.comp_data.country === 'HU' ||
          this.comp_data.country === 'DE' ||
          this.comp_data.country === 'DK' ||
          this.comp_data.country === 'IE' ||
          this.comp_data.country === 'ES' ||
          this.comp_data.country === 'IT' ||
          this.comp_data.country === 'CY' ||
          this.comp_data.country === 'CN' ||
          this.comp_data.country === 'LV' ||
          this.comp_data.country === 'LT' ||
          this.comp_data.country === 'LI' ||
          this.comp_data.country === 'LU' ||
          this.comp_data.country === 'MD' ||
          this.comp_data.country === 'MK' ||
          this.comp_data.country === 'NL' ||
          this.comp_data.country === 'NO' ||
          this.comp_data.country === 'PL' ||
          this.comp_data.country === 'RO' ||
          this.comp_data.country === 'RS' ||
          this.comp_data.country === 'SK' ||
          this.comp_data.country === 'SI' ||
          this.comp_data.country === 'FI' ||
          this.comp_data.country === 'FR' ||
          this.comp_data.country === 'HR' ||
          this.comp_data.country === 'CZ' ||
          this.comp_data.country === 'CH' ||
          this.comp_data.country === 'SE'
      ) return this.$t('kyc.manual.legal.hints.name_or_fio');
      else return this.$t('kyc.manual.legal.hints.name');
    },
    getCompRegNoLabel() {
      if(this.comp_data.country === 'AU') return this.$t('kyc.manual.legal.form.acn');
      else if(this.comp_data.country === 'BY') return this.$t('kyc.manual.legal.form.unp');
      else if(this.comp_data.country === 'HK') return this.$t('kyc.manual.legal.form.brn');
      else if(this.comp_data.country === 'IL') return this.$t('kyc.manual.legal.form.vat');
      else if(this.comp_data.country === 'KZ') return this.$t('kyc.manual.legal.form.bin');
      else if(this.comp_data.country === 'SG') return this.$t('kyc.manual.legal.form.uen');
      else if(this.comp_data.country === 'TW') return this.$t('kyc.manual.legal.form.ubn');
      else if(this.comp_data.country === 'UA') return this.$t('kyc.manual.legal.form.egrpou');
      else if(this.comp_data.country === 'JP') return this.$t('kyc.manual.legal.form.comp_no');
      else if(this.comp_data.country === 'AT' ||
          this.comp_data.country === 'BE' ||
          this.comp_data.country === 'BG' ||
          this.comp_data.country === 'GB' ||
          this.comp_data.country === 'HU' ||
          this.comp_data.country === 'DE' ||
          this.comp_data.country === 'DK' ||
          this.comp_data.country === 'IE' ||
          this.comp_data.country === 'ES' ||
          this.comp_data.country === 'IT' ||
          this.comp_data.country === 'CY' ||
          this.comp_data.country === 'CN' ||
          this.comp_data.country === 'LV' ||
          this.comp_data.country === 'LT' ||
          this.comp_data.country === 'LI' ||
          this.comp_data.country === 'LU' ||
          this.comp_data.country === 'MD' ||
          this.comp_data.country === 'MK' ||
          this.comp_data.country === 'NL' ||
          this.comp_data.country === 'NO' ||
          this.comp_data.country === 'PL' ||
          this.comp_data.country === 'RO' ||
          this.comp_data.country === 'RS' ||
          this.comp_data.country === 'SK' ||
          this.comp_data.country === 'SI' ||
          this.comp_data.country === 'FI' ||
          this.comp_data.country === 'FR' ||
          this.comp_data.country === 'HR' ||
          this.comp_data.country === 'CZ' ||
          this.comp_data.country === 'CH' ||
          this.comp_data.country === 'SE'
      ) return this.$t('kyc.manual.legal.form.id');
      else return this.$t('kyc.manual.legal.form.reg_no');
    },
    getCompRegNoHint() {
      if(this.comp_data.country === 'AU') return this.$t('kyc.manual.legal.hints.acn');
      else if(this.comp_data.country === 'KG') return this.$t('kyc.manual.legal.hints.reg_no_kg');
      else if(this.comp_data.country === 'BY') return this.$t('kyc.manual.legal.hints.unp');
      else if(this.comp_data.country === 'HK') return this.$t('kyc.manual.legal.hints.brn');
      else if(this.comp_data.country === 'IL') return this.$t('kyc.manual.legal.hints.vat');
      else if(this.comp_data.country === 'KZ') return this.$t('kyc.manual.legal.hints.bin');
      else if(this.comp_data.country === 'SG') return this.$t('kyc.manual.legal.hints.uen');
      else if(this.comp_data.country === 'TW') return this.$t('kyc.manual.legal.hints.ubn');
      else if(this.comp_data.country === 'UA') return this.$t('kyc.manual.legal.hints.egrpou');
      else if(this.comp_data.country === 'JP') return this.$t('kyc.manual.legal.hints.comp_no');
      else if(this.comp_data.country === 'AT' ||
          this.comp_data.country === 'BE' ||
          this.comp_data.country === 'BG' ||
          this.comp_data.country === 'GB' ||
          this.comp_data.country === 'HU' ||
          this.comp_data.country === 'DE' ||
          this.comp_data.country === 'DK' ||
          this.comp_data.country === 'IE' ||
          this.comp_data.country === 'ES' ||
          this.comp_data.country === 'IT' ||
          this.comp_data.country === 'CY' ||
          this.comp_data.country === 'CN' ||
          this.comp_data.country === 'LV' ||
          this.comp_data.country === 'LT' ||
          this.comp_data.country === 'LI' ||
          this.comp_data.country === 'LU' ||
          this.comp_data.country === 'MD' ||
          this.comp_data.country === 'MK' ||
          this.comp_data.country === 'NL' ||
          this.comp_data.country === 'NO' ||
          this.comp_data.country === 'PL' ||
          this.comp_data.country === 'RO' ||
          this.comp_data.country === 'RS' ||
          this.comp_data.country === 'SK' ||
          this.comp_data.country === 'SI' ||
          this.comp_data.country === 'FI' ||
          this.comp_data.country === 'FR' ||
          this.comp_data.country === 'HR' ||
          this.comp_data.country === 'CZ' ||
          this.comp_data.country === 'CH' ||
          this.comp_data.country === 'SE'
      ) return this.$t('kyc.manual.legal.hints.id');
      else return this.$t('kyc.manual.legal.hints.reg_no');
    },
    countries_available() {
      return _.filter(this.countries, (item) => { return item.iso !== this.residentCountry});
    },
    kyc_state() {
      return this.kyc_local_comp.id !== null ? this.kyc_local_comp.state : null
    },
    is_verified() {
      return this.kyc_local_comp.id !== null ? this.kyc_local_comp.is_verified : null
    },
    compRequestAvailable() {
      return this.isValidCompRequestForm;
    },
    local_comp_data() {
      return {
        company_name: this.kyc_local_comp.company_name,
        registration_number: this.kyc_local_comp.registration_number,
        address: this.kyc_local_comp.address,
        tax_id: this.kyc_local_comp.tax_id ? this.kyc_local_comp.tax_id : '-',
        created_at: this.kyc_local_comp.created_at,
        updated_at: this.kyc_local_comp.updated_at,
        reason: this.kyc_local_comp.reason ? this.kyc_local_comp.reason : null,
      }
    },

    show_global_form() {
      return (this.residentCountry === 'RU' && this.resident === 'non_resident') || (this.residentCountry !== 'RU' && this.comp_data.country !== 'RU')
    },
    document_mask() {
      if(this.isRU) return '#############??';
      else if(this.isKG) return '######-####-XXX';
      else return null;
    },
    tax_id_mask() {
      if(this.isRU) return '##########??';
      else if(this.isKG) return '##############';
      else return null;
    }
  },
  methods: {
    ...mapMutations({
      setStateLocalKYCStore: 'user/setKYCLocalCompState',
    }),
    kyc_state_icon(state, is_verified) {
      if(state === 'accepted' && is_verified) return 'mdi-account-check'
      else if(state === 'rejected' && !is_verified) return 'mdi-account-cancel'
      else if(state === 'new') return 'mdi-account-clock'
    },
    kyc_state_alert_type(state, is_verified) {
      if(state === 'accepted' && is_verified) return 'success'
      else if(state === 'rejected' && !is_verified) return 'error'
      else if(state === 'new') return 'info'
    },
    kyc_state_alert_text(state, is_verified) {
      if(state === 'accepted' && is_verified) return this.$t('kyc.manual.state.finish.success')
      else if(state === 'rejected' && !is_verified) return this.$t('kyc.manual.state.finish.error')
      else if(state === 'new') return this.$t('kyc.manual.state.new')
    },
    sendCompKYCRequest() {
      let self = this;
      let formData = new FormData();

      _.each(this.comp_data, function (value, key) {
        if (key === 'file_doc' && value.name) {
          formData.append(key, value, value.name);
        }
        else {
          if (value !== null) formData.append(key, value);
        }
      });

      axios.post('/trader/ext/kyc_local_comp_request', formData)
          .then(response => {
            if (response.data.success === true) {
              this.$store.dispatch('user/getKYCLocalCompData');
            }
          })
          .catch((error) => {
            if (error.response.status === 422) {
              let errors = error.response.data.errors;
              if (errors) {
                for (let field in errors) {
                  if (errors.hasOwnProperty(field)) {
                    self.errors[field] = errors[field];
                  }
                }
              }
            } else {
              console.log(error);
            }
          });
    },

  },
  mounted() {
    axios.get('/trader/ext/all_countries').then(response => {
      this.countries = response.data.data;
    });
    this.$store.dispatch('user/getKYCLocalCompData').then( res => {
      this.loaded = true;
    });
  }
};
</script>

<style scoped>

</style>