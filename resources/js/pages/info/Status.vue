<template>
	<v-card class="status flex-grow-1">
		<v-card-title class="text-h4">Состояние системы</v-card-title>
		<v-card-text class="pb-0">
			<p>
				Поддерживаются <span class="status__currency"></span> валют:
				<span class="status__currency--crypto"></span> криптовалют
				(монет/токенов) и <span class="status__currency--fiat"></span> фиатных
				валют
			</p>
		</v-card-text>

		<v-divider />

		<v-card-text>
			<p>
				Состояние системы - это инструмент мониторинга, который предоставляет
				информацию о доступности ввода, вывода и торгам в режиме реального
				времени, а также применяемые комиссии и лимиты. Это развивающийся
				инструмент, который будет включать больше информации о системе, стремясь
				сделать наши системные процессы максимально прозрачными.
			</p>
			<p>
				Ознакомиться c состоянием рынка можно на странице
				<a class="text-decoration-none" href="/overview">Обзор рынка</a>
			</p>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'Status',
};
</script>

<style scoped></style>
