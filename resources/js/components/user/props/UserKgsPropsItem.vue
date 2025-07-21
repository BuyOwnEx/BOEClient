<template>
  <v-card class="props-item">
    <v-card-title class="props-item__title" :class="getBackgroundClassColor">
      <div class="props-item__name">{{ propItem.name }}</div>
      <div :class="[$vuetify.rtl ? 'mr-1' : 'ml-1']">
        <edit-props :kgs_props="propItem" />
        <delete-props :kgs_props="propItem" :two-fa="twoFa"></delete-props>
      </div>
    </v-card-title>

    <v-divider />

    <div class="props-item__content pa-2 d-flex justify-space-between">
      <div class="props-item__info-wrapper">
        <div class="props-item__owner-wrapper d-flex">
          <div class="d-flex flex-column mr-2">
            <div class="props-item__header">
              {{ $t('user.props.headers.owner_name') }}
            </div>
            <div class="props-item__owner_name">
              {{ propItem.owner_name }}
            </div>
          </div>
          <div class="d-flex flex-column mr-2">
            <div class="props-item__header">
              {{ $t('user.props.headers.inn') }}
            </div>
            <CommonCopyLabel :text="propItem.inn" />
          </div>
        </div>
        <div class="props-item__acc-wrapper d-flex">
          <div class="d-flex flex-column mr-2">
            <div class="props-item__header">
              {{ $t('user.props.headers.acc') }}
            </div>
            <CommonCopyLabel :text="propItem.acc" />
          </div>
        </div>
        <div class="props-item__bank-wrapper d-flex">
          <div class="d-flex flex-column mr-2">
            <div class="props-item__header">
              {{ $t('user.props.headers.bic') }}
            </div>
            <CommonCopyLabel :text="propItem.bic" />
          </div>
          <div class="d-flex flex-column mr-2">
            <div class="props-item__header">
              {{ $t('user.props.headers.bank_name') }}
            </div>
            <CommonCopyLabel :text="getBankName" />
          </div>
          <div class="d-flex flex-column">
            <div class="props-item__header">
              {{ $t('user.props.headers.corr_acc') }}
            </div>
            <CommonCopyLabel :text="propItem.corr_acc" />
          </div>
        </div>
      </div>
      <div class="props-item__status-wrapper d-flex">
        <div class="props-item__state-wrapper d-flex">
          <div class="d-flex flex-column">
            <div class="props-item__header">
              {{ $t('user.props.headers.state') }}
            </div>
            <div class="props-item__state" :class="getTextClassColor">
              {{ getStateName }}
            </div>
          </div>
        </div>
        <div class="props-item__created-key-wrapper d-flex">
          <div class="d-flex flex-column">
            <div class="props-item__header">
              {{ $t('user.props.headers.created') }}
            </div>
            <div class="props-item__created">
              {{ formatDate(propItem.created_at) }}
            </div>
          </div>
        </div>
        <div class="props-item__updated-key-wrapper d-flex">
          <div class="d-flex flex-column">
            <div class="props-item__header">
              {{ $t('user.props.headers.updated') }}
            </div>
            <div class="props-item__updated">
              {{ formatDate(propItem.updated_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import EditProps from '@/components/user/props/dialog/EditKgsPropsName.vue';
import DeleteProps from '@/components/user/props/dialog/DeleteKgsProps.vue';
import CommonCopyLabel from '@/components/common/CommonCopyLabel.vue';
import formatDate from '@/mixins/format/formatDate';
export default {
  name: 'UserKgsPropsItem',
  components: {
    EditProps,
    DeleteProps,
    CommonCopyLabel
  },
  mixins: [formatDate],
  props: {
    twoFa: {
      type: Boolean,
      required: true,
    },
    propItem: {
      type: Object,
      required: true,
    },
  },
  computed: {
    getStateName() {
      return this.$t('user.props.states.'+this.propItem.state.toLowerCase());
    },
    getBankName() {
      return this.propItem.bank_name;
    },
    getBackgroundClassColor() {
      if (this.propItem.state === 'KP_CONFIRMED')
        return 'props-item__title--success';
      else if (this.propItem.state === 'KP_REJECTED')
        return 'props-item__title--error';
      else if (this.propItem.state === 'KP_ENTERED')
        return 'props-item__title--warning';
      else if (this.propItem.state === 'KP_DELETED')
        return 'props-item__title--deleted';
    },
    getTextClassColor() {
      if (this.propItem.state === 'KP_CONFIRMED')
        return 'props-item__state--success';
      else if (this.propItem.state === 'KP_REJECTED')
        return 'props-item__state--error';
      else if (this.propItem.state === 'KP_ENTERED')
        return 'props-item__state--warning';
      else if (this.propItem.state === 'KP_DELETED')
        return 'props-item__state--deleted';
    },
  },
};
</script>

<style lang="sass" scoped>
.user-props__item:not(:first-child)
  margin-top: 4px
.props-item
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: unset
  &__title
    font-size: 1rem
    line-height: 1rem
    flex-wrap: nowrap
    white-space: nowrap
    justify-content: space-between

    &--success
      background-color: #4caf5085
    &--error
      background-color: #ff525285
    &--warning
      background-color: #ffc10785
    &--deleted
      background-color: #64646485

  &__state
    &--success
      color: #4caf5085
    &--error
      color: #ff525285
    &--warning
      color: #ffc10785
    &--deleted
      color: #ff525285

  &__owner_name
    color: var(--v-secondary-base)
    font-size: 1rem
    line-height: 1.5
    font-weight: bold
    margin-top: 2px

  &__header
    font-size: 0.8rem
    line-height: 0.8
    font-weight: 500
    padding-top: 8px
    color: rgba(0, 0, 0, 0.6)

  &__name
    text-overflow: ellipsis
    overflow: hidden

  &__content
    display: flex

  &__status-wrapper
    flex-direction: column
    text-align: end !important
    align-items: end

  &__owner-wrapper
    .props-item__header
      padding-top: 0
  ::v-deep.CommonCopyLabel
    font-size: 1rem
  ::v-deep span.copy-label
    border-bottom: none
    text-decoration-line: underline
    text-decoration-thickness: 1px
    text-decoration-style: dashed
    text-underline-offset: 4px
    text-decoration-color: rgba(0, 0, 0, 0.5)

  @media screen and (max-width: 599px)
    &__content
      display: flex
      flex-flow: column
    &__status-wrapper
      flex-direction: row
      margin-top: 12px
      padding-top: 8px
      border-top: 1px solid rgba(0, 0, 0, 0.12)
      text-align: start !important
      justify-content: space-between !important
    &__updated
      font-size: 0.65rem
    &__created
      font-size: 0.65rem
.theme--dark
  .props-item
    border: 1px solid rgba(255, 255, 255, 0.12)
    &__header
      color: rgba(255, 255, 255, 0.6)
    ::v-deep span.copy-label
      text-decoration-color: rgba(255, 255, 255, 0.5)
    @media screen and (max-width: 599px)
      &__status-wrapper
        border-top: 1px solid rgba(255, 255, 255, 0.12)
</style>