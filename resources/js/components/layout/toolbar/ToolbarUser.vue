<template>
	<v-menu offset-y left transition="slide-y-transition">
		<template #activator="{ on }">
			<v-btn icon plain tile v-on="on">
				<v-badge color="success"  dot >
					<v-avatar tile v-html="generatedAvatar" size="35" />
				</v-badge>
			</v-btn>
		</template>

		<v-list dense nav>
			<v-list-item
				v-for="(item, index) in available_items"
				:key="item.text"
				@click="navigatePage(item, index)"
			>
				<v-list-item-icon>
					<v-icon small :class="{ 'grey--text': item.disabled }">
						{{ item.icon }}
					</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>
						{{ item.text }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>

			<v-divider class="my-1" />

			<v-list-item link @click="logout">
				<v-list-item-icon>
					<v-icon small>mdi-logout-variant</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{ $t('menu.logout') }}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
	name: 'ToolbarUser',
	computed: {
    ...mapState('app', ['product']),
    ...mapState('user', ['blockStatus']),
    isHideTrading() {
      return (this.blockStatus & 8) > 0
    },
    use_ru_props() {
      return this.product.fiatUseRUProps
    },
    use_kg_props() {
      return this.product.fiatUseKGProps
    },
    use_swift_props() {
      return this.product.fiatUseSwiftProps
    },
    show_props() {
      return this.use_kg_props || this.use_ru_props || this.use_swift_props;
    },
		generatedAvatar() {
			return this.$store.getters['user/getGeneratedAvatar'](import.meta.env.VITE_USER_ICON_TYPE || 'initials');
		},
    items() {
      return [
        {
          icon: 'mdi-account-box-outline',
          text: this.$t('user.title.profile'),
          link: '/profile#account',
          hash: '#account',
        },
        {
          icon: 'mdi-email-outline',
          text: this.$t('user.title.verification'),
          link: '/profile#verification',
          hash: '#verification',
        },
        {
          icon: 'mdi-bank',
          text: this.$t('user.title.props'),
          link: '/profile#props',
          hash: '#props',
        },
        {
          icon: 'mdi-format-list-checkbox',
          text: this.$t('user.title.api'),
          link: '/profile#api',
          hash: '#api',
        },
        {
          icon: 'mdi-shield-key-outline',
          text: this.$t('user.title.security'),
          link: '/profile#security',
          hash: '#security',
        },
        {
          icon: 'mdi-cog-outline',
          text: this.$t('user.title.settings'),
          link: '/profile#settings',
          hash: '#settings',
        },
      ];
    },
    available_items() {
      let available = this.items;
      if(!this.use_ru_props && !this.use_kg_props && !this.use_swift_props)
        available = _.filter(this.items, function(item) { return item.link !== '/profile#props'; });
      if(this.isHideTrading)
        available = _.filter(this.items, function(item) { return item.link !== '/profile#api'; });
      return available;
    },
	},
	methods: {
		...mapMutations({
			setProfileTab: 'user/SET_PROFILE_TAB',
		}),
		...mapActions({
			logout: 'user/logout'
		}),
		navigatePage(item, index) {
      this.$router.push(item.link);
      this.setProfileTab({index: Number(index), hash: item.hash});
		},
	},
};
</script>
