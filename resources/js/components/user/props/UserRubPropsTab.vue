<template>
  <v-card class="user-props-tab tab-fill-height">
    <v-card-title class="user-props-tab__title-wrapper">
      <div class="user-props-tab__title">
        {{ $t('user.props.rub_props_title') }}
      </div>
      <div class="user-props-tab__actions">
        <add :two-fa="user.g2fa" :trader_status="trader_status" :check_tax_id="check_tax_id" />
      </div>
    </v-card-title>

    <CommonLoading v-if="!rub_props" page-margin />

    <div v-else-if="rub_props && !rub_props.length" class="user-props-tab__empty">
      <span>{{ $t('user.props.props_empty') }}</span>
    </div>

    <v-card-text v-else>
      <UserRubPropsItem
          class="user-props__item"
          v-for="item in rub_props"
          :key="item.id"
          :prop-item="item"
          :two-fa="user.g2fa"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import Add from '@/components/user/props/dialog/AddRubProps.vue';
import CommonLoading from '@/components/common/CommonLoading.vue';
import UserRubPropsItem from '@/components/user/props/UserRubPropsItem.vue';

export default {
  name: 'UserRubPropsTab',
  props: {
    user: {
      type: Object,
      required: true,
    },
    trader_status: {
      type: Number,
      required: true,
    },
    check_tax_id: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  components: {
    Add,
    CommonLoading,
    UserRubPropsItem
  },
  computed: {
    rub_props() {
      return this.$store.state.user.rub_props === null ? [] : this.$store.state.user.rub_props;
    },
  },
  created() {
    this.$store.dispatch('user/getRubPropsFromServer');
  },
};
</script>

<style lang="sass" scoped>
.user-props-tab
  display: flex
  flex-flow: column

  &__title-wrapper
    justify-content: space-between

  &__empty
    display: flex
    justify-content: center
    align-items: center
    opacity: 0.8
    margin: auto
    span
      margin-bottom: 64px

  &__item:not(:last-child)
    margin-bottom: 5px
  ::v-deep.v-card
    box-shadow: none
  > ::v-deep.v-card:not(:last-child)
    margin-bottom: 5px

  @media screen and (max-width: 450px)
    &__title-wrapper
      display: block
    &__actions
      margin-top: 8px
</style>