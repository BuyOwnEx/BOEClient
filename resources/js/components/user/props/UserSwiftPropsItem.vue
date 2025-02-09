<template>
  <v-card class="props-item">
    <v-card-title class="props-item__title" :class="getBackgroundClassColor">
      <div class="props-item__name">{{ propItem.name }}</div>
      <div :class="[$vuetify.rtl ? 'mr-1' : 'ml-1']">
        <edit-props :swift_props="propItem" />
        <delete-swift-props :swift_props="propItem" :two-fa="twoFa"></delete-swift-props>
      </div>
    </v-card-title>

    <v-divider />

    <div class="props-item__content pa-2 pt-1 d-flex justify-space-between">
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
              {{ $t('user.props.headers.currency') }}
            </div>
            <div class="props-item__currency">
              {{ propItem.currency }}
            </div>
          </div>
          <div class="d-flex flex-column mr-2">
            <div class="props-item__header">
              {{ $t('user.props.headers.inn') }}
            </div>
            <CommonCopyLabel :text="propItem.inn" />
          </div>
          <div class="d-flex flex-column" v-if="propItem.kpp">
            <div class="props-item__header">
              {{ $t('user.props.headers.kpp') }}
            </div>
            <CommonCopyLabel :text="propItem.kpp" />
          </div>
        </div>
        <div class="props-item__swift-props">
          <div class="props-item__beneficiary-wrapper d-flex mr-2">
            <fieldset class="pa-2 pt-0">
              <legend class="pr-1 pl-1 mt-1">
                {{ $t('user.props.legends.beneficiary') }}
              </legend>
              <div class="d-flex flex-column mr-2">
                <div class="props-item__header">
                  {{ $t('user.props.headers.field_59_acc') }}
                </div>
                <CommonCopyLabel :text="propItem.field_59_acc" />
              </div>
              <div class="d-flex flex-column mr-2">
                <div class="props-item__header">
                  {{ $t('user.props.headers.field_59_name') }}
                </div>
                <CommonCopyLabel :text="propItem.field_59_name_addr_1" />
              </div>
              <div class="d-flex flex-column mr-2">
                <div class="props-item__header">
                  {{ $t('user.props.headers.field_59_addr') }}
                </div>
                <CommonCopyLabel :text="beneficiary_address" />
              </div>
            </fieldset>
          </div>
          <div class="props-item__intermediary-bank-wrapper d-flex mr-2" v-if="propItem.field_56_bic">
            <fieldset class="pa-2 pt-0">
              <legend class="pr-1 pl-1 mt-1">
                {{ $t('user.props.legends.intermediary_bank') }}
              </legend>
              <div class="d-flex flex-column mr-2">
                <div class="props-item__header">
                  {{ $t('user.props.headers.field_56_bic') }}
                </div>
                <CommonCopyLabel :text="propItem.field_56_bic" />
              </div>
              <div class="d-flex flex-column mr-2">
                <div class="props-item__header">
                  {{ $t('user.props.headers.field_56_name') }}
                </div>
                <CommonCopyLabel :text="propItem.field_56_name_addr_1" />
              </div>
              <div class="d-flex flex-column mr-2">
                <div class="props-item__header">
                  {{ $t('user.props.headers.field_56_addr') }}
                </div>
                <CommonCopyLabel :text="intermediary_bank_address" />
              </div>
            </fieldset>
          </div>
          <div class="props-item__beneficiary-bank-wrapper d-flex">
            <fieldset class="pa-2 pt-0">
              <legend class="pr-1 pl-1 mt-1">
                {{ $t('user.props.legends.beneficiary_bank') }}
              </legend>
              <div class="d-flex flex-column mr-2" v-if="propItem.field_56_bic">
                <div class="props-item__header">
                  {{ $t('user.props.headers.field_57_acc') }}
                </div>
                <CommonCopyLabel :text="propItem.field_57_acc" />
              </div>
              <div class="d-flex flex-column mr-2">
                <div class="props-item__header">
                  {{ $t('user.props.headers.field_57_bic') }}
                </div>
                <CommonCopyLabel :text="propItem.field_57_bic" />
              </div>
              <div class="d-flex flex-column mr-2">
                <div class="props-item__header">
                  {{ $t('user.props.headers.field_57_name') }}
                </div>
                <CommonCopyLabel :text="propItem.field_57_name_addr_1" />
              </div>
              <div class="d-flex flex-column mr-2">
                <div class="props-item__header">
                  {{ $t('user.props.headers.field_57_addr') }}
                </div>
                <CommonCopyLabel :text="beneficiary_bank_address" />
              </div>
            </fieldset>
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
import EditProps from '@/components/user/props/dialog/EditSwift.vue';
import DeleteSwiftProps from '@/components/user/props/dialog/DeleteSwift.vue';
import CommonCopyLabel from '@/components/common/CommonCopyLabel.vue';
import formatDate from '@/mixins/format/formatDate';
export default {
  name: 'UserSwiftPropsItem',
  components: {
    EditProps,
    DeleteSwiftProps,
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
    beneficiary_address() {
      return this.propItem.field_59_name_addr_2 +
          (this.propItem.field_59_name_addr_3 !== null ? this.propItem.field_59_name_addr_3 : '') +
          (this.propItem.field_59_name_addr_4 !== null ? this.propItem.field_59_name_addr_4 : '')
    },
    beneficiary_bank_address() {
      return this.propItem.field_57_name_addr_2 +
          (this.propItem.field_57_name_addr_3 !== null ? ' ' + this.propItem.field_57_name_addr_3 : '') +
          (this.propItem.field_57_name_addr_4 !== null ? ' ' + this.propItem.field_57_name_addr_4 : '')
    },
    intermediary_bank_address() {
      return this.propItem.field_56_name_addr_2 +
          (this.propItem.field_56_name_addr_3 !== null ? ' ' + this.propItem.field_56_name_addr_3 : '') +
          (this.propItem.field_56_name_addr_4 !== null ? ' ' + this.propItem.field_56_name_addr_4 : '')
    },
    getBackgroundClassColor() {
      if (this.propItem.state === 'SP_CONFIRMED')
        return 'props-item__title--success';
      else if (this.propItem.state === 'SP_REJECTED')
        return 'props-item__title--error';
      else if (this.propItem.state === 'SP_ENTERED')
        return 'props-item__title--warning';
      else if (this.propItem.state === 'SP_DELETED')
        return 'props-item__title--deleted';
    },
    getTextClassColor() {
      if (this.propItem.state === 'SP_CONFIRMED')
        return 'props-item__state--success';
      else if (this.propItem.state === 'SP_REJECTED')
        return 'props-item__state--error';
      else if (this.propItem.state === 'SP_ENTERED')
        return 'props-item__state--warning';
      else if (this.propItem.state === 'SP_DELETED')
        return 'props-item__state--deleted';
    },
  },
};
</script>

<style lang="sass" scoped>
fieldset
  border-color: rgba(66, 66, 66, 0.12)
  legend
    line-height: 1
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

  &__owner_name, &__currency
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

  &__swift-props
    display: flex

  @media screen and (max-width: 1264px)
    &__swift-props
      display: block
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
  fieldset
    border-color: rgba(255, 255, 255, 0.12)
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