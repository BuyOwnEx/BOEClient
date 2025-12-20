<template>
  <div class="tickets-menu d-flex flex-grow-1 flex-row">
    <v-navigation-drawer
        v-model="drawer"
        class="tickets-menu__sidebar elevation-0 rounded flex-shrink-0"
        :app="$vuetify.breakpoint.mdAndDown"
        :permanent="$vuetify.breakpoint.lgAndUp"
        :width="$vuetify.breakpoint.xs ? 350 : 400"
        floating
        right
    >
      <TicketSidebarMenu :attachments="attachments" />
    </v-navigation-drawer>

    <v-card elevation="0" class="tickets d-flex flex-grow-1 flex-column" v-if="ticket">
      <div class="d-flex justify-space-between">
        <CommonPageTitle class="pr-1">
          <div class="d-flex">
            <CommonTooltip :value="$t('support.priority.'+ticket.priority)" class="align-self-center">
              <v-icon :color="priority_color(ticket.priority)" class="mr-2">
                mdi-label
              </v-icon>
            </CommonTooltip>
            <v-chip small label :color="status_color(ticket.status)" class="align-self-center mr-2">
              <v-icon x-small left>
                {{ status_icon(ticket.status) }}
              </v-icon>
              <span class="pa-1">{{ $t('support.status.'+ticket.status) }}</span>
            </v-chip>
            <div class="d-flex align-items-baseline" v-if="$vuetify.breakpoint.mdAndUp">
              <span>{{ $t('support.ticket') }}</span>
              <span class="ticket-uuid ml-1 text-no-wrap text-truncate" style="font-size: 12px">#{{ ticket.uuid }}</span>
            </div>
          </div>
        </CommonPageTitle>
        <div class="d-inline-flex align-items-center align-self-center">
          <v-card-title class="pa-0" v-if="ticket.status !== 'closed'">
            <v-btn
                class="pa-1 mr-2 text-uppercase"
                small
                elevation="0"
                :loading="loading"
                color="error"
                @click="close(ticket_id)"
            >
              {{ $t('common.close') }}
            </v-btn>
          </v-card-title>
          <v-card-title class="pa-0">
            <CommonTooltip :value="$t('support.back_tickets')">
              <v-btn
                  small
                  icon
                  class="pa-0 mr-1"
                  :to="'/support'"
              >
                <v-icon>mdi-keyboard-backspace</v-icon>
              </v-btn>
            </CommonTooltip>
          </v-card-title>
          <v-card-title class="pa-0">
            <v-btn small class="pa-0 mr-1" :loading="loading" icon @click="fetch">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-toolbar dense class="tickets-menu__toolbar flex-grow-0 hidden-lg-and-up">
            <v-app-bar-nav-icon @click="drawer = !drawer" />
          </v-toolbar>
        </div>
      </div>
      <div v-if="$vuetify.breakpoint.smAndDown" class="pa-1 pl-2 pt-0">
        <span>{{ $t('support.ticket') }}</span>
        <span class="ticket-uuid ml-1 text-no-wrap text-truncate" style="font-size: 12px">#{{ ticket.uuid }}</span>
      </div>
      <v-divider />
      <v-card>
        <v-card-title>{{ticket.title}}</v-card-title>
        <v-card-text>{{ticket.message}}</v-card-text>
      </v-card>
      <v-divider />
      <v-card ref="scrollContainer" class="ticker-comments flex-grow-1" elevation="0">
        <div v-for="comment in comments" :key="comment.id" class="comment pa-2">
          <div class="d-flex mb-1" :class="comment.is_author ? 'justify-end text-end' : 'align-items-start'">
            <div>
              <small v-if="comment.is_author" class="text-medium-emphasis text-subtitle-2">{{ formatDate(comment.created_at, 'timeAgo') }}</small>
              <small v-else class="text-medium-emphasis text-subtitle-2">{{ $t('support.support_team') }}, {{ formatDate(comment.created_at, 'timeAgo') }}</small>
              <v-sheet class="bg-grey100 rounded-b-sm rounded-t-sm px-3 py-2 mb-1 mt-1">
                <p class="text-body-1 ma-0">{{ comment.message }}</p>
              </v-sheet>
              <div class="d-block ml-1 mt-1" v-if="comment_attachments(comment.id).length > 0">
                <div class="overline pa-1">{{ $t('support.attachments') }}</div>
                <v-card-text
                    v-for="(file, index) in comment_attachments(comment.id)"
                    :key="index"
                    class="pa-0 pr-1 mt-1"
                >
                  <span class="text-decoration-underline" style="cursor: pointer">{{ file.file_name }}</span> ({{ file.size_mb }}Mb)
                  <v-icon style="cursor: pointer" color="secondary" small @click="download_ticket_attachment(file.id, file.file_name)">mdi-download</v-icon>
                </v-card-text>
              </div>
            </div>
          </div>
        </div>
      </v-card>
      <v-divider v-if="ticket.status !== 'closed' && !ticket.is_locked" />
      <v-card v-if="ticket.status !== 'closed' && !ticket.is_locked">
        <v-form v-model="valid" ref="form" class="d-flex justify-space-between pa-4" @submit.prevent="addComment">
          <div class="d-flex flex-column flex-grow-1">
            <div class="d-flex justify-space-between">
              <div class="d-flex flex-grow-1">
                <v-file-input
                    ref="fileInput"
                    v-model="form.files"
                    :label="$t('support.attach_files')"
                    :hint="$t('support.files_hint')"
                    accept="image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
                    prepend-icon="mdi-paperclip"
                    :error-messages="errors.files"
                    @input="errors.files = []"
                    @change="errors.files = []"
                    :rules="[rules.max5files, rules.maxMultiFilesSize15MB, rules.uploadDocTypes]"
                    multiple
                    :counter="5"
                    :show-size="1000"
                    hide-details
                    hide-input
                    clearable
                    class="pt-0 mt-0 align-self-center d-flex flex-grow-0"
                >
                  <template v-slot:selection>
                    <span></span>
                  </template>
                  <template v-slot:prepend>
                    <v-btn
                        icon
                        color="primary"
                        @click="triggerFileSelect"
                        title="Прикрепить файл"
                    >
                      <v-icon>mdi-paperclip</v-icon>
                    </v-btn>
                  </template>
                </v-file-input>
                <input class="d-none" autocomplete="off" name="hidden" type="text" />
                <v-text-field
                    v-model="form.message"
                    class="pr-1 flex-grow-1 align-self-center"
                    :placeholder="$t('support.comment')"
                    :rules="[rules.required, rules.max4096char, rules.messageText]"
                    :error-messages="errors.message"
                    @input="errors.message = []"
                    @change="errors.message = []"
                    maxlength="4096"
                    counter="4096"
                    autocomplete="off"
                    hide-details
                    flat
                    solo
                />
              </div>
              <div class="d-flex align-self-center">
                <v-btn
                    :loading="loading"
                    color="primary"
                    type="submit"
                    :disabled="!valid || timer !== null"
                    icon
                    class="align-self-center"
                >
                  <v-icon>
                    mdi-send
                  </v-icon>
                </v-btn>
                <v-card v-if="timer && timeLeft > 0" flat class="align-self-center">
                  <v-card-text class="text-h6 font-weight-bold text-center red--text">
                    {{ formattedTime }}
                  </v-card-text>
                </v-card>
              </div>
            </div>
            <div class="d-inline mt-1">
              <v-chip
                  class="ml-1 mt-1"
                  v-for="(file, index) in form.files"
                  :key="index"
                  label
                  small
                  close
                  outlined
                  text-color="secondary"
                  @click:close="removeFile(index)"
              >
                {{ file.name }}
              </v-chip>
            </div>
          </div>
        </v-form>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import formatDate from '@/mixins/format/formatDate';
