<template>
	<v-card class="user-api-item">
		<v-card-title class="justify-space-between">
			<div>{{ apiItem.name }}</div>

			<div>
				<v-btn @click="openEditDialog">Редактировать ограничения</v-btn>
				<v-btn @click="openDeleteDialog">Удалить</v-btn>
			</div>
		</v-card-title>

		<v-divider />

		<v-card-text>
			<v-row>
				<v-col cols="0" sm="3" xl="2">
					<div class="user-api-item__lock-wrapper">
						<span>
							<v-avatar
									class=""
									size="150"
									v-html="generatedIcon(apiItem.name)"
							/>
						</span>
					</div>
				</v-col>

				<v-col cols="12" sm="9" xl="10">
					<div class="user-api-item__api-key-wrapper">
						<div class="user-api-item__header">API Key</div>
						<div class="user-api-item__api-key">{{ apiItem.public }}</div>
					</div>

					<div class="user-api-item__secret-key-wrapper">
						<div class="user-api-item__header">Secret Key</div>
						<div class="user-api-item__secret-key">{{ secretKeyMask }}</div>
					</div>

					<v-form class="user-api-item__limits-form">
						<div class="user-api-item__header">Ограничения API</div>
						<div>
							<v-checkbox
								class="mt-sm-0"
								hide-details
								dense
								label="Разрешить чтение"
							/>
							<v-checkbox
								class="mt-sm-0"
								hide-details
								dense
								label="Разрешить чтение"
							/>
							<v-checkbox
								class="mt-sm-0"
								hide-details
								dense
								label="Разрешить чтение"
							/>
							<v-checkbox hide-details dense label="Разрешить чтение" />
							<v-checkbox hide-details dense label="Разрешить чтение" />
							<v-checkbox hide-details dense label="Разрешить чтение" />
							<v-checkbox hide-details dense label="Разрешить чтение" />
						</div>

						<div class="user-api-item__header">Ограничения доступа по IP</div>
						<div>
							<v-radio-group class="mt-0" hide-details mandatory dense>
								<v-radio :ripple="false" label="radio" />
								<v-radio :ripple="false" label="radio" />
							</v-radio-group>
						</div>
					</v-form>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-jdenticon-sprites';

export default {
	name: 'UserApiItem',

	props: {
		apiItem: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {};
	},

	computed: {
		secretKeyMask() {
			return this.apiItem.secret.replace(/./gm, '*');
		},
	},

	methods: {
		openEditDialog() {},
		openDeleteDialog() {},
		generatedIcon(name) {
			const options = {};
			const avatars = new Avatars(sprites, options);
			return avatars.create(name);
		},
	},
};
</script>

<style lang="sass" scoped>
.user-api-item
	&__header
		font-size: 1rem
		font-weight: 500
		padding-top: 16px
		padding-bottom: 4px

	&__lock-wrapper
		border: 1px solid rgba(103,103,103,0.32)
		height: 150px
		width: 150px
		padding: 8px

	&__api-key
		font-size: 1.1rem
	&__secret-key
		font-size: 1.1rem
		font-weight: bold

	&__limits-form
		.v-input--checkbox
			display: inline-flex
			width: 33%
</style>
