<template>
	<v-list class="pa-0" dense nav>
		<div class="overline pa-1">Типы уведомлений</div>

		<v-list-item
			v-for="item in notificationsTypes"
			:key="item.hash"
			active-class="primary--text"
			@click="navigate(item.hash)"
		>
			<v-list-item-icon>
				<v-icon small :color="item.color">{{ item.icon }}</v-icon>
			</v-list-item-icon>

			<v-list-item-content>
				<v-list-item-title>{{ item.name }}</v-list-item-title>
			</v-list-item-content>

			<v-list-item-action v-if="item.count > 0">
				<v-badge
					class="font-weight-bold"
					:content="item.count"
					:color="item.color"
					inline
				>
				</v-badge>
			</v-list-item-action>
		</v-list-item>
	</v-list>
</template>

<script>
export default {
	name: 'NotificationsSidebarMenu',

	data() {
		return {
			notificationsTypes: [
				{
					name: 'Системные',
					color: 'primary',
					icon: 'mdi-label-outline',
					hash: 'system',
				},
				{
					name: 'Новости',
					color: 'green',
					icon: 'mdi-label-outline',
					hash: 'news',
				},
			],
		};
	},

	methods: {
		navigate(hash) {
			window.location.hash = hash;
			this.$emit('update', hash)
		},
	},
};
</script>

<style scoped></style>
