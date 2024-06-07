<template>
	<v-card class="docs-page terms-page">
		<CommonPageTitle> {{ $t('docs.terms.title') }} </CommonPageTitle>

		<v-card-text>
			<v-row>
				<DocsNavigation :data-array="terms" />
				<DocsContent :data-array="terms" :expanded="expanded_items" />
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
	name: 'Terms',

	components: { CommonPageTitle, DocsNavigation, DocsContent, DocsFooter },

	computed: {
		terms() {
      const ctx = { url: this.url, productName: this.productName };
      let content = [{
        id: 'general',
        title: this.$t('docs.terms.general.title', ctx),
        content: this.$t('docs.terms.general.content', ctx),
      }];
      let paragraph = 1;
      while (this.$te('docs.terms.p'+paragraph+'.title'))
      {
        content.push({
          id: 'p'+paragraph,
          title: this.$t('docs.terms.p'+paragraph+'.title', ctx),
          content: this.$t('docs.terms.p'+paragraph+'.content', ctx),
        });
        paragraph++;
      }
      return content;
		},

    expanded_items() {
      let exp_array = [0];
      let paragraph = 1;
      if(config.product.terms_all_expanded)
      {
        while (this.$te('docs.terms.p'+paragraph+'.title'))
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
.terms-page
	display: flex
	flex-flow: column
	flex-grow: 1
</style>
