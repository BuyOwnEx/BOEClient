<template>
  <v-simple-table dense>
    <thead class="ask-table-header">
    <tr>
      <th>
        <div class="ask-table-header__item--price">
          <span>{{ $t('table_header.rate') }}</span>
        </div>
      </th>
      <th>
        <div class="ask-table-header__item--amount">
          <span>{{ $t('table_header.amount') }}</span>
        </div>
      </th>
      <th>
        <div class="ask-table-header__item--total text-end">
          {{ $t('table_header.volume') }}
        </div>
      </th>
    </tr>
    </thead>
  </v-simple-table>
</template>

<script>
export default {
	name: 'AskListTableHeader',
	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
	},
};
</script>
<style scoped lang="sass">
@media screen and (max-width: 960px)
  .ask-table-header th
    width: 33.3% !important
</style>
