<template>
	<div class="pa-2">
		<v-btn
			block
			large
			color="primary"
			class="mb-3"
			@click="$emit('open-compose')"
		>
			Добавить тикет
		</v-btn>

		<v-list class="mt-2 pa-0" nav>
			<v-list-item active-class="primary--text">
				<v-list-item-icon>
					<v-icon small>mdi-checkbox-marked-circle-outline</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title>Тикеты</v-list-item-title>
				</v-list-item-content>

				<v-list-item-action v-if="processingQuantity > 0">
					<v-badge
						inline
						color="primary"
						class="font-weight-bold"
						:content="processingQuantity"
					>
					</v-badge>
				</v-list-item-action>
			</v-list-item>

			<v-list-item active-class="primary--text">
				<v-list-item-icon>
					<v-icon small>mdi-check</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title>{{ $t('todo.completed') }}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>

		<!--		<v-list dense nav class="mt-2 pa-0">-->
		<!--			<div class="overline pa-1 mt-2">{{ $t('todo.labels') }}</div>-->

		<!--			<v-list-item-->
		<!--				v-for="label in labels"-->
		<!--				:key="label.id"-->
		<!--				active-class="primary&#45;&#45;text"-->
		<!--			>-->
		<!--				<v-list-item-icon>-->
		<!--					<v-icon small :color="label.color">mdi-label-outline</v-icon>-->
		<!--				</v-list-item-icon>-->

		<!--				<v-list-item-content>-->
		<!--					<v-list-item-title>{{ label.title }}</v-list-item-title>-->
		<!--				</v-list-item-content>-->
		<!--			</v-list-item>-->
		<!--		</v-list>-->
	</div>
</template>

<script>
export default {
	name: 'SupportSidebarMenu',

	props: {
		processingQuantity: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			supportTypes: [
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
			this.$emit('update', hash);
		},
	},
};
</script>

<style scoped></style>
