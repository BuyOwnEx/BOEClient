<template>
  <v-card class="user-verification-tab fill-height d-flex flex-column">
    <v-card-text class="d-flex flex-column flex-grow-1" v-if="loaded">
      <v-row class="d-flex flex-grow-1 justify-space-between">
        <v-col class="pb-1 pt-1" cols="12" xl="5">
          <v-card flat outlined class="user-account-tab-verification-status">
            <v-card-title class="d-flex justify-space-between">
              <span>{{ $t('kyc.manual.legal.status') }}</span>
              <v-chip small label outlined :color="get_state_color" class="ml-1 overline text-uppercase font-weight-black">
                {{ get_state_name }}
              </v-chip>
            </v-card-title>
          </v-card>
          <v-alert v-if="kyc_state === 'correction' && correction_reason" dense border="left" text :icon="false" color="orange" class="mt-3">
            <small><span class="text-decoration-underline">{{ $t('kyc.manual.legal.correction_reason') }}:</span> <span class="font-italic">{{ correction_reason }}</span></small>
          </v-alert>
          <v-form v-model="isValidCompRequestForm">
            <v-card flat outlined class="mt-1">
              <v-card-title>{{ $t('kyc.manual.legal.title') }}</v-card-title>
              <v-card-subtitle v-if="kyc_state === null || (kyc_state === 'rejected' && !is_verified) || (kyc_state === 'correction' && !is_verified)">
                <span class="font-italic caption">{{ $t('kyc.manual.legal.description') }}</span>
              </v-card-subtitle>
              <v-divider></v-divider>
              <v-card-text class="pt-0">
                <div v-if="(kyc_state === 'new' || kyc_state === 'accepted') && resident === 'resident'" class="d-flex justify-space-between py-1 pt-2">
                  <div>
                    <span>{{ $t('common.country') }}: </span>
                  </div>
                  <div>
                    <item-with-logo
                        :cell_text="getCountryName(comp_data.country)"
                        :logo="getCountryLogo(comp_data.country)"
                        :tile="true"
                        :size="16"
                    ></item-with-logo>
                  </div>
                </div>
                <v-select
                    v-if="resident === 'non_resident'"
                    v-model="comp_data.country"
                    :items="countries_available"
                    :item-text="(item) => { return $t('countries.'+item.iso.toLowerCase())}"
                    item-value="iso"
                    :label="$t('kyc.country')"
                    :hint="$t('kyc.select_resident_country')"
                    :rules="[rules.required]"
                    :disabled="kyc_state === 'new' || kyc_state === 'accepted'"
                    autofocus
                    persistent-hint
                    :hide-details="kyc_state !== 'new' && kyc_state !== 'accepted' ? 'auto' : true"
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
                    v-model="comp_data.name"
                    :label="getCompNameLabel"
                    :hint="getCompNameHint"
                    :rules="compNameRules"
                    :disabled="kyc_state === 'new' || kyc_state === 'accepted'"
                    :hide-details="kyc_state !== 'new' && kyc_state !== 'accepted' ? 'auto' : true"
                    persistent-hint
                    clearable
                    required
                    class="required mb-1"
                />
                <v-text-field
                    v-model="comp_data.reg_number"
                    :label="getCompRegNoLabel"
                    :hint="getCompRegNoHint"
                    :rules="regNoRules"
                    v-mask="document_mask"
                    :error-messages="errors.reg_number"
                    :disabled="kyc_state === 'new' || kyc_state === 'accepted'"
                    :hide-details="kyc_state !== 'new' && kyc_state !== 'accepted' ? 'auto' : true"
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
                    :disabled="kyc_state === 'new' || kyc_state === 'accepted'"
                    :hide-details="kyc_state !== 'new' && kyc_state !== 'accepted' ? 'auto' : true"
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
                    :disabled="kyc_state === 'new' || kyc_state === 'accepted'"
                    :hide-details="kyc_state !== 'new' && kyc_state !== 'accepted' ? 'auto' : true"
                    persistent-hint
                    clearable
                    required
                    class="required mb-1"
                    @input="errors.address = []"
                />
              </v-card-text>
            </v-card>
            <v-alert v-if="kyc_state === null || kyc_state === 'correction'" dense border="left" text :icon="false" color="primary" class="mt-3">
              <small><span class="font-italic">{{ $t('kyc.manual.legal.docs_manual') }} <Link path="/knowledge">{{ $t('titles.knowledge') }}</Link></span></small>
            </v-alert>
            <v-card flat outlined class="mt-1">
              <div class="d-flex justify-space-between">
                <div>
                  <v-card-title>{{ $t('kyc.manual.legal.documents') }}</v-card-title>
                  <v-card-subtitle v-if="kyc_state === null || (kyc_state === 'rejected' && !is_verified) || (kyc_state === 'correction' && !is_verified)">
                    <span class="font-italic caption">{{ $t('kyc.manual.legal.docs_description',{size: max_files_size_mb, limit: max_files}) }}</span>
                  </v-card-subtitle>
                </div>
                <div class="align-self-center mx-1 pa-1 pl-0" v-if="kyc_state === null || (kyc_state === 'rejected' && !is_verified) || (kyc_state === 'correction' && !is_verified)">
                  <v-chip small label outlined :color="get_doc_color" class="overline text-uppercase font-weight-black">
                    {{ BigNumber(get_doc_size).div(1024).div(1024).dp(2).toString() }}Mb/{{ $tc('common.files', filled_doc_count, [filled_doc_count]) }}
                  </v-chip>
                </div>
              </div>
              <v-divider></v-divider>
              <div v-if="attachments.length > 0" class="px-2 mt-1">
                <small>{{ $t('kyc.manual.legal.uploaded_documents') }}</small>
              </div>
              <v-sheet v-if="attachments.length > 0" class="pa-1 px-2 pb-2">
                <div
                    v-for="attach in this.attachments"
                    :key="attach.id"
                    class="d-flex align-self-center mt-1"
                >
                  <v-avatar size="22" class="my-0">
                    <v-icon :color="getAttachIconColor(attach.mime_type)" >{{ getAttachIcon(attach.mime_type) }}</v-icon>
                  </v-avatar>

                  <div class="d-flex ml-1">
                    <span class="font-weight-medium text-truncate">{{ attach.file_name }}</span>
                    <div class="d-inline-flex align-center ml-1">
                      <v-icon style="cursor: pointer" color="secondary" small class="d-inline mr-1" @click="download_verification_attachment(attach.id, attach.file_name)">mdi-download</v-icon>
                      <h5 class="text-subtitle-2">{{ attach.size_mb }}Mb</h5>
                    </div>
                  </div>
                </div>
              </v-sheet>
              <v-divider v-if="kyc_state === 'correction'"></v-divider>
              <div v-if="kyc_state === null || (kyc_state === 'rejected' && !is_verified) || (kyc_state === 'correction' && !is_verified)" class="px-2 mt-1">
                <small>{{ $t('kyc.manual.legal.new_documents') }}</small>
              </div>
              <v-card-text v-if="kyc_state === null || (kyc_state === 'rejected' && !is_verified) || (kyc_state === 'correction' && !is_verified)" class="pt-0">
                <div class="d-flex flex-column">
                  <div v-for="(item, index) in comp_data.file_docs" :key="index">
                    <v-file-input
                        v-model="item.file"
                        :label="getMultipleFileDocLabel(index)"
                        :hint="getFileDocHint"
                        :accept="getFileDocAccept"
                        :prepend-icon="getFileDocIcon"
                        :error-messages="errors.file_docs"
                        @input="errors.file_docs = []"
                        @change="onFileChange(index, $event)"
                        :rules="kyc_state === 'correction' ? [rules.maxFileSize15MB, rules.uploadDocTypes] : [rules.required, rules.maxFileSize15MB, rules.uploadDocTypes]"
                        :show-size="1024"
                        :disabled="kyc_state === 'new' || kyc_state === 'accepted'"
                        persistent-hint
                        clearable
                        required
                        dense
                        flat
                        class="required mt-2"
                    >
                      <template v-slot:append-outer>
                        <CommonTooltip :value="$t('common.delete')">
                          <v-btn
                              x-small
                              color="error"
                              icon
                              @click="removeFileInput(index)"
                              v-if="comp_data.file_docs.length > 1"
                              class="ml-1"
                          >
                            <v-icon>mdi-trash-can-outline</v-icon>
                          </v-btn>
                        </CommonTooltip>
                      </template>
                    </v-file-input>
                  </div>
                  <div class="mt-1" v-if="comp_data.file_docs.length < max_files && is_docs_size_valid">
                    <CommonTooltip :value="$t('common.add')">
                      <v-btn icon small color="primary" @click="addFileInput">
                        <v-icon>mdi-plus-circle</v-icon>
                      </v-btn>
                    </CommonTooltip>
                  </div>
                </div>
                <v-alert dense border="left" text :icon="false" type="error" class="mt-3" v-if="!is_docs_size_valid">
                  <small>{{ $t('kyc.manual.legal.max_files_size_error',{size: max_files_size_mb}) }}</small>
                </v-alert>
              </v-card-text>
            </v-card>
          </v-form>
          <v-card flat v-if="kyc_state === null || (kyc_state === 'rejected' && !is_verified) || (kyc_state === 'correction' && !is_verified)">
            <v-card-actions class="common-dialog__actions">
              <v-spacer />
              <v-btn color="success" :loading="loading" :disabled="!compRequestAvailable || !is_docs_size_valid || loading" tile block @click="sendCompKYCRequest">
                {{ $t('common.send') }}
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col class="pb-1 pt-1" cols="12" xl="2">
        </v-col>
        <v-col class="pb-1 pt-1" cols="12" xl="5">

        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import formValidationRules from '@/mixins/common/formValidationRules';
