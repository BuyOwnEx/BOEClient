<template>
  <v-card class="user-verification-tab tab-fill-height d-flex flex-column">
    <v-card-title>{{ $t('user.title.verification') }}</v-card-title>
    <v-card-text class="d-flex flex-column flex-grow-1" v-if="loaded">
      <v-stepper v-model="step" class="d-flex flex-column flex-grow-1">
        <v-stepper-header>
          <v-stepper-step class="pa-0" :complete="step > 1" step="1">
            {{ $t('kyc.fill_all_fields') }}
          </v-stepper-step>

          <v-divider />

          <div v-if="is_payment_required">
            <v-stepper-step class="pa-0" :complete="step > 2" step="2">
              {{ $t('kyc.make_payment') }}
            </v-stepper-step>

            <v-divider />
          </div>

          <v-stepper-step class="pa-0" :complete="is_payment_required ? step > 3 : step > 2" :step="is_payment_required ? 3 : 2">
            {{ $t('kyc.step_pending') }}
          </v-stepper-step>

          <v-divider />

          <v-stepper-step class="pa-0" :complete="is_payment_required ? step === 4 : step === 3" :step="is_payment_required ? 4 : 3">
            {{ $t('kyc.step_accepted') }}
          </v-stepper-step>

        </v-stepper-header>
        <v-stepper-content class="pa-0" step="1">
          <v-row v-if="reason !== null">
            <v-col class="pb-1 pt-1" cols="12" md="12">
              <v-card class="user-account-tab-verification-reject-alert">
                <v-card-title>{{ $t('kyc.rejected_alert.title') }}</v-card-title>
                <v-card-subtitle>
                  <span class="text-decoration-underline font-weight-bold">{{ $t('kyc.rejected_alert.reason') }}:</span>
                  <span class="font-italic caption">{{ reason }}</span>
                </v-card-subtitle>
                <v-card-subtitle> {{ $t('kyc.rejected_alert.support') }} </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-text-field
                  v-model="data.first_name"
                  :label="$t('kyc.first_name')"
                  :hint="$t('kyc.first_name_hint')"
                  :rules="[rules.required]"
                  :error-messages="errors.first_name"
                  persistent-hint
                  clearable
                  required
                  class="required"
                  @input="errors.first_name = []"
              >
              </v-text-field>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-text-field
                  v-model="data.second_name"
                  :label="$t('kyc.second_name')"
                  :hint="$t('kyc.second_name_hint')"
                  :rules="[rules.required]"
                  :error-messages="errors.second_name"
                  persistent-hint
                  clearable
                  required
                  class="required"
                  @input="errors.second_name = []"
              >
              </v-text-field>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-text-field
                  v-model="data.surname"
                  :label="$t('kyc.surname')"
                  :hint="$t('kyc.surname_hint')"
                  :rules="[rules.required]"
                  :error-messages="errors.surname"
                  persistent-hint
                  clearable
                  required
                  class="required"
                  @input="errors.surname = []"
              >
              </v-text-field>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-select
                  v-model="data.sex"
                  :items="all_sex"
                  item-text="name"
                  item-value="name"
                  :label="$t('kyc.sex')"
                  :hint="$t('kyc.sex_hint')"
                  :rules="[rules.required]"
                  persistent-hint
                  hide-details="auto"
                  clearable
                  required
                  class="required"
              ></v-select>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-menu
                  ref="birthday"
                  v-model="birthday"
                  :close-on-content-click="false"
                  :return-value.sync="data.birthday"
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                      v-model="data.birthday"
                      class="required"
                      :label="$t('kyc.birthday')"
                      :hint="$t('kyc.birthday_hint')"
                      :rules="[rules.required]"
                      persistent-hint
                      hide-details="auto"
                      readonly
                      required
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="data.birthday" no-title scrollable @change="birthdayChange"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-text-field
                  v-model="data.birthday_place"
                  :label="$t('kyc.birthday_place')"
                  :hint="$t('kyc.birthday_place_hint')"
                  :rules="[rules.required]"
                  :error-messages="errors.birthday_place"
                  persistent-hint
                  clearable
                  required
                  class="required"
                  @input="errors.birthday_place = []"
              >
              </v-text-field>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-text-field
                  v-model="data.passport_no"
                  :label="$t('kyc.passport_no')"
                  :hint="$t('kyc.passport_no_hint')"
                  :rules="[rules.required]"
                  :error-messages="errors.passport_no"
                  persistent-hint
                  clearable
                  required
                  class="required"
                  @input="errors.passport_no = []"
              >
              </v-text-field>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-text-field
                  v-model="data.passport_place"
                  :label="$t('kyc.passport_place')"
                  :hint="$t('kyc.passport_place_hint')"
                  :rules="[rules.required]"
                  :error-messages="errors.passport_place"
                  persistent-hint
                  clearable
                  required
                  class="required"
                  @input="errors.passport_place = []"
              >
              </v-text-field>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-menu
                  ref="passport_date"
                  v-model="passport_date"
                  :close-on-content-click="false"
                  :return-value.sync="data.passport_date"
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                      v-model="data.passport_date"
                      class="required"
                      :label="$t('kyc.passport_date')"
                      :hint="$t('kyc.passport_date_hint')"
                      :rules="[rules.required]"
                      persistent-hint
                      hide-details="auto"
                      readonly
                      required
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="data.passport_date" no-title scrollable @change="passportDateChange"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="12">
              <v-text-field
                  v-model="data.address"
                  :label="$t('kyc.address')"
                  :hint="$t('kyc.address_hint')"
                  :rules="[rules.required]"
                  :error-messages="errors.address"
                  persistent-hint
                  clearable
                  required
                  class="required"
                  @input="errors.address = []"
              >
              </v-text-field>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-file-input
                  v-model="data.file_ps"
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
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-file-input
                  v-model="data.file_ws"
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
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4">
              <v-file-input
                  v-model="data.file_ts"
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
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4" v-if="this.image_ps !== null">
              <div class="d-flex align-center justify-center fill-height">
                <v-img
                    max-height="200"
                    max-width="300"
                    :src="'/trader/ext/get_image?type=ps&path='+this.image_ps"
                >
                </v-img>
              </div>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4" v-if="this.image_ws !== null">
              <div class="d-flex align-center justify-center fill-height">
                <v-img
                    max-height="200"
                    max-width="300"
                    :src="'/trader/ext/get_image?type=ws&path='+this.image_ws"
                >
                </v-img>
              </div>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="4" v-if="this.image_ts !== null">
              <div class="d-flex align-center justify-center fill-height">
                <v-img
                    max-height="200"
                    max-width="300"
                    :src="'/trader/ext/get_image?type=ts&path='+this.image_ts"
                >
                </v-img>
              </div>
            </v-col>
          </v-row>
        </v-stepper-content>
        <v-stepper-content v-if="is_payment_required" class="pa-0" step="2">
          <v-row v-if="reason !== null">
            <v-col class="pb-1 pt-1" cols="12" md="12">
              <v-card class="user-account-tab-verification-reject-alert">
                <v-card-title>{{ $t('kyc.rejected_alert.title') }}</v-card-title>
                <v-card-subtitle>
                  <span class="text-decoration-underline font-weight-bold">{{ $t('kyc.rejected_alert.reason') }}:</span>
                  <span class="font-italic caption">{{ reason }}</span>
                </v-card-subtitle>
                <v-card-subtitle> {{ $t('kyc.rejected_alert.support') }} </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pb-1 pt-1" cols="12" md="12">
              <div class="d-flex align-center justify-center fill-height">
                <QrCode v-if="this.bank_details !== null" :value="qr_verification" :options="{ width: 200 }" />
              </div>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="12">
              <div class="d-flex flex-column align-center justify-center fill-height">
                <div class="d-flex">{{ $t('kyc.bank_detail_description') }}</div>
                <div class="d-flex red--text">{{ $t('kyc.bank_detail_caution') }}</div>
                <div class="mt-2 d-flex red--text">{{ $t('kyc.bank_detail_purchase',[$t('kyc.purchase')]) }}</div>
              </div>
            </v-col>
          </v-row>
        </v-stepper-content>
        <v-stepper-content class="pa-0" :step="is_payment_required ? 3 : 2">
          <v-row>
            <v-col class="pb-1 pt-1" cols="12" md="12">
              <div class="d-flex align-center justify-center fill-height">
                <div class="text-center">
                  <v-avatar
                      color="primary"
                      size="256"
                  >
                    <v-icon dark size="196px">
                      mdi-clock
                    </v-icon>
                  </v-avatar>
                </div>
              </div>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="12">
              <div class="d-flex flex-column align-center justify-center fill-height">
                <div class="d-flex">{{ $t('kyc.bank_detail_pending') }}</div>
              </div>
            </v-col>
          </v-row>
        </v-stepper-content>
        <v-stepper-content class="pa-0" :step="is_payment_required ? 4 : 3">
          <v-row>
            <v-col class="pb-1 pt-1" cols="12" md="12">
              <div class="d-flex align-center justify-center fill-height">
                <div class="text-center">
                  <v-avatar
                      color="success"
                      size="256"
                  >
                    <v-icon dark size="196px">
                      mdi-check
                    </v-icon>
                  </v-avatar>
                </div>
              </div>
            </v-col>
            <v-col class="pb-1 pt-1" cols="12" md="12">
              <div class="d-flex flex-column align-center justify-center fill-height">
                <div class="d-flex">{{ $t('kyc.bank_detail_accepted') }}</div>
              </div>
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper>
    </v-card-text>
    <v-card-actions v-if="loaded">
      <v-spacer />
      <v-btn v-if="step === 1 && verification_id === 0"
          :loading="false"
          color="primary"
          tile
          text
          plain
          small
          @click="sendKYCRequest"
      >
        {{ $t('common.continue') }}
      </v-btn>
      <v-btn v-if="step === 1 && verification_id !== 0"
             :loading="false"
             color="primary"
             tile
             text
             plain
             small
             @click="sendKYCFix"
      >
        {{ $t('common.continue') }}
      </v-btn>
      <v-btn v-if="step === 2 && is_payment_required"
             :loading="false"
             color="primary"
             tile
             text
             plain
             small
             @click="sendKYCPurchase"
      >
        {{ $t('kyc.purchase') }}
      </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
