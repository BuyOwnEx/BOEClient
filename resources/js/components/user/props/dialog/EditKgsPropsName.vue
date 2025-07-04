<template>
  <v-dialog v-model="dialog" width="600">
    <template #activator="{ on, attrs }">
      <v-btn
          icon
          plain
          v-bind="attrs" v-on="on"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="common-dialog__title common-dialog__title--success">
        {{ $t('user.props.dialog.edit.title') }}
      </v-card-title>
      <v-card-text class="common-dialog__content pt-2 pb-0">
        <v-form v-model="valid">
          <v-row class="mb-2 mt-1">
            <v-col cols="12" md="12" class="pt-0 pb-0">
              <v-text-field
                  v-model="form.name"
                  counter="64"
                  :label="$t('user.props.dialog.edit.name')"
                  :rules="[rules.required, rules.max64char, rules.propName]"
                  :hint="$t('user.props.dialog.edit.name_hint')"
                  :error-messages="errors.name"
                  persistent-hint
                  clearable
                  required
                  outlined
                  autofocus
                  @input="errors.name = []"
              >
                <template #label>
                  {{ $t('user.props.dialog.edit.name') }} <span class="red--text"><b>*</b></span>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-divider />
        <v-card-actions class="common-dialog__actions">
          <v-spacer />
          <v-btn small tile text plain @click="close">
            {{ $t('common.close') }}
          </v-btn>
          <v-spacer />
          <v-btn :loading="loading" :disabled="emptyName" color="primary" small tile text plain @click="edit">
            {{ $t('common.edit') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import formValidationRules from '@/mixins/common/formValidationRules';
import loadingMixin from '@/mixins/common/loadingMixin';
import showNotificationMixin from '@/mixins/common/showNotificationMixin';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin';
import validateInputMixin from '@/mixins/common/validateInputMixin.js';
import { mapActions } from 'vuex';
export default {
  name: 'EditKgsPropsName',
  props: {
    kgs_props: {
      type: Object,
      required: true
    },
  },
  mixins: [formValidationRules, loadingMixin, showNotificationMixin, dialogMethodsMixin, validateInputMixin],
  data() {
    return {
      valid: false,
      form: {
        id: this.kgs_props.id,
        name: this.kgs_props.name
      },
      errors: {
        name: [],
      }
    };
  },
  computed: {
    emptyName() {
      return !this.form.name?.trim();
    },
  },
  methods: {
    ...mapActions({
      editKgsPropsNameStore: 'user/editKgsPropsName',
    }),
    async edit() {
      if (!this.valid) return;
      try {
        this.startLoading();
        const payload = {
          id: this.form.id,
          name: this.form.name,
        };
        const success = await this.editKgsPropsNameStore(payload);
        if (success) {
          await this.$store.dispatch('user/getKgsPropsFromServer');
        }
        this.close();
      }
      catch (e) {
        console.log(e);
      }
      finally {
        this.stopLoading();
      }
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>

<style scoped>

</style>