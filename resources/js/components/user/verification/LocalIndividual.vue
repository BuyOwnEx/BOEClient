<template>
  <v-card class="user-verification-tab fill-height d-flex flex-column">
    <v-card-text class="d-flex flex-column flex-grow-1" v-if="loaded">
      <v-row class="d-flex flex-grow-1 justify-space-between" v-if="kyc_state === null || (kyc_state === 'rejected' && !is_verified)">
        <v-col class="pb-1 pt-1" cols="12" md="5">
          <v-card class="user-account-tab-verification-description">
            <v-card-title>{{ $t('kyc.manual.individual.title') }}</v-card-title>
            <v-card-subtitle>
              <span class="font-italic caption">{{ $t('kyc.manual.individual.description') }}</span>
            </v-card-subtitle>
          </v-card>
          <v-card>
            <v-card-text>
              <v-form v-model="isValidIndRequestForm">
                <v-select
                    v-if="resident === 'non_resident'"
                    v-model="ind_data.country"
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
                    class="required mb-1"
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
                    v-model="ind_data.fio"
                    :label="$t('kyc.manual.individual.form.fio')"
                    :hint="$t('kyc.manual.individual.hints.fio')"
                    :rules="[rules.required, show_global_form ? rules.fio_global : rules.fio]"
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
                        :label="$t('kyc.manual.individual.form.birthday')"
                        :hint="$t('kyc.manual.individual.hints.birthday')"
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
                    v-model="ind_data.document_number"
                    :label="$t('kyc.manual.individual.form.document_number')"
                    :hint="$t('kyc.manual.individual.hints.document_number')"
                    :rules="[rules.required, show_global_form ? rules.document_number : rules.passport_number]"
                    v-mask="document_mask"
                    :error-messages="errors.document_number"
                    persistent-hint
                    clearable
                    required
                    class="required mb-1"
                    @input="errors.document_number = []"
                >
                </v-text-field>

                <v-text-field
                    v-model="ind_data.ind_inn"
                    :label="$t('kyc.manual.individual.form.inn')"
                    :hint="$t('kyc.manual.individual.hints.inn')"
                    :rules="[rules.required, show_global_form ? rules.ind_inn_global : rules.ind_inn]"
                    v-mask="tax_id_mask"
                    :error-messages="errors.ind_inn"
                    persistent-hint
                    clearable
                    required
                    class="required mb-1"
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
        </v-col>
        <v-col class="pb-1 pt-1" cols="12" md="2">
        </v-col>
        <v-col class="pb-1 pt-1" cols="12" md="5">
          <v-card class="user-account-tab-result" v-if="kyc_state === 'rejected' && !is_verified">
            <v-card-subtitle>
              <v-alert
                  :icon="kyc_state_icon(kyc_state, is_verified)"
                  text
                  :type="kyc_state_alert_type(kyc_state, is_verified)"
                  class="mb-1"
              >
                {{ kyc_state_alert_text(kyc_state, is_verified) }}
              </v-alert>
              <span class="font-italic caption red--text" v-if="local_ind_data.reason"> {{ $t('kyc.rejected_alert.reason') }}: {{ local_ind_data.reason }}</span>
            </v-card-subtitle>
            <v-card-text>
              <div class="kyc-local-item__info-wrapper">

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.individual.form.fio_brief') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_ind_data.fio }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.individual.form.birthday') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_ind_data.birthday }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.individual.form.document_number') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_ind_data.document_number }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.individual.form.inn') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_ind_data.ind_inn }}</div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.manual.ps_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.manual.ws_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.manual.ts_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.created_at') }}
                  </div>
                  <div class="kyc-local-item__created">
                    {{ formatDate(local_ind_data.created_at) }}
                  </div>
                </div>
                <div class="kyc-local-item__updated-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.updated_at') }}
                  </div>
                  <div class="kyc-local-item__updated">
                    {{ formatDate(local_ind_data.updated_at) }}
                  </div>
                </div>

              </div>
            </v-card-text>

          </v-card>
        </v-col>
      </v-row>
      <v-row class="d-flex flex-grow-1 justify-space-between" v-else-if="(kyc_state === 'accepted' && is_verified) || kyc_state === 'new'">
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
              <div class="kyc-local-item__info-wrapper">

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.individual.form.fio_brief') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_ind_data.fio }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.individual.form.birthday') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_ind_data.birthday }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.individual.form.document_number') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_ind_data.document_number }}</div>
                </div>

                <div class="kyc-local-item__secret-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.individual.form.inn') }}
                  </div>
                  <div class="kyc-local-item__secret-key">{{ local_ind_data.ind_inn }}</div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.manual.ps_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.manual.ws_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    <v-icon small color="green darken-2">
                      mdi-check
                    </v-icon>
                    <span class="ml-1">{{ $t('kyc.manual.ts_file_uploaded') }}</span>
                  </div>
                </div>

                <div class="kyc-local-item__created-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.created_at') }}
                  </div>
                  <div class="kyc-local-item__created">
                    {{ formatDate(local_ind_data.created_at) }}
                  </div>
                </div>
                <div class="kyc-local-item__updated-key-wrapper">
                  <div class="kyc-local-item__header">
                    {{ $t('kyc.manual.updated_at') }}
                  </div>
                  <div class="kyc-local-item__updated">
                    {{ formatDate(local_ind_data.updated_at) }}
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
  name: 'LocalIndividual',
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
      isValidIndRequestForm: false,
      birthday: false,
      loaded: false,
      ind_data: {
        country: this.resident === 'resident' ? this.residentCountry : null,
        fio: null,
        birthday: null,
        document_number: null,
        ind_inn: null,
        created_at: null,
        updated_at: null,
        file_ps: null,
        file_ws: null,
        file_ts: null
      },
      errors: {
        fio: [],
        birthday: [],
        document_number: [],
        ind_inn: [],
        file_ps: [],
        file_ws: [],
        file_ts: []
      },
      countries: [],
    };
  },
  computed: {
    ...mapState({
      kyc_local_ind: state => state.user.kyc_local_ind,
    }),
    countries_available() {
      return _.filter(this.countries, (item) => { return item.iso !== this.residentCountry});
    },
    kyc_state() {
      return this.kyc_local_ind.id !== null ? this.kyc_local_ind.state : null
    },
    is_verified() {
      return this.kyc_local_ind.id !== null ? this.kyc_local_ind.is_verified : null
    },
    indRequestAvailable() {
      return this.isValidIndRequestForm;
    },
    local_ind_data() {
      return {
        fio: this.kyc_local_ind.fio,
        birthday: this.kyc_local_ind.birthday,
        document_number: this.kyc_local_ind.document_number,
        ind_inn: this.kyc_local_ind.inn ? this.kyc_local_ind.inn : '-',
        created_at: this.kyc_local_ind.created_at,
        updated_at: this.kyc_local_ind.updated_at,
        reason: this.kyc_local_ind.reason ? this.kyc_local_ind.reason : null,
      }
    },
    show_global_form() {
      return (this.residentCountry === 'RU' && this.resident === 'non_resident') || (this.residentCountry !== 'RU' && this.ind_data.country !== 'RU')
    },
    document_mask() {
      return !this.show_global_form ? '#### ######' : null;
    },
    tax_id_mask() {
      return !this.show_global_form ? '############' : null;
    }
  },
  methods: {
    ...mapMutations({
      setStateLocalKYCStore: 'user/setKYCLocalIndState',
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

      axios.post('/trader/ext/kyc_local_ind_request', formData)
          .then(response => {
            if (response.data.success === true) {
              this.$store.dispatch('user/getKYCLocalIndData');
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
    this.$store.dispatch('user/getKYCLocalIndData').then( res => {
      this.loaded = true;
    });
  }
};
</script>

<style scoped>

</style>