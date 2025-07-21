<template>
	<v-menu offset-y left transition="slide-y-transition">
		<template #activator="{ on }">
			<v-btn icon v-on="on">
				<v-icon>mdi-view-grid-outline</v-icon>
			</v-btn>
		</template>

		<v-card>
			<v-list dense>
				<v-list-item-group>
					<v-list-item v-for="item in items" :key="item.title" :href="item.to" :to="isSPA ? item.to : null">
						<v-list-item-avatar>
							<v-icon color="primary" large>{{ item.icon }}</v-icon>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title>{{ item.title }}</v-list-item-title>

							<v-list-item-subtitle class="toolbar-apps__item-subtitle">
								{{ item.subtitle }}
							</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-card>
	</v-menu>
</template>

<script>
export default {
	computed: {
		items() {
			return [
				{
					title: this.$t('apps.exchange.title'),
					subtitle: this.$t('apps.exchange.subtitle'),
					icon: 'mdi-apps',
					to: '/trading',
				},
			];
		},
    isSPA() {
        return this.$spa;
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