import formValidationRules from '@/mixins/common/formValidationRules';
import loadingMixin from '@/mixins/common/loadingMixin';
import download from "@/mixins/download/download.js";
import TicketSidebarMenu from '@/components/support/sidebar/TicketSidebarMenu.vue';
import CommonPageTitle from "@/components/common/CommonPageTitle.vue";
import CommonTooltip from "@/components/common/CommonTooltip.vue";
import Close from "@/components/support/dialog/Close.vue";

export default {
  name: 'Ticket',
  components: {
    CommonTooltip,
    CommonPageTitle,
    TicketSidebarMenu,
    Close
  },
  mixins: [formatDate, formValidationRules, loadingMixin, download],
  data() {
    return {
      drawer: false,
      ticket_id: null,
      ticket: null,
      attachments: [],
      comments: [],
      valid: false,
      form: {
        ticket_id: this.$route.params.ticket_id,
        message: '',
        files: null,
      },
      errors: {
        message: [],
        files: []
      },
      timeLeft: 60,
      timer: null
    };
  },
  computed: {
    ...mapState('support', [
      'tickets',
      'total',
    ]),
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  },
  methods: {
    ...mapActions({
      fetchTicketStore: 'support/fetchTicket',
      fetchCommentsStore: 'support/fetchCommentsByTicket',
      fetchAttachmentsStore: 'support/fetchAttachmentsByTicket',
      addTicketCommentStore: 'support/addTicketComment',
      closeTicketStore: 'support/closeTicket',
    }),
    async fetch() {
      const { ticket } = await this.fetchTicketStore(this.ticket_id);
      this.ticket = ticket;
      const { attachments } = await this.fetchAttachmentsStore(this.ticket_id);
      this.attachments = attachments;
      const { comments } = await this.fetchCommentsStore(this.ticket_id);
      this.comments = comments;

      this.$nextTick(() => {
        if(this.comments.length > 0)
        {
          const lastItem = this.$refs.scrollContainer.$el.querySelector('div.comment:last-child');
          lastItem.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
    comment_attachments(comment_id) {
      return _.filter(this.attachments, item => { return item.type === 'comment' && item.ticket_id.toString() === this.ticket_id && item.ticket_message_id === comment_id });
    },
    async close(ticket_id) {
      await this.closeTicketStore(ticket_id);
      await this.fetch();
    },
    triggerFileSelect() {
      this.$refs.fileInput.$refs.input.click();
    },
    removeFile(index) {
      // Удаляем файл по индексу
      this.form.files.splice(index, 1);
    },
    priority_color(priority) {
      if(priority === 'low') return 'green';
      else if(priority === 'medium') return 'orange';
      else if(priority === 'high') return 'error';
      else return 'primary';
    },
    status_color(status) {
      if(status === 'new') return 'primary';
      else if(status === 'pending') return 'accent';
      else if(status === 'hold') return 'orange';
      else if(status === 'solved') return 'green';
      else if(status === 'closed') return 'red';
      else return 'primary';
    },
    status_icon(status) {
      if(status === 'new') return 'mdi-moon-new';
      else if(status === 'pending') return 'mdi-circle-slice-2';
      else if(status === 'hold') return 'mdi-timer-pause-outline';
      else if(status === 'solved') return 'mdi-check';
      else if(status === 'closed') return 'mdi-close';
      else return 'mdi-label';
    },
    async addComment() {
      if (!this.form.message.trim()) {
        this.pushErrorNotification(_, 'incorrect');
        return;
      }
      try {
        this.startLoading();
        const res = await this.addTicketCommentStore(this.form);
        if (res.data.success) this.startTimer();
        await this.fetch();
      } finally {
        this.stopLoading();
        this.clearForm();
      }
    },
    clearForm() {
      this.form.message = null;
      this.form.files = [];
      this.$refs.form.resetValidation();
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.stopTimer();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.timeLeft = 60;
    }
  },
  beforeDestroy() {
    this.stopTimer();
  },
  created() {
    this.ticket_id = this.$route.params.ticket_id;
    this.fetch();
  },
};
</script>

<style lang="sass" scoped>
.tickets-menu
  height: calc(100vh - 114px)

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    height: calc(100vh - 124px)

  @media #{map-get($display-breakpoints, 'lg-and-up')}
    height: calc(100vh - 104px)

  &__sidebar
    margin-right: 5px
    @media screen and (max-width: 1263px)
      border-radius: 0 !important
  &__toolbar
    margin-bottom: 5px

.v-application--is-rtl
  .tickets-menu
    &__sidebar
      margin-right: 0
      margin-left: 5px

.ticket-list-item
  @media #{map-get($display-breakpoints, 'lg-and-up')}
    max-width: 500px

.ticker-comments
  position: relative
  overflow-y: auto
  scroll-behavior: smooth
  max-height: 100vh
.bg-grey100
  background-color: map-get($grey, 'lighten-3') !important
.theme--dark
  .bg-grey100
    background-color: map-get($blue-grey, 'darken-3') !important
</style>
