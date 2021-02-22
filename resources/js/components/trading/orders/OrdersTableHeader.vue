<template>
  <thead class="orders-table-header">
  <tr>
    <th>
      <div class="orders-table-header__item--price">
        <span>{{ $t("trading.rate") }}</span>
        <span>({{ market }})</span>
      </div>
    </th>

    <th>
      <div class="orders-table-header__item--amount">
        <span>{{ $t("trading.amount") }}</span>
        <span>({{ currency }})</span>
      </div>
    </th>

    <th>
      <div class="orders-table-header__item--total">
        {{ $t("trading.total") }}
      </div>
    </th>

    <th>
      <div class="orders-table-header__item--total">
        {{ $t("trading.total") }}
      </div>
    </th>

    <th>
      <div class="orders-table-header__item--total">
        {{ $t("trading.total") }}
      </div>
    </th>
  </tr>
  </thead>
</template>
<script>
export default {
  name: "OrdersTableHeader",
  props: {
    currency: {
      type: String,
      required: true,
    },
    market: {
      type: String,
      required: true,
    }
  }
};
</script>
