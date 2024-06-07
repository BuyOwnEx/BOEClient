<template>
	<v-card class="docs-page policy-page">
		<CommonPageTitle>
			{{ $t('docs.policy.title') }}
		</CommonPageTitle>
		<v-card-text>
			<v-row>
				<DocsNavigation :data-array="policy" />
				<DocsContent :data-array="policy" :expanded="expanded_items" />
			</v-row>
			<DocsFooter />
		</v-card-text>
	</v-card>
</template>

<script>
import config from '@/configs';

import CommonPageTitle from '@/components/common/CommonPageTitle.vue';

import DocsNavigation from '@/components/docs/DocsNavigation.vue';
import DocsContent from '@/components/docs/content/DocsContent.vue';
import DocsFooter from '@/components/docs/DocsFooter.vue';

export default {
	name: 'Policy',

	components: { CommonPageTitle, DocsNavigation, DocsContent, DocsFooter },

	computed: {
		policy() {
      const ctx = { url: this.url, productName: this.productName };
      let content = [{
        id: 'general',
        title: this.$t('docs.policy.general.title', ctx),
        content: this.$t('docs.policy.general.content', ctx),
      }];
      let paragraph = 1;
      while (this.$te('docs.policy.p'+paragraph+'.title'))
      {
        content.push({
          id: 'p'+paragraph,
          title: this.$t('docs.policy.p'+paragraph+'.title', ctx),
          content: this.$t('docs.policy.p'+paragraph+'.content', ctx),
        });
        paragraph++;
      }
      return content;
		},
    expanded_items() {
      let exp_array = [0];
      let paragraph = 1;
      if(config.product.policy_all_expanded)
      {
        while (this.$te('docs.policy.p'+paragraph+'.title'))
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
.policy-page
	display: flex
	flex-flow: column
	flex-grow: 1
</style>
