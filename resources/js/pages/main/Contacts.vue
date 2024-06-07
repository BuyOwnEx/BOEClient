<template>
	<v-card class="docs-page contacts-page">
		<CommonPageTitle>{{ $t('menu.contacts') }}</CommonPageTitle>
    <v-card-text>
      <v-row>
        <DocsNavigation :data-array="contacts" />
        <DocsContent :data-array="contacts" :nested_expanded="expanded_items" nested />
      </v-row>
    </v-card-text>
	</v-card>
</template>

<script>
import CommonPageTitle from '@/components/common/CommonPageTitle.vue';
import DocsNavigation from '@/components/docs/DocsNavigation.vue';
import DocsContent from '@/components/docs/content/DocsContent.vue';

import config from '@/configs';

export default {
	name: 'Contacts',

  components: { CommonPageTitle, DocsNavigation, DocsContent},

  computed: {
    contacts() {
      const ctx = { url: this.url, productName: this.productName };
      let content = [{
        id: 'general',
        title: this.$t('docs.contacts.general.title', ctx),
        content: this.$t('docs.contacts.general.content', ctx),
      }];
      let paragraph = 1;
      while (this.$te('docs.contacts.p'+paragraph+'.title'))
      {
        content.push({
          id: 'p'+paragraph,
          title: this.$t('docs.contacts.p'+paragraph+'.title', ctx),
          content: this.$t('docs.contacts.p'+paragraph+'.content', ctx),
        });
        paragraph++;
      }
      return content;
    },
    expanded_items() {
      let exp_array = [[0]];
      let paragraph = 1;
      if(config.product.contacts_all_expanded)
      {
        while (this.$te('docs.contacts.p'+paragraph+'.title'))
        {
          exp_array.push([0]);
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
.contacts-page
  display: flex
  flex-flow: column
  flex-grow: 1
</style>
