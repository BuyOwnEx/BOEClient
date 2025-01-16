<template>
  <v-card class="user-verification-tab d-flex flex-column">
    <v-card-text class="d-flex flex-row flex-grow-1" v-if="loaded">
      <v-row class="d-flex flex-grow-1 justify-space-between" v-if="kyc_state === null || (kyc_state === 'finish' && !is_verified)">
        <v-col class="pb-1 pt-1" cols="12" md="5">
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
                    :rules="[rules.required, rules.ind_inn]"
                    v-mask="'############'"
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
  name: 'KonturIndividual',
  mixins: [
    formValidationRules,
    formatDate
  ],
  data() {
    return {
      isValidIndRequestForm: false,
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
      errors: {
        fio: [],
        birthday: [],
        passport_number: [],
        ind_inn: [],
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

    kyc_state() {
      return this.kontur.id !== null ? this.kontur.state : null
    },
    is_verified() {
      return this.kontur.id !== null ? this.kontur.is_verified : null
    },
    indRequestAvailable() {
      return this.isValidIndRequestForm;
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