<template>
	<div class="fees-trading-tab">
		<v-simple-table dense>
			<template v-slot:default>
				<thead>
					<tr>
						<th>
							Пара
						</th>
						<th>
							Покупатель
						</th>
						<th>
							Продавец
						</th>
						<th>
							Минимальный объем ордера
						</th>
					</tr>
				</thead>
				<tbody>
					<!--					<tr v-for="item in desserts" :key="item.name">-->
					<!--						<td>{{ item.name }}</td>-->
					<!--						<td>{{ item.calories }}</td>-->
					<!--					</tr>-->
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
export default {
	name: 'FeesTradingTab',
};
</script>

<style scoped></style>