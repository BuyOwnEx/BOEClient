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
				:href="item.link"
				:disabled="item.disabled"
				link
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
					link: '/profile',
				},
				{
					icon: 'mdi-email-outline',
					text: this.$t('user.title.verification'),
					link: '/apps/email',
				},
				{
					icon: 'mdi-format-list-checkbox',
					text: this.$t('user.title.api'),
					link: '/apps/todo',
				},
				{
					icon: 'mdi-shield-key-outline',
					text: this.$t('user.title.security'),
					link: '/apps/chat',
				},
				{
					icon: 'mdi-cog-outline',
					text: this.$t('user.title.settings'),
					link: '/apps/board',
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
	},
};
</script>
