<template>
	<div class="d-flex flex-grow-1">
		<NotificationsList :notifications-prop="notifications" />
	</div>
</template>

<script>
import NotificationsList from '../NotificationsList';

export default {
	name: 'NotificationsTypeNews',

	components: { NotificationsList },

	data() {
		return {
			notifications: [
				{
					id: 37574,
					title: 'title',
					author: 'author',
					text: 'text text text text text',
					created_at: '2021-03-31T02:49:29.847Z',
					isChecked: false,
					labels: [1],
				},
				{
					id: 31231,
					title: 'title',
					author: 'author',
					text: 'text text text text text',
					created_at: '2021-03-31T02:49:29.847Z',
					isChecked: false,
					labels: [2],
				},
				{
					id: 3636,
					title: 'title',
					author: 'author',
					text: 'text text text text text',
					created_at: '2021-03-31T02:49:29.847Z',
					isChecked: false,
					labels: [1, 2],
				},
				{
					id: 353,
					title: 'title',
					author: 'author',
					text: 'text text text text text',
					created_at: '2021-03-31T02:49:29.847Z',
					isChecked: false,
					labels: [1, 2],
				},
			],
		};
	},
};
</script>

<style scoped></style>
