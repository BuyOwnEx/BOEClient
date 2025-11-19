<template>
  <div>
    <v-tabs v-model="selectedTab" show-arrows align-with-title>
      <v-tab v-if="use_ru_props" :key="1">
        <v-icon left>
          mdi-currency-rub
        </v-icon>
        {{ $t('user.props.rub_props')  }}
      </v-tab>
      <v-tab v-if="use_kg_props" :key="2">
        {{ $t('user.props.kgs_props')  }}
      </v-tab>
      <v-tab v-if="use_swift_props" :key="3">
        <v-icon left>
          mdi-web
        </v-icon>
        {{ $t('user.props.swift_props') }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="selectedTab">
      <v-tab-item v-if="use_ru_props" :key="1">
        <UserRubPropsTab :user="user" :trader_status="trader_status" :check_tax_id="check_tax_id_ru_props"></UserRubPropsTab>
      </v-tab-item>
      <v-tab-item v-if="use_kg_props" :key="2">
        <UserKgsPropsTab :user="user" :trader_status="trader_status"></UserKgsPropsTab>
      </v-tab-item>
      <v-tab-item v-if="use_swift_props" :key="3">
        <UserSwiftPropsTab :user="user" :trader_status="trader_status"></UserSwiftPropsTab>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import UserRubPropsTab from '@/components/user/props/UserRubPropsTab.vue';
import UserKgsPropsTab from '@/components/user/props/UserKgsPropsTab.vue';
import UserSwiftPropsTab from '@/components/user/props/UserSwiftPropsTab.vue';
import { mapState } from 'vuex';

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
    UserKgsPropsTab,
    UserSwiftPropsTab,
  },
  data() {
    return {
      selectedTab: 0,
    };
  },
  computed: {
    ...mapState('app', ['product']),
    use_ru_props() {
      return this.product.fiatUseRUProps
    },
    check_tax_id_ru_props() {
      return this.product.checkTaxIDRUProps
    },
    use_kg_props() {
      return this.product.fiatUseKGProps
    },
    use_swift_props() {
      return this.product.fiatUseSwiftProps
    },
  },
};
</script>