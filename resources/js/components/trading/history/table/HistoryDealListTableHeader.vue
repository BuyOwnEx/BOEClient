<template>
  <thead class="hdl__content__table__head">
    <tr>
      <th>
        <div class="hdl__content__table__head__item--rate">
          <span>{{ $t("trading.rate") }}</span>
          <span>({{ market }})</span>
        </div>
      </th>

      <th>
        <div class="hdl__content__table__head__item--amount">
          <span>{{ $t("trading.amount") }}</span>
          <span>({{ currency }})</span>
        </div>
      </th>

      <th>
        <div class="hdl__content__table__head__item--date">
          {{ $t("trading.date") }}
        </div>
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  name: "HistoryDealListTableHeader",

  props: {
    currency: {
      type: String,
      required: true
    },
    market: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped lang="sass">
.hdl
  &__content
    &__table
      &__head
        &__item
          &--rate
            text-align: left
          &--amount
            text-align: left
          &--date
            text-align: right
</style>
