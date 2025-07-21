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
                v-for="(item,i) in faqs"
                :key="i"
            >
              <div class="landing-line primary"></div>
              <v-expansion-panel-header class="faq-panel-header font-weight-black py-4">{{ item.question }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <div v-if="item.answer === 'doc_ind'">
                  <span>{{ $t('landing.faq.doc_ind.main_text') }}</span>
                  <br><br>
                  <strong>{{ $t('landing.faq.doc_ind.questions.1.text') }}</strong>
                  <br>
                  <ul>
                    <li><span>{{ $t('landing.faq.doc_ind.questions.1.answers.1') }}</span></li>
                    <li><span>{{ $t('landing.faq.doc_ind.questions.1.answers.2',[app_name]) }}</span></li>
                    <li><span>{{ $t('landing.faq.doc_ind.questions.1.answers.3') }}</span></li>
                  </ul>
                  <strong>{{ $t('landing.faq.doc_ind.questions.2.text') }}</strong>
                  <br>
                  <ul>
                    <li><span>{{ $t('landing.faq.doc_ind.questions.2.answers.1') }}</span></li>
                    <li><span>{{ $t('landing.faq.doc_ind.questions.2.answers.2') }}</span></li>
                  </ul>
                  <strong>{{ $t('landing.faq.doc_ind.questions.3.text',[app_name]) }}</strong>
                  <br>
                  <span>{{ $t('landing.faq.doc_ind.questions.3.answers.text') }}</span>
                  <br>
                  <ul>
                    <li><span>{{ $t('landing.faq.doc_ind.questions.3.answers.1') }}</span></li>
                    <li><span>{{ $t('landing.faq.doc_ind.questions.3.answers.2') }}</span></li>
                  </ul>
                </div>
                <div v-else-if="item.answer === 'fin_sec'">
                  <span>{{ $t('landing.faq.fin_sec.main_text') }}</span>
                  <br><br>
                  <strong>{{ $t('landing.faq.fin_sec.questions.1.text') }}</strong>
                  <br>
                  <ul>
                    <li><span>{{ $t('landing.faq.fin_sec.questions.1.answers.1') }}</span></li>
                    <li><span>{{ $t('landing.faq.fin_sec.questions.1.answers.2') }}</span></li>
                    <li><span>{{ $t('landing.faq.fin_sec.questions.1.answers.3') }}</span></li>
                    <li><span>{{ $t('landing.faq.fin_sec.questions.1.answers.4') }}</span></li>
                    <li><span>{{ $t('landing.faq.fin_sec.questions.1.answers.5') }}</span></li>
                    <li><span>{{ $t('landing.faq.fin_sec.questions.1.answers.6') }}</span></li>
                    <li><span>{{ $t('landing.faq.fin_sec.questions.1.answers.7') }}</span></li>
                    <li><span>{{ $t('landing.faq.fin_sec.questions.1.answers.8') }}</span></li>
                    <li><span>{{ $t('landing.faq.fin_sec.questions.1.answers.9') }}</span></li>
                    <li><span>{{ $t('landing.faq.fin_sec.questions.1.answers.10',[app_name]) }}</span></li>
                  </ul>
                </div>
                <span v-else>{{ item.answer }}</span>
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
export default {
  props: ['app_name'],
	data() {
		return {
      faqs: [{
        question: this.$t('landing.faq.questions.1',[this.app_name]),
        answer: this.$t('landing.faq.answers.1'),
      }, {
        question: this.$t('landing.faq.questions.2'),
        answer: this.$t('landing.faq.answers.2'),
      }, {
        question: this.$t('landing.faq.questions.3'),
        answer: this.$t('landing.faq.answers.3'),
      }, {
        question: this.$t('landing.faq.questions.4'),
        answer: this.$t('landing.faq.answers.4'),
      }, {
        question: this.$t('landing.faq.questions.5'),
        answer: this.$t('landing.faq.answers.5',[this.app_name]),
      }, {
        question: this.$t('landing.faq.questions.6'),
        answer: 'doc_ind',
      }, {
        question: this.$t('landing.faq.questions.7'),
        answer: this.$t('landing.faq.answers.7'),
      }, {
        question: this.$t('landing.faq.questions.8'),
        answer: 'fin_sec',
      }],
    };
	},
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
