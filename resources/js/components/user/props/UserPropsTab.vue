<template>
  <div>
    <v-tabs v-model="selectedTab" show-arrows align-with-title>
      <v-tab :key="1">
        <v-icon left>
          mdi-currency-rub
        </v-icon>
        {{ $t('user.props.rub_props') }}
      </v-tab>
      <v-tab :key="2">
        <v-icon left>
          mdi-web
        </v-icon>
        {{ $t('user.props.swift_props') }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="selectedTab">
      <v-tab-item :key="1">
        <UserRubPropsTab :user="user" :trader_status="trader_status"></UserRubPropsTab>
      </v-tab-item>
      <v-tab-item :key="2">
        <UserSwiftPropsTab :user="user" :trader_status="trader_status"></UserSwiftPropsTab>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import UserRubPropsTab from '@/components/user/props/UserRubPropsTab.vue';
import UserSwiftPropsTab from '@/components/user/props/UserSwiftPropsTab.vue';

export default {
  name: 'UserPropsTab',
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
    UserRubPropsTab,
    UserSwiftPropsTab,
  },
  data() {
    return {
      selectedTab: 0,
    };
  },
};
</script>