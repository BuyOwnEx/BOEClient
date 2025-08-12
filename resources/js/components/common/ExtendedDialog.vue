<template>
  <v-dialog v-model="dialog" width="500" :disabled="is_disabled">
    <template #activator="{ on, attrs }">
			<span v-bind="attrs" v-on="on">
				<slot></slot>
			</span>
    </template>

    <v-card class="common-dialog">
      <slot name="card">
        <v-card-title
            class="common-dialog__title"
            :class="getBackgroundClassColor"
        >
          <slot name="title">
            {{ $t('common.confirmation') }}
          </slot>
        </v-card-title>

        <v-card-text class="common-dialog__content pb-1">
          <slot name="content"></slot>
        </v-card-text>

        <v-divider />

        <v-card-actions class="common-dialog__actions">
          <slot name="actions">
            <v-spacer />

            <slot name="close">
              <v-btn small tile text plain @click="close">
                {{ closeText || defaultCloseText }}
              </v-btn>
            </slot>

            <v-spacer />

            <slot name="confirm">
              <v-btn
                  :color="confirmColor"
                  :disabled="disabled"
                  small
                  tile
                  text
                  plain
                  @click="confirm"
              >
                {{ confirmText || defaultConfirmText }}
              </v-btn>
            </slot>

            <v-spacer />
          </slot>
        </v-card-actions>
      </slot>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ExtendedDialog',

  props: {
    confirmText: {
      type: String,
      required: false,
    },
    closeText: {
      type: String,
      required: false,
    },
    isClosable: {
      type: Boolean,
      required: false,
      default: true,
    },
    confirmColor: {
      type: String,
      required: false,
      default: 'primary',
    },
    headerColor: {
      type: String,
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_disabled: {
      type: Boolean,
      required: true,
      default: false,
    }
  },

  data() {
    return {
      dialog: false,
    };
  },

  computed: {
    getBackgroundClassColor() {
      if (this.headerColor === 'success')
        return 'common-dialog__title--success';
      else if (this.headerColor === 'error')
        return 'common-dialog__title--error';
    },
    defaultConfirmText() {
      return this.$t('common.confirm');
    },
    defaultCloseText() {
      return this.$t('common.cancel');
    },
  },

  methods: {
    confirm() {
      this.$emit('confirm');
      if(this.isClosable) this.close();
    },
    close() {
      this.$emit('closed');
      this.dialog = false;
    },
  },
};
</script>

<style lang="sass">
.common-dialog
  &__title
    font-weight: 600 !important
    padding: 8px 24px 8px !important

    &--success
      background-color: var(--v-success-base)
    &--error
      background-color: var(--v-error-base)
    &--primary
      background-color: var(--v-primary-base)

  &__content
    padding-top: 8px !important

  &__actions
    .v-btn
    text-transform: uppercase !important
    letter-spacing: 1px !important

.theme--dark
  .common-dialog
    &__title
      &--success
        background-color: var(--v-success-darken1)
      &--error
        background-color: var(--v-error-darken1)
      &--primary
        background-color: var(--v-primary-darken1)
</style>
