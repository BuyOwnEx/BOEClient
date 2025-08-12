<template>
	<v-menu offset-y left transition="slide-y-transition">
		<template #activator="{ on }">
			<v-btn icon v-on="on">
				<v-icon>mdi-view-grid-outline</v-icon>
			</v-btn>
		</template>

		<v-card>
      <v-list two-line dense>
        <v-list-item v-for="item in filtered_items" :key="item.title" :href="item.to" :to="item.to" dense>
          <v-list-item-avatar size="20">
            <v-icon color="primary">{{ item.icon }}</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>

            <v-list-item-subtitle class="toolbar-apps__item-subtitle">
              {{ item.subtitle }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
		</v-card>
	</v-menu>
</template>

<script>
export default {
  props: {
    isOtcEnabled: {
      type: Boolean,
      required: true,
      default: false
    },
    isShowTrading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
	computed: {
		items() {
			return [
				{
					title: this.$t('apps.trading.title'),
					subtitle: this.$t('apps.trading.subtitle'),
					icon: 'mdi-finance',
					to: '/trading',
          show: this.isShowTrading
				},
        {
          title: this.$t('apps.exchange.title'),
          subtitle: this.$t('apps.exchange.subtitle'),
          icon: 'mdi-swap-horizontal',
          to: '/exchange',
          show: this.isOtcEnabled
        },
			];
		},
    filtered_items() {
      return _.filter(this.items, (item) => { return item.show === true })
    }
	},
};
</script>

<style lang="sass" scoped>
.toolbar-apps
  &__item-subtitle
    font-size: 0.8rem !important
    color: rgba(157, 157, 157, 0.9) !important
</style>
