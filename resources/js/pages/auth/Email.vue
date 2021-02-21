<template>
    <div class="layout-content ma-auto">
        <v-card>
            <v-card-title class="justify-center">
                <span class="overline mb-2" style="font-size: 1.25rem !important">{{ formTitle }}</span>
            </v-card-title>
            <v-card-subtitle>
                <span>{{ formSubTitle }}</span>
            </v-card-subtitle>
            <v-card-text>
                <v-container class="pt-0 pb-0">
                    <v-row>
                        <v-col cols="12" md="12" class="pt-0 pb-0">
                            <v-text-field
                                    v-model="user.email"
                                    append-icon="mdi-email-outline"
                                    :rules="[rules.required, rules.email]"
                                    :error-messages="errors.email"
                                    @input="errors.email = []"
                                    hide-details
                                    required
                            >
                                <template #label>
                                    Email <span class="red--text"><strong>*</strong></span>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions class="pt-4 pl-6 pr-6 pb-4">
                <v-btn block color="primary" tile @click="resend" :loading="loading" :disabled="!valid || loading">{{applyButton}}</v-btn>
            </v-card-actions>
        </v-card>
        <v-alert v-if="send_alert"
                 dense
                 text
                 type="warning"
                 class="mt-4"
        >
            {{$vuetify.lang.translator('auth.resend_password_recovery_link_text')}}
        </v-alert>
    </div>
</template>

<script>
    export default {
        name: "Email",
        //components: {Snackbar},
        data() {
            return {
                valid: true,
                loading: false,
                formTitle: 'Password recovery',
                formSubTitle: 'Please, enter your email address which was used during last registration and after submitting form check password recovery link in your email',
                applyButton: 'Send',
                rules: {
                    required: v => !!v || 'The field is required',
                    email: v => (v && /.+@.+\..+/.test(v)) || 'E-mail must be valid'
                },
                user: {
                    email: '',
                },
                errors: {
                    email: [],
                },
                send_alert: false
            }
        },
        methods: {
            resend() {
                let self = this;
                this.loading = true;
                axios.post('/password/email', this.user)
                    .then(response => {
                        if(response.data.resend)
                            this.send_alert = true;
                        //else this.$store.commit('snackbars/showSnackbar',{ text: response.data.message, success: false});
                    })
                    .catch(error => {
                        this.resend_alert = false;
                        if(error.response.status === 422)
                        {
                            let errors = error.response.data.errors;
                            if (errors) {
                                for (let field in errors) {
                                    if (errors.hasOwnProperty(field)) {
                                        self.errors[field] = errors[field];
                                    }
                                }
                            }
                        }
                        else
                        {
                            //this.$store.commit('snackbars/showSnackbar',{ text: error.response.data.message || error.response.statusText, success: false});
                        }
                    })
                    .finally(function () {
                        self.loading = false;
                    });
            },
        },
    }
</script>

<style scoped>

</style>