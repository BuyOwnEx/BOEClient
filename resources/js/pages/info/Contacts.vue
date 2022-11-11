<template>
	<v-card class="docs-page contacts-page">
		<CommonPageTitle>{{ $t('menu.contacts') }}</CommonPageTitle>

    <v-card-text>
      <v-row>
        <DocsNavigation :data-array="contacts" />

        <DocsContent :data-array="contacts" nested />
      </v-row>

      <DocsFooter />
    </v-card-text>
	</v-card>
</template>

<script>
import CommonPageTitle from '../../components/common/CommonPageTitle';
import DocsNavigation from '../../components/docs/DocsNavigation';
import DocsContent from '../../components/docs/content/DocsContent';
import DocsFooter from '../../components/docs/DocsFooter';
import config from '../../configs';

export default {
	name: 'Contacts',

  components: { CommonPageTitle, DocsNavigation, DocsContent, DocsFooter },

  computed: {
    contacts() {
      return [
        {
          id: 'general',
          title: this.$t('docs.contacts.general.title'),
          content: this.$t('docs.contacts.general.content'),
        },
        {
          id: 'email',
          title: this.$t('docs.contacts.email.title'),
          content: this.$t('docs.contacts.email.content'),
        },
        {
          id: 'phone',
          title: this.$t('docs.contacts.phone.title'),
          content: this.$t('docs.contacts.phone.content'),
        }
      ];
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
