<template>
  <v-sheet class="exchange-page">
    <v-container class="pt-lg-4 text-start">
      <v-row>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2" v-if="$vuetify.breakpoint.smAndUp"></v-col>
        <v-col cols="12" sm="12" md="10" lg="8" xl="8">
          <div class="text-center">
            {{ $t('exchange.exchange_form') }}
          </div>
          <ExchangeForm
              :init_currency_in="selectedCurrencyIn"
              :init_currency_out="selectedCurrencyOut"
              :exchange_dirs="exchange_dirs"
          ></ExchangeForm>
        </v-col>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2" v-if="$vuetify.breakpoint.smAndUp"></v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ExchangeForm from '@/components/exchange/ExchangeForm.vue';
import CentrifugeExchangeMixin from '@/mixins/centrifugo-exchange';

export default {
  name: 'Exchange',
  components: {
    ExchangeForm
  },
  mixins: [CentrifugeExchangeMixin],
  data() {
    return {
      exchange_dirs: [],
    };
  },
  computed: {
    ...mapState({
      selectedCurrencyOut: state => state.exchange.selectedCurrencyOut,
      selectedCurrencyIn: state => state.exchange.selectedCurrencyIn,
    }),
    ...mapGetters({
      selectedPair: 'exchange/selectedPair',
    }),
    currency_out() {
      return this.selectedCurrencyOut ? this.selectedCurrencyOut.toUpperCase() : null;
    },
    currency_in() {
      return this.selectedCurrencyIn ? this.selectedCurrencyIn.toUpperCase() : null;
    },
  },
  methods: {
    updateUrl() {
      if ('history' in window) {
        window.history.pushState(
            null,
            this.currency_out + '/' + this.currency_in,
            '/exchange/' + this.currency_out + '/' + this.currency_in
        );
      }
    },
  },
  mounted() {
    this.debouncedUpdateUrl = _.debounce(this.updateUrl, 300);
    this.$watch('selectedPair', this.debouncedUpdateUrl);
  },
  async created() {
    if (!this.$store.state.exchange.selectedCurrencyOut || !this.$store.state.exchange.selectedCurrencyIn) {
      this.$store.commit('exchange/setPair', {
        currency_out: this.$route.params.currency_out,
        currency_in: this.$route.params.currency_in,
      });
    }
    const dirs = await axios.get('/trader/ext/exchange_dirs');
    this.exchange_dirs = dirs.data;
  },
};
</script>

<style lang="scss">
.exchange-page {
  width: 100%;
}
</style>