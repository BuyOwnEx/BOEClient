<template>
  <v-card class="user-verification-tab d-flex flex-column">
    <v-card-text class="d-flex flex-row flex-grow-1" v-if="loaded">
      <v-row class="d-flex flex-grow-1 justify-space-between" v-if="kyc_state === null || (kyc_state === 'finish' && !is_verified)">
        <v-col class="pb-1 pt-1" cols="12" md="5">
          <v-card class="user-account-tab-verification-description">
            <v-card-title>{{ $t('kyc.kontur.legal.title') }}</v-card-title>
            <v-card-subtitle>
              <span class="font-italic caption">{{ $t('kyc.kontur.legal.description') }}</span>
            </v-card-subtitle>
          </v-card>
          <v-card>
            <v-card-text>
              <v-radio-group
                  v-model="isFormLegalEntity"
                  :label="$t('kyc.kontur.legal_form')"
                  dense
                  mandatory
                  class="mt-0"
              >
                <v-radio
                    :label="$t('kyc.kontur.legal_sub_type.form_legal')"
                    :value="true"
                    :ripple="false"
                ></v-radio>
                <v-radio
                    :label="$t('kyc.kontur.legal_sub_type.no_form_legal')"
                    :value="false"
                    :ripple="false"
                ></v-radio>
              </v-radio-group>
              <v-form v-model="isValidCompRequestForm">
                <v-text-field
                    class="mb-1 pt-1 "
                    :class="{'d-none': !is_legal_form }"
                    v-model="inn_comp"
                    :label="$t('kyc.kontur.legal.form.inn')"
                    :rules="is_legal_form ? [rules.required, rules.comp_inn] : []"
                    v-mask="'##########'"
                    :hint="$t('kyc.kontur.legal.hints.inn')"
                    persistent-hint
                    outlined
                />
                <v-text-field
                    class="mb-1 pt-1"
                    :class="{'d-none': is_legal_form }"
                    v-model="inn_ip"
                    :label="$t('kyc.kontur.legal.form.inn')"
                    :rules="!is_legal_form ? [rules.required, rules.ind_inn] : []"
                    v-mask="'############'"
                    :hint="$t('kyc.kontur.legal.hints.inn_ip')"
                    persistent-hint
                    outlined
                />

                <v-text-field
                    class="mb-1 pt-1"
                    v-model="comp_data.edo_id"
                    :label="$t('kyc.kontur.legal.form.edo_id')"
                    :hint="$t('kyc.kontur.legal.hints.edo_id')"
                    :rules="[rules.required, rules.edo_id]"
                    v-mask="'NNN-NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN'"
                    persistent-hint
                    outlined
                />

                <v-file-input
                    v-model="comp_data.file_doc"
                    :label="$t('kyc.file_doc')"
                    :hint="$t('kyc.file_doc_hint')"
                    accept="application/pdf"
                    prepend-icon="mdi-file-pdf-box"
                    :error-messages="errors.file_doc"
                    @input="errors.file_doc = []"
                    :rules="[rules.required]"
                    persistent-hint
                    clearable
                    required
                    class="required"
                ></v-file-input>
              </v-form>
            </v-card-text>
          </v-card>
          <v-card>
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
          <v-card class="user-account-tab-result" v-if="kyc_state === 'finish' && !is_verified">
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
              <div class="kyc-kontur-item__info-wrapper">

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.legal.company_name') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_comp_data.company_name }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.legal.form.inn') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_comp_data.comp_inn }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.legal.form.edo_id') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_comp_data.edo_id }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.legal.risk_level') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">
                    <v-chip
                        label
                        :color="kyc_risk_level_color(kontur_comp_data.risk_level)"
                        class="mt-1"
                    >
                      {{ kyc_risk_level_text(kontur_comp_data.risk_level) }}
                    </v-chip>
                  </div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.legal.risk') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_comp_data.risk !== '-' ? BigNumber(kontur_comp_data.risk).multipliedBy(100).toString() : kontur_comp_data.risk }}</div>
                </div>

                <div class="kyc-kontur-item__created-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.created_at') }}
                  </div>
                  <div class="kyc-kontur-item__created">
                    {{ formatDate(kontur_comp_data.created_at) }}
                  </div>
                </div>
                <div class="kyc-kontur-item__updated-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.updated_at') }}
                  </div>
                  <div class="kyc-kontur-item__updated">
                    {{ formatDate(kontur_comp_data.updated_at) }}
                  </div>
                </div>

              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="d-flex flex-grow-1 justify-space-between" v-else-if="(kyc_state === 'finish' && is_verified) || kyc_state === 'processing' || kyc_state === 'new'">
        <v-col class="pb-1 pt-1" cols="12" md="5">
          <v-card class="user-account-tab-result">
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
              <div class="kyc-kontur-item__info-wrapper">

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.legal.company_name') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_comp_data.comp_inn.length === 12 && kontur_comp_data.company_name !== '-' ? ($t('kyc.kontur.legal_sub_type.no_form_legal_short') + ' ' + kontur_comp_data.company_name) : kontur_comp_data.company_name }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.legal.form.inn') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_comp_data.comp_inn }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.legal.form.edo_id') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_comp_data.edo_id }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.legal.risk_level') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">
                    <v-chip
                        label
                        :color="kyc_risk_level_color(kontur_comp_data.risk_level)"
                        class="mt-1"
                    >
                      {{ kyc_risk_level_text(kontur_comp_data.risk_level) }}
                    </v-chip>
                  </div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.legal.risk') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_comp_data.risk !== '-' ? BigNumber(kontur_comp_data.risk).multipliedBy(100).toString() : kontur_comp_data.risk }}</div>
                </div>

                <div class="kyc-kontur-item__created-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.created_at') }}
                  </div>
                  <div class="kyc-kontur-item__created">
                    {{ formatDate(kontur_comp_data.created_at) }}
                  </div>
                </div>
                <div class="kyc-kontur-item__updated-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.updated_at') }}
                  </div>
                  <div class="kyc-kontur-item__updated">
                    {{ formatDate(kontur_comp_data.updated_at) }}
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
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import formValidationRules from '@/mixins/common/formValidationRules';
import formatDate from '@/mixins/format/formatDate';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'KonturCompany',
  components: {  },
  mixins: [
    formValidationRules,
    formatDate
  ],
  data() {
    return {
      isValidCompRequestForm: false,
      loaded: false,
      isFormLegalEntity: true,
      inn_comp: null,
      inn_ip: null,
      comp_data: {
        comp_inn: null,
        edo_id: null,
        file_doc: null,
        risk_level: null,
        risk: null,
        created_at: null,
        updated_at: null
      },
      errors: {
        comp_inn: [],
        edo_id: [],
        file_doc: []
      },
    };
  },
  computed: {
    ...mapState({
      kontur: state => state.user.kontur,
    }),

    kyc_state() {
      return this.kontur.id !== null ? this.kontur.state : null
    },
    is_verified() {
      return this.kontur.id !== null ? this.kontur.is_verified : null
    },
    compRequestAvailable() {
      return this.isValidCompRequestForm;
    },
    is_legal_form() {
      return this.isFormLegalEntity;
    },
    kontur_comp_data() {
      return {
        comp_inn: this.kontur.inn,
        edo_id:  this.kontur.edo_id,
        company_name: this.kontur.company_name ? this.kontur.company_name: '-',
        risk_level: this.kontur.risk_level ? this.kontur.risk_level: '-',
        risk: this.kontur.risk ? this.kontur.risk: '-',
        created_at: this.kontur.created_at,
        updated_at: this.kontur.updated_at
      }
    }
  },
  methods: {
    ...mapMutations({
      setStateKonturStore: 'user/setStateKontur',
    }),
    kyc_state_icon(state, is_verified) {
      if(state === 'finish' && is_verified) return 'mdi-account-check'
      else if(state === 'finish' && !is_verified) return 'mdi-account-cancel'
      else if(state === 'processing' || state === 'new') return 'mdi-account-clock'
    },
    kyc_state_alert_type(state, is_verified) {
      if(state === 'finish' && is_verified) return 'success'
      else if(state === 'finish' && !is_verified) return 'error'
      else if(state === 'processing') return 'warning'
      else if(state === 'new') return 'info'
    },
    kyc_state_alert_text(state, is_verified) {
      if(state === 'finish' && is_verified) return this.$t('kyc.kontur.state.finish.success')
      else if(state === 'finish' && !is_verified) return this.$t('kyc.kontur.state.finish.error')
      else if(state === 'processing') return this.$t('kyc.kontur.state.processing')
      else if(state === 'new') return this.$t('kyc.kontur.state.new')
    },
    kyc_risk_level_text(risk_level) {
      if(risk_level === 'low') return this.$t('kyc.kontur.risk_level.low')
      else if(risk_level === 'middle') return this.$t('kyc.kontur.risk_level.middle')
      else if(risk_level === 'high') return this.$t('kyc.kontur.risk_level.high')
      else return this.$t('kyc.kontur.risk_level.not_defined')
    },
    kyc_risk_level_color(risk_level) {
      if(risk_level === 'low') return 'green'
      else if(risk_level === 'middle') return 'orange'
      else if(risk_level === 'high') return 'red'
      else return 'default'
    },
    BigNumber(item) {
      return BigNumber(item);
    },
    sendCompKYCRequest() {
      let self = this;
      let formData = new FormData();
      if (this.comp_data['file_doc'] && this.comp_data['file_doc'].name) {
        formData.append('file_doc', this.comp_data['file_doc'], this.comp_data['file_doc'].name);
      }
      _.each(this.comp_data, function (value, key) {
        if (value !== null) formData.append(key, value);
      });
      if(this.is_legal_form) formData.append('comp_inn', this.inn_comp)
      else formData.append('comp_inn', this.inn_ip)

      axios.post('/trader/ext/kyc_kontur_comp_request', formData)
          .then(response => {
            if (response.data.success === true) {
              console.log(response.data);
              this.$store.dispatch('user/getKonturData');
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
    this.$store.dispatch('user/getKonturData').then( res => {
      this.loaded = true;
    });
  }
};
</script>

<style lang="sass" scoped>
.user-account-tab-result
  border: 1px solid #464646
.kyc-kontur-item
  &__title
    flex-wrap: nowrap
    white-space: nowrap
    justify-content: space-between
  &__header
    font-size: 1rem
    font-weight: 500
    padding-top: 16px
  &__name
    text-overflow: ellipsis
    overflow: hidden

  &__content
    display: grid
    grid-template-columns: 180px 1fr
    grid-template-areas: 'icon info'

  &__icon-wrapper
    display: flex
    grid-area: icon
  &__info-wrapper
    grid-area: info
    overflow: hidden

  &__icon
    padding: 8px
    border: 1px solid #a9a8a838
    border-radius: 0

  &__abilities-key-wrapper
    margin-left: -4px

  &__info-key-wrapper
    .kyc-kontur-item__header
      padding-top: 0
  ::v-deep.CommonCopyLabel
    font-size: 1rem

  &__secret-key
    font-size: 1.1rem
    font-weight: bold

  @media screen and (max-width: 599px)
    &__content
      display: flex
      flex-flow: column
    &__icon-wrapper
      justify-content: center
      margin-bottom: 32px

.v-application--is-rtl
  .kyc-kontur-item
    &__abilities-key-wrapper
      margin-left: 0
      margin-right: -4px
</style>