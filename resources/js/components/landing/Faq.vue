<template>
	<v-sheet>
		<v-container class='text-start py-4'>
      <v-row>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
        <v-col cols="12" sm="12" md="10" lg="8" xl="8">
          <h2 class='text-h3 text-lg-h2 text-left'>{{ $t('landing.faq.main_title') }}</h2>
        </v-col>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
        <v-col cols="12" sm="12" md="10" lg="8" xl="8">
          <v-expansion-panels class="mb-4" multiple flat tile>
            <v-expansion-panel
                v-for="item in faqs"
                :id="item.id"
                :key="item.id"
            >
              <div class="landing-line primary"></div>
              <v-expansion-panel-header class="faq-panel-header font-weight-black py-4">{{ item.question }}</v-expansion-panel-header>
              <v-expansion-panel-content v-html='item.answer'>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
      </v-row>
		</v-container>
	</v-sheet>
</template>

<script>
import config from '@/configs';

export default {
  props: ['app_name'],
  computed: {
    faqs() {
      const ctx = { appName: this.app_name };
      let content = [];
      let paragraph = 1;
      let p_name = 'p';
      if(config.product.use_custom_faq_translate) p_name = 'cp'
      while (this.$te('landing.faq.questions.'+p_name+paragraph))
      {
        content.push({
          id: p_name+paragraph,
          question: this.$t('landing.faq.questions.'+p_name+paragraph, ctx),
          answer: this.$t('landing.faq.answers.'+p_name+paragraph, ctx),
        });
        paragraph++;
      }
      return content;
    }
  }
};
</script>
<style scoped>
.landing-line {
  height: 2px;
}
.faq-panel-header {
  font-size: 24px;
}
@media (min-width: 960px) {
  .container {
    max-width: none;
  }
}
</style>