import QrCode from '@chenfengyuan/vue-qrcode';
import formValidationRules from '../../../mixins/common/formValidationRules';
import moment from 'moment';

export default {
  name: 'UserLocalVerificationTab',
  components: { QrCode },
  mixins: [formValidationRules],
  data() {
    return {
      payment_required: null,
      step: 1,
      birthday: false,
      passport_date: false,
      bank_details: null,
      verification_id: null,
      image_ps: null,
      image_ws: null,
      image_ts: null,
      reason: null,
      loaded: false,
      data: {
        first_name: '',
        second_name: '',
        surname: '',
        sex: null,
        birthday: null,
        birthday_place: '',
        passport_no: '',
        passport_place: '',
        passport_date: null,
        address: null,
        file_ps: null,
        file_ws: null,
        file_ts: null
      },
      errors: {
        first_name: [],
        second_name: [],
        surname: [],
        sex: [],
        birthday: [],
        birthday_place: [],
        passport_no: [],
        passport_place: [],
        passport_date: [],
        address: [],
        file_ps: [],
        file_ws: [],
        file_ts: []
      },
      all_sex: [{id: 1, name: 'male'}, {id: 2, name: 'female'}],
    };
  },
  computed: {
    qr_verification() {
      return this.bank_details ?
          'ST00012|Name='+this.bank_details.name+
          '|PersonalAcc='+this.bank_details.personal_acc+
          '|BankName='+this.bank_details.bank_name+
          '|BIC='+this.bank_details.bic+
          '|CorrespAcc='+this.bank_details.corr_acc+
          '|KPP='+this.bank_details.kpp+
          '|PayeeINN='+this.bank_details.payee_inn+
          '|Purpose='+this.bank_details.purpose+
          '|Sum='+this.bank_details.sum.String
          : '';
    },
    is_payment_required() {
      return this.payment_required === true;
    },
  },
  methods: {
    birthdayChange() {
      this.$refs.birthday.save(this.data.birthday);
    },
    passportDateChange() {
      this.$refs.passport_date.save(this.data.passport_date);
    },
    sendKYCPurchase() {
      axios.post('/trader/ext/kyc_payment')
      .then(response => {
        if (response.data.success === true) {
          this.step++;
        }
      });
    },
    sendKYCRequest() {
      let self = this;
      let formData = new FormData();
      if (this.data['file_ps'] && this.data['file_ps'].name) {
        formData.append('file_ps', this.data['file_ps'], this.data['file_ps'].name);
      }
      if (this.data['file_ws'] && this.data['file_ws'].name) {
        formData.append('file_ws', this.data['file_ws'], this.data['file_ws'].name);
      }
      if (this.data['file_ts'] && this.data['file_ts'].name) {
        formData.append('file_ts', this.data['file_ts'], this.data['file_ts'].name);
      }
      _.each(this.data, function (value, key) {
        if (value !== null) formData.append(key, value);
      });

      axios.post('/trader/ext/kyc_request', formData)
      .then(response => {
        if (response.data.success === true) {
          console.log(response.data);
          this.verification_id = response.data.data;
          if (self.data.paid)
            this.step=3;
          else
            this.step++;
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
    sendKYCFix() {
      let self = this;
      let formData = new FormData();
      if (this.data['file_ps'] && this.data['file_ps'].name) {
        formData.append('file_ps', this.data['file_ps'], this.data['file_ps'].name);
      }
      if (this.data['file_ws'] && this.data['file_ws'].name) {
        formData.append('file_ws', this.data['file_ws'], this.data['file_ws'].name);
      }
      if (this.data['file_ts'] && this.data['file_ts'].name) {
        formData.append('file_ts', this.data['file_ts'], this.data['file_ts'].name);
      }
      _.each(this.data, function (value, key) {
        if (value !== null) formData.append(key, value);
      });

      axios.post('/trader/ext/kyc_fix', formData)
          .then(response => {
            if (response.data.success === true) {
              console.log(response.data);
              this.verification_id = response.data.data;
              if(this.data.paid && this.is_payment_required)
                this.step = 3;
              else
                this.step = 2;
              this.reason = null;
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
    this.payment_required = process.env.MIX_VERIFICATION_PAYMENT_REQUIRED ?? true;
    console.log(this.payment_required);
    axios.get('/trader/ext/kyc_request').then(response => {
      if(response.data.data.id !== 0)
      {
        this.verification_id = response.data.data.id;
        this.image_ps = response.data.data.file_ps;
        this.image_ws = response.data.data.file_ws;
        this.image_ts = response.data.data.file_ts;
        this.data = response.data.data;
        this.data.file_ps = null;
        this.data.file_ws = null;
        this.data.file_ts = null;
        this.data.birthday = response.data.data.birthday !== "" ? moment(response.data.data.birthday).format('YYYY-MM-DD') : "";
        this.data.passport_date = response.data.data.passport_date !== "" ? moment(response.data.data.passport_date).format('YYYY-MM-DD') : "";
        if(response.data.data.verify_status === 'rejected')
          this.step = 1;
        if(response.data.data.verify_status === 'new' && response.data.data.paid === false)
          this.step = 2;
        if(response.data.data.verify_status === 'pending')
          this.step = this.is_payment_required ? 3 : 2;
        if(response.data.data.verify_status === 'accepted')
          this.step = this.is_payment_required ? 4 : 3;
        if(response.data.data.reason.String !== "")
          this.reason = response.data.data.reason.String;
      }
      this.loaded = true;
    });
    axios.get('/trader/ext/verification_bank_details').then(response => {
      this.bank_details = response.data.data;
    });
  }
};
</script>

<style lang="sass" scoped>
.user-account-tab-verification-reject-alert
  color: white !important
  margin-bottom: 5px
  background: #ff7365d6
  ::v-deep.v-card__subtitle
    color: white !important
</style>