import formatDate from '@/mixins/format/formatDate';
import bignumber from "@/mixins/format/bignumber.js";
import download from "@/mixins/download/download.js";
import { mapMutations, mapState, mapActions } from 'vuex';
import CommonTooltip from "@/components/common/CommonTooltip.vue";
import ItemWithLogo from "@/components/common/ItemWithLogo.vue";
import Link from "@/components/common/Link.vue";
export default {
  name: 'LocalCompany',
  components: {
    Link,
    CommonTooltip,
    ItemWithLogo
  },
  mixins: [
    formValidationRules,
    formatDate,
    bignumber,
    download
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
      max_files: 20,
      max_files_size_mb: 100,
      warning_max_files: 15,
      warning_files_size_mb: 75,
      loaded: false,
      loading: false,
      attachments: [],
      correction_reason: null,
      comp_data: {
        country: this.resident === 'resident' ? this.residentCountry : null,
        reg_number: null,
        address: null,
        tax_number: null,
        name: null,
        created_at: null,
        updated_at: null,
        file_docs: [
          { file: null }
        ]
      },
      errors: {
        country: [],
        reg_number: [],
        address: [],
        tax_number: [],
        name: [],
        file_docs: []
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
      else return [this.rules.required, this.rules.min5char, this.rules.max64char];
    },
    taxNoRules() {
      if(this.isRU) return [this.rules.required, this.rules.comp_ip_inn];
      else if(this.isKG) return [this.rules.required, this.rules.comp_inn_kg];
      else return [this.rules.required, this.rules.min8char, this.rules.max40char];
    },
    getFileDocHint() {
      return this.$t('kyc.multiple_doc_hint')
    },
    getFileDocAccept() {
      return 'image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip'
    },
    getFileDocIcon() {
      return 'mdi-paperclip'
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
    document_mask() {
      if(this.isRU) return '##############?#?';
      else if(this.isKG) return '######-####-XXX';
      else return null;
    },
    tax_id_mask() {
      if(this.isRU) return '###########?#?';
      else if(this.isKG) return '##############';
      else return null;
    },
    get_state_name() {
      if(this.kyc_state === null) return this.$t('kyc.manual.legal.statuses.draft');
      else return this.$t('kyc.manual.legal.statuses.'+this.kyc_state);
    },
    get_state_color() {
      if(this.kyc_state === null) return 'secondary';
      else if(this.kyc_state === 'new') return 'info';
      else if(this.kyc_state === 'correction') return 'warning';
      else if(this.kyc_state === 'rejected') return 'error';
      else if(this.kyc_state === 'accepted') return 'success';
      else return 'primary';
    },
    filled_docs() {
      return _.filter(this.comp_data.file_docs, item => { return  item.file !==null });
    },
    filled_doc_count() {
      return this.filled_docs.length;
    },
    get_doc_size() {
      return this.filled_doc_count > 0 ? _.sumBy(this.filled_docs, 'file.size') : 0;
    },
    is_docs_size_valid() {
      return this.BigNumber(this.get_doc_size).div(1024).div(1024).dp(2).lte(this.max_files_size_mb);
    },
    get_doc_color() {
      if(this.filled_doc_count === 0) return 'secondary';
      else if(this.filled_doc_count > 0)
      {
        if(this.filled_doc_count > this.max_files || this.BigNumber(this.get_doc_size).div(1024).div(1024).dp(2).gt(this.max_files_size_mb)) return 'error';
        else if(this.filled_doc_count > this.warning_max_files || this.BigNumber(this.get_doc_size).div(1024).div(1024).dp(2).gt(this.warning_files_size_mb)) return 'warning';
        else return 'success';
      }
    },
  },
  methods: {
    ...mapMutations({
      setStateLocalKYCStore: 'user/setKYCLocalCompState',
    }),
    ...mapActions({
      getVerificationStatusStore: 'user/getVerificationStatus',
    }),
    removeFileInput(index) {
      console.log(index);
      this.comp_data.file_docs.splice(index, 1);
    },
    addFileInput() {
      this.comp_data.file_docs.push({ file: null });
    },
    onFileChange(index, file) {
      this.errors.file_docs = [];
      console.log(`File ${index} changed:`, file);
    },
    getMultipleFileDocLabel(index) {
      return this.$t('kyc.multiple_doc',{index: index + 1})
    },
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
    getCountryName(code) {
      return this.$t('countries.'+code.toLowerCase());
    },
    getCountryLogo(code) {
      const index = _.findIndex(this.countries, (item) => { return item.iso === code});
      if(index > -1) return this.countries[index].logo;
      else return null;
    },
    getAttachIcon(mime_type) {
      if(mime_type === 'pdf') return 'mdi-file-pdf-box';
      else if(mime_type === 'jpg') return 'mdi-file-jpg-box';
      else if(mime_type === 'png') return 'mdi-file-png-box';
      else if(mime_type === 'doc' || mime_type === 'docx') return 'mdi-file-word-box';
      else if(mime_type === 'zip') return 'mdi-zip-box';
      else return 'mdi-link-box-variant';
    },
    getAttachIconColor(mime_type) {
      if (mime_type === 'pdf') return 'rgb(220, 40, 60)';
      else if (mime_type === 'jpg') return 'rgb(0, 128, 64)';
      else if (mime_type === 'png') return 'rgb(0, 102, 204)';
      else if (mime_type === 'doc' || mime_type === 'docx') return 'rgb(43, 85, 154)';
      else if (mime_type === 'zip') return 'rgb(128, 128, 128)';
      else return 'rgb(102, 102, 102)';
    },
    getKYCLocalCompDataStore() {
      this.loaded = false;
      this.$store.dispatch('user/getKYCLocalCompData').then( res => {
        if(res.data && (res.data.state === 'new' || res.data.state === 'correction' || res.data.state === 'accepted'))
        {
          this.comp_data.address = res.data.address;
          this.comp_data.country = res.data.country;
          this.comp_data.name = res.data.company_name;
          this.comp_data.reg_number = res.data.registration_number;
          this.comp_data.tax_number = res.data.tax_id;
          this.comp_data.created_at = res.data.created_at;
          this.comp_data.updated_at = res.data.updated_at;
          this.attachments = res.attachments ? res.attachments : [];
          this.correction_reason = res.data.correction_reason;
        }
        this.loaded = true;
      });
    },
    sendCompKYCRequest() {
      this.loading = true;
      let self = this;
      let formData = new FormData();
      const url = '/trader/ext/kyc_local_comp_request_md';
      _.each(this.comp_data, function (value, key) {
        if (key === 'file_docs' && value.length > 0) {
          let files = _.filter(value, item => {return item.file !== null});
          for(let i=0; i < files.length; i++)
          {
            formData.append('files['+i+']', files[i].file, files[i].file.name);
          }
        }
        else {
          if (value !== null) formData.append(key, value);
        }
      });

      axios.post(url, formData)
      .then(response => {
        if (response.data.success === true) {
          this.getKYCLocalCompDataStore();
          this.getVerificationStatusStore();
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
      }).finally(() => {
        self.loading = false;
      });
    },

  },
  mounted() {
    axios.get('/trader/ext/all_countries').then(response => {
      this.countries = response.data.data;
    });
    this.getKYCLocalCompDataStore();
  }
};
</script>

<style scoped>

</style>