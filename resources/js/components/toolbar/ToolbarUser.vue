<template>
	<v-menu offset-y left transition="slide-y-transition">
		<template v-slot:activator="{ on }">
			<v-btn icon class="elevation-2" v-on="on">
				<v-badge color="success" offset-x="10" offset-y="10" dot bordered>
					<v-avatar v-html="generatedAvatar" size="40" />
				</v-badge>
			</v-btn>
		</template>

		<v-list dense nav>
			<v-list-item
				v-for="item in items"
				:key="item.text"
				:disabled="item.disabled"
				link
				@click="navigatePage(item)"
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

			<v-list-item link @click="sendLogout">
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
export default {
	name: 'ToolbarUser',

	data() {
		return {
			items: [
				{
					icon: 'mdi-account-box-outline',
					text: this.$t('user.title.profile'),
					tabIndex: 0,
				},
				{
					icon: 'mdi-email-outline',
					text: this.$t('user.title.verification'),
					tabIndex: 1,
				},
				{
					icon: 'mdi-format-list-checkbox',
					text: this.$t('user.title.api'),
					tabIndex: 2,
				},
				{
					icon: 'mdi-shield-key-outline',
					text: this.$t('user.title.security'),
					tabIndex: 3,
				},
				{
					icon: 'mdi-cog-outline',
					text: this.$t('user.title.settings'),
					tabIndex: 4,
				},
			],
		};
	},

	computed: {
		generatedAvatar() {
			return this.$store.getters['user/generatedAvatar'];
		},
	},

	methods: {
		sendLogout(event) {
			axios.post('/logout').then(response => {
				window.location.reload();
			});
		},

		navigatePage(item) {
			if (item.link) this.$router.push(item.link);
			else this.pushToProfileAndSetActiveTab(item.tabIndex);
		},

		pushToProfileAndSetActiveTab(tabIndex) {
			console.log('vue router route', this.$route);
			this.$store.dispatch('user/setProfileTab', tabIndex);
			if (this.$route.path !== '/profile') {
				this.$router.push('/profile');
			}
		},
	},
};
</script>
