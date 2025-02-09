<template>
  <v-card class="user-props-tab tab-fill-height">
    <v-card-title class="user-props-tab__title-wrapper">
      <div class="user-props-tab__title">{{ $t('user.props.swift_props_title') }}</div>
      <div class="user-props-tab__actions">
        <add :two-fa="user.g2fa" :trader_status="trader_status" />
      </div>
    </v-card-title>

    <CommonLoading v-if="!swift_props" page-margin />

    <div v-else-if="swift_props && !swift_props.length" class="user-props-tab__empty">
      <span>{{ $t('user.props.props_empty') }}</span>
    </div>

    <v-card-text v-else>
      <UserSwiftPropsItem
          class="user-props__item"
          v-for="item in swift_props"
          :key="item.id"
          :prop-item="item"
          :two-fa="user.g2fa"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import Add from '@/components/user/props/dialog/AddSwiftProps.vue';
import CommonLoading from '@/components/common/CommonLoading.vue';
import UserSwiftPropsItem from '@/components/user/props/UserSwiftPropsItem.vue';
export default {
  name: 'UserSwiftPropsTab',
  props: {
    user: {
      type: Object,
      required: true,
    },
    trader_status: {
      type: Number,
      required: true,
    },
  },
  components: {
    Add,
    CommonLoading,
    UserSwiftPropsItem
  },
  computed: {
    swift_props() {
      return this.$store.state.user.swift_props === null ? [] : this.$store.state.user.swift_props;
    },
  },
  created() {
    this.$store.dispatch('user/getSwiftPropsFromServer');
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