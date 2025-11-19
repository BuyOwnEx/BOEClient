<template>
  <v-card class="docs-page knowledge-page">
    <CommonPageTitle> {{ $t('docs.knowledge.title') }} </CommonPageTitle>

    <v-card-text>
      <v-row>
        <DocsNavigation :data-array="items" />
        <DocsContent :data-array="items" :expanded="expanded_items" />
      </v-row>

      <DocsFooter />
    </v-card-text>
  </v-card>
</template>

<script>
import CommonPageTitle from '@/components/common/CommonPageTitle.vue';

import DocsNavigation from '@/components/docs/DocsNavigation.vue';
import DocsContent from '@/components/docs/content/DocsContent.vue';
import DocsFooter from '@/components/docs/DocsFooter.vue';
import config from '@/configs';

export default {
  name: 'Knowledge',

  components: { CommonPageTitle, DocsNavigation, DocsContent, DocsFooter },

  computed: {
    items() {
      const ctx = { url: this.url, productName: this.productName };
      let content = [{
        id: 'verification',
        title: this.$t('docs.knowledge.verification.title', ctx),
        content: this.$t('docs.knowledge.verification.content', ctx),
      }];
      let paragraph = 1;
      let p_name = 'p';
      if(config.product.use_custom_knowledge_translate) p_name = 'cp'
      while (this.$te('docs.knowledge.'+p_name+paragraph+'.title'))
      {
        content.push({
          id: p_name+paragraph,
          title: this.$t('docs.knowledge.'+p_name+paragraph+'.title', ctx),
          content: this.$t('docs.knowledge.'+p_name+paragraph+'.content', ctx),
        });
        paragraph++;
      }
      return content;
    },

    expanded_items() {
      let exp_array = [0];
      let paragraph = 1;
      let p_name = 'p';
      if(config.product.use_custom_knowledge_translate) p_name = 'cp'
      if(config.product.knowledge_all_expanded)
      {
        while (this.$te('docs.knowledge.'+p_name+paragraph+'.title'))
        {
          exp_array.push(paragraph);
          paragraph++;
        }
      }
      return exp_array;
    },
    productName() {
      return config.product.name;
    },
    url() {
      return window.location.hostname;
    },
  },
};
</script>

<style scoped lang="sass">
.knowledge-page
  display: flex
  flex-flow: column
  flex-grow: 1
</style>
