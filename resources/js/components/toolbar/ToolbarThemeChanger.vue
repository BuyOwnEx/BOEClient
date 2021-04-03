<template>
	<v-btn
		class="toolbar-theme-changer"
		:class="[$vuetify.rtl ? 'ml-1' : 'mr-1']"
		icon
		@click="changeTheme"
	>
		<v-icon v-if="$vuetify.theme.dark">
			mdi-white-balance-sunny
		</v-icon>
		<v-icon v-else>mdi-moon-waning-crescent </v-icon>
	</v-btn>
</template>

<script>
export default {
	name: 'ToolbarThemeChanger',

	methods: {
		changeTheme() {
			this.toggleTheme();
			this.saveThemeToStorage();
		},
		getAndSetThemeFromStorage() {
			const isDark = JSON.parse(localStorage.getItem('isDarkTheme'));
			if (isDark === null) this.saveThemeToStorage();
			else this.$vuetify.theme.dark = isDark;
		},

		toggleTheme() {
			this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
		},
		saveThemeToStorage() {
			const isDark = this.$vuetify.theme.dark.toString();
			localStorage.setItem('isDarkTheme', isDark);
		},
	},

	mounted() {
		this.getAndSetThemeFromStorage();
	},
};
</script>
