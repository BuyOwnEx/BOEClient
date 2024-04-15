<template>
  <v-card class="user-verification-tab tab-fill-height d-flex flex-column">
    <v-card-title>{{ $t('user.title.verification') }}</v-card-title>
    <v-card-text class="d-flex flex-row flex-grow-1" v-if="loaded">
      <v-row class="d-flex flex-column flex-grow-1" v-if="kyc_state === null || (kyc_state === 'finish' && !is_verified)">
        <v-col class="pb-1 pt-1" cols="12" md="5">
          <v-tabs grow v-model="selectedTab">
            <v-tab :key="1" :disabled="kyc_type === 'legal'">{{ $t('kyc.kontur.type.individual') }}</v-tab>
            <v-tab :key="2" :disabled="kyc_type === 'individual'">{{ $t('kyc.kontur.type.legal') }}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="selectedTab" class="profile-page__tabs-items">
            <v-tab-item :key="1" :disabled="kyc_type === 'legal'">
              <v-card class="user-account-tab-verification-description">
                <v-card-title>{{ $t('kyc.kontur.individual.title') }}</v-card-title>
                <v-card-subtitle>
                  <span class="font-italic caption">{{ $t('kyc.kontur.individual.description') }}</span>
                </v-card-subtitle>
              </v-card>
              <v-card>
                <v-card-text>
                  <v-form v-model="isValidIndRequestForm">
                    <v-text-field
                        class="mb-1 pt-1"
                        v-model="ind_data.fio"
                        :label="$t('kyc.kontur.individual.form.fio')"
                        :hint="$t('kyc.kontur.individual.hints.fio')"
                        :rules="[rules.required,rules.fio]"
                        persistent-hint
                        outlined
                    />
                    <v-menu
                        ref="birthday"
                        v-model="birthday"
                        :close-on-content-click="false"
                        :return-value.sync="ind_data.birthday"
                        transition="scale-transition"
                        min-width="290px"
                        offset-y
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                            v-model="ind_data.birthday"
                            class="required mb-1"
                            :label="$t('kyc.kontur.individual.form.birthday')"
                            :hint="$t('kyc.kontur.individual.hints.birthday')"
                            :rules="[rules.required, rules.birthday_18years]"
                            persistent-hint
                            hide-details="auto"
                            readonly
                            required
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="ind_data.birthday" no-title scrollable @change="birthdayChange"></v-date-picker>
                    </v-menu>

                    <v-text-field
                        v-model="ind_data.passport_number"
                        :label="$t('kyc.kontur.individual.form.passport_number')"
                        :hint="$t('kyc.kontur.individual.hints.passport_number')"
                        :rules="[rules.required, rules.passport_number]"
                        v-mask="'#### ######'"
                        :error-messages="errors.passport_number"
                        persistent-hint
                        clearable
                        required
                        class="required mb-1"
                        @input="errors.passport_number = []"
                    >
                    </v-text-field>

                    <v-text-field
                        v-model="ind_data.ind_inn"
                        :label="$t('kyc.kontur.individual.form.inn')"
                        :hint="$t('kyc.kontur.individual.hints.inn')"
                        :rules="[rules.ind_inn]"
                        v-mask="'############'"
                        :error-messages="errors.ind_inn"
                        persistent-hint
                        clearable
                        class="mb-1"
                        @input="errors.ind_inn = []"
                    >
                    </v-text-field>

                    <v-file-input
                        v-model="ind_data.file_ps"
                        :label="$t('kyc.file_ps')"
                        :hint="$t('kyc.file_ps_hint')"
                        accept="image/png, image/jpeg"
                        prepend-icon="mdi-camera"
                        :error-messages="errors.file_ps"
                        @input="errors.file_ps = []"
                        :rules="[rules.required]"
                        persistent-hint
                        clearable
                        required
                        class="required"
                    ></v-file-input>

                    <v-file-input
                        v-model="ind_data.file_ws"
                        :label="$t('kyc.file_ws')"
                        :hint="$t('kyc.file_ws_hint')"
                        accept="image/png, image/jpeg"
                        prepend-icon="mdi-camera"
                        :error-messages="errors.file_ws"
                        @input="errors.file_ws = []"
                        :rules="[rules.required]"
                        persistent-hint
                        clearable
                        required
                        class="required"
                    ></v-file-input>

                    <v-file-input
                        v-model="ind_data.file_ts"
                        :label="$t('kyc.file_ts')"
                        :hint="$t('kyc.file_ts_hint')"
                        accept="image/png, image/jpeg"
                        prepend-icon="mdi-camera"
                        :error-messages="errors.file_ts"
                        @input="errors.file_ts = []"
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
                  <v-btn color="success" :disabled="!indRequestAvailable" tile block @click="sendIndKYCRequest">
                    {{ $t('common.send') }}
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <v-tab-item :key="2" :disabled="kyc_type === 'individual'">
              <v-card class="user-account-tab-verification-description">
                <v-card-title>{{ $t('kyc.kontur.legal.title') }}</v-card-title>
                <v-card-subtitle>
                  <span class="font-italic caption">{{ $t('kyc.kontur.legal.description') }}</span>
                </v-card-subtitle>
              </v-card>
              <v-card>
                <v-card-text>
                  <v-form v-model="isValidCompRequestForm">
                    <v-text-field
                        class="mb-1 pt-1"
                        v-model="comp_data.comp_inn"
                        :label="$t('kyc.kontur.legal.form.inn')"
                        :hint="$t('kyc.kontur.legal.hints.inn')"
                        :rules="[rules.required, rules.comp_inn]"
                        v-mask="'##########'"
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
            </v-tab-item>
          </v-tabs-items>
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
            <v-card-text v-if="kyc_type === 'individual'">
              <div class="kyc-kontur-item__info-wrapper">

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.individual.form.fio_brief') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_ind_data.fio }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.individual.form.birthday') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_ind_data.birthday }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.individual.form.passport_number') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_ind_data.passport_number }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.individual.form.inn') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_ind_data.ind_inn }}</div>
                </div>

                <div class="kyc-kontur-item__created-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.kontur.ps_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-kontur-item__created-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.kontur.ws_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-kontur-item__created-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.kontur.ts_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-kontur-item__created-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.created_at') }}
                  </div>
                  <div class="kyc-kontur-item__created">
                    {{ formatDate(kontur_ind_data.created_at) }}
                  </div>
                </div>
                <div class="kyc-kontur-item__updated-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.updated_at') }}
                  </div>
                  <div class="kyc-kontur-item__updated">
                    {{ formatDate(kontur_ind_data.updated_at) }}
                  </div>
                </div>

              </div>
            </v-card-text>
            <v-card-text v-else>
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
      <v-row class="d-flex flex-column flex-grow-1" v-else-if="(kyc_state === 'finish' && is_verified) || kyc_state === 'processing' || kyc_state === 'new'">
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
            <v-card-text v-if="kyc_type === 'individual'">
              <div class="kyc-kontur-item__info-wrapper">

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.individual.form.fio_brief') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_ind_data.fio }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.individual.form.birthday') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_ind_data.birthday }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.individual.form.passport_number') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_ind_data.passport_number }}</div>
                </div>

                <div class="kyc-kontur-item__secret-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.individual.form.inn') }}
                  </div>
                  <div class="kyc-kontur-item__secret-key">{{ kontur_ind_data.ind_inn }}</div>
                </div>

                <div class="kyc-kontur-item__created-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.kontur.ps_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-kontur-item__created-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.kontur.ws_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-kontur-item__created-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.kontur.ts_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-kontur-item__created-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.created_at') }}
                  </div>
                  <div class="kyc-kontur-item__created">
                    {{ formatDate(kontur_ind_data.created_at) }}
                  </div>
                </div>
                <div class="kyc-kontur-item__updated-key-wrapper">
                  <div class="kyc-kontur-item__header">
                    {{ $t('kyc.kontur.updated_at') }}
                  </div>
                  <div class="kyc-kontur-item__updated">
                    {{ formatDate(kontur_ind_data.updated_at) }}
                  </div>
                </div>

              </div>
            </v-card-text>
            <v-card-text v-else>
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
  name: 'UserKonturVerificationTab',
  components: {  },
  mixins: [
    formValidationRules,
    formatDate
  ],
  data() {
    return {
      selectedTab: 0,
      isValidIndRequestForm: false,
      isValidCompRequestForm: false,
      birthday: false,

      loaded: false,
      ind_data: {
        fio: null,
        birthday: null,
        passport_number: null,
        ind_inn: null,
        created_at: null,
        updated_at: null,
        file_ps: null,
        file_ws: null,
        file_ts: null
      },
      comp_data: {
        comp_inn: null,
        edo_id: null,
        risk_level: null,
        risk: null,
        created_at: null,
        updated_at: null
      },
      errors: {
        fio: [],
        birthday: [],
        passport_number: [],
        ind_inn: [],
        comp_inn: [],
        edo_id: [],
        file_ps: [],
        file_ws: [],
        file_ts: []
      },
    };
  },
  computed: {
    ...mapState({
      kontur: state => state.user.kontur,
    }),
    kyc_type() {
      return this.kontur.id !== null ? this.kontur.kyc_type : null
    },
    kyc_state() {
      return this.kontur.id !== null ? this.kontur.state : null
    },
    kyc_status() {
      return this.kontur.id !== null ? this.kontur.status : null
    },
    verification_id() {
      return this.kontur.id !== null ? this.kontur.id : null
    },
    is_verified() {
      return this.kontur.id !== null ? this.kontur.is_verified : null
    },
    indRequestAvailable() {
      return this.isValidIndRequestForm;
    },
    compRequestAvailable() {
      return this.isValidCompRequestForm;
    },
    kontur_ind_data() {
      return {
        fio: this.kontur.fio,
        birthday: this.kontur.birthday,
        passport_number: this.kontur.passport_number,
        ind_inn: this.kontur.inn ? this.kontur.inn : '-',
        created_at: this.kontur.created_at,
        updated_at: this.kontur.updated_at
      }
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
    birthdayChange() {
      this.$refs.birthday.save(this.ind_data.birthday);
    },
    sendIndKYCRequest() {
      let self = this;
      let formData = new FormData();
      if (this.ind_data['file_ps'] && this.ind_data['file_ps'].name) {
        formData.append('file_ps', this.ind_data['file_ps'], this.ind_data['file_ps'].name);
      }
      if (this.ind_data['file_ws'] && this.ind_data['file_ws'].name) {
        formData.append('file_ws', this.ind_data['file_ws'], this.ind_data['file_ws'].name);
      }
      if (this.ind_data['file_ts'] && this.ind_data['file_ts'].name) {
        formData.append('file_ts', this.ind_data['file_ts'], this.ind_data['file_ts'].name);
      }
      _.each(this.ind_data, function (value, key) {
        if (value !== null) formData.append(key, value);
      });

      axios.post('/trader/ext/kyc_kontur_ind_request', formData)
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
    sendCompKYCRequest() {
      axios.post('/trader/ext/kyc_kontur_comp_request', this.comp_data).then(response => {
        if (response.data.success === true) {
          console.log(response.data);
          this.$store.dispatch('user/getKonturData');
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