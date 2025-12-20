<template>
  <div class="ticket-sidebar-menu pa-1 pt-0">
    <v-sheet class="pa-0">
      <div class="overline pa-1">{{ $t('support.attachments') }} {{ attachments.length > 0 ? '('+ attachments.length +')' : '' }}</div>

      <div
          v-for="attach in attachments"
          :key="attach.id"
          class="d-flex align-self-center mt-2"
      >
        <v-avatar size="32" class="my-0">
          <v-icon :color="getAttachIconColor(attach.mime_type)" >{{ getAttachIcon(attach.mime_type) }}</v-icon>
        </v-avatar>

        <div class="pl-1" style="width: calc(100% - 32px)">
          <h6 class="text-subtitle-1 font-weight-medium text-truncate">{{ attach.file_name }}</h6>
          <div class="d-inline-flex align-center">
            <v-icon style="cursor: pointer" color="secondary" small class="d-inline mr-1" @click="download_ticket_attachment(attach.id, attach.file_name)">mdi-download</v-icon>
            <h5 class="text-subtitle-2">{{ attach.size_mb }}Mb</h5>
          </div>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import download from "@/mixins/download/download.js";

export default {
  name: 'TicketSidebarMenu',
  props: {
    attachments: {
      type: Array,
      required: true,
      default: () => []
    },
  },
  mixins: [download],
  data() {
    return {

    };
  },
  computed: {

  },
  methods: {
    getAttachIcon(mime_type) {
      if(mime_type === 'pdf') return 'mdi-file-pdf-box';
      else if(mime_type === 'jpg') return 'mdi-file-jpg-box';
      else if(mime_type === 'png') return 'mdi-file-png-box';
      else if(mime_type === 'doc' || mime_type === 'docx') return 'mdi-file-word-box';
      else if(mime_type === 'zip') return 'mdi-zip-box';
      else return 'mdi-link-box-variant';
    },
    getAttachIconColor(mime_type) {
      if (mime_type === 'pdf') return 'rgb(220, 40, 60)';
      else if (mime_type === 'jpg') return 'rgb(0, 128, 64)';
      else if (mime_type === 'png') return 'rgb(0, 102, 204)';
      else if (mime_type === 'doc' || mime_type === 'docx') return 'rgb(43, 85, 154)';
      else if (mime_type === 'zip') return 'rgb(128, 128, 128)';
      else return 'rgb(102, 102, 102)';
    }
  },
};
</script>
