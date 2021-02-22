<template>
	<tbody v-if='askData !== null' class='ask-list__content__table__body'>
	<tr v-for='item in askData'>
		<td>
			<div
				class='ask-list__content__table__body__item--price'
				:class="{
            'text-danger': item.side === true,
            'text-success': item.side === false
          }"
			>
				<strong>
					{{ formatPrice(item.price) }}
				</strong>
			</div>
		</td>

		<td>
			<div class='ask-list__content__table__body__item--amount'>
				{{ formatSize(item.size) }}
			</div>
		</td>

		<td>
			<div class='ask-list__content__table__body__item--date'>
				{{ formatVolume(item.volume) }}
			</div>
		</td>
	</tr>
	</tbody>
</template>

<script>
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	name: 'AskListTableBody',

	props: {
		askData: {
			type: Array,
			required: true,
		},
	},

	methods: {
		formatPrice(price) {
			BigNumber(price)
				.toFixed(2)
				.toString();
		},
		formatSize(size) {
			BigNumber(size)
				.toFixed(5)
				.toString();
		},
		formatVolume(volume) {
			return volume;
		},
	},
};
</script>
