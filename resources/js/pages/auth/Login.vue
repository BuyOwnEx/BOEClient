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
                                    hint="Enter your email"
                                    :error-messages="errors.email"
                                    @input="errors.email = []"
                                    persistent-hint
                                    clearable
                                    required
                            >
                                <template #label>
                                    Email <span class="red--text"><strong>*</strong></span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" class="pt-0 pb-0">
                            <v-text-field
                                    v-model="user.password"
                                    :append-icon="show ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                                    :rules="[rules.required, rules.min]"
                                    :type="show ? 'text' : 'password'"
                                    hint="Enter your password"
                                    persistent-hint
                                    :error-messages="errors.password"
                                    @input="errors.password = []"
                                    @click:append="show = !show"
                                    required
                            >
                                <template #label>
                                    Password <span class="red--text"><strong>*</strong></span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" class="pt-0 pb-0">
                            <v-checkbox
                                    v-model="user.remember"
                                    label="Remember me"
                            ></v-checkbox>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <div class="text-left pl-6 pr-6"><small><span class="red--text"><strong>*</strong></span> indicates required field</small></div>
            <v-card-actions class="pt-4 pl-6 pr-6 pb-4">
                <v-btn block color="primary" tile @click="login" :loading="loading" :disabled="!valid || loading">{{applyButton}}</v-btn>
            </v-card-actions>
            <div class="caption grey--text darken-4 pb-4 pl-6 pr-6"><a href="/password/reset"> {{$vuetify.lang.translator('auth.forget_password')}} </a></div>
        </v-card>
        <v-alert v-if="verify_block"
                 dense
                 text
                 type="success"
                 class="mt-4"
        >
            {{$vuetify.lang.translator('auth.verified_text')}}
        </v-alert>
        <v-alert v-if="verify_error"
                 dense
                 text
                 type="error"
                 class="mt-4"
        >
            {{verify_error}}
        </v-alert>
        <div class="text-center mt-6" style="position: relative; z-index: 2">
            <div class="caption grey--text darken-4"> {{$vuetify.lang.translator('auth.no_account')}} </div>
            <v-btn
                    block
                    small
                    text
                    tile
                    href="/register"
                    color="primary darken-1"
            >
                {{$vuetify.lang.translator('auth.register_btn_text')}}
            </v-btn>
        </div>
        <!--<snackbar position="relative"></snackbar>-->
    </div>
</template>

<script>
    //import Snackbar from "../../Snackbar";
    export default {
        name: "Login",
        //components: {Snackbar},
        data() {
            return {
                valid: true,
                loading: false,
                formTitle: 'Login',
                formSubTitle: 'Fill in the fields to log in',
                applyButton: 'Login',
                show: false,
                rules: {
                    required: v => !!v || 'The field is required',
                    min: v => (v && v.length >= 6) || 'Min 6 characters',
                    email: v => (v && /.+@.+\..+/.test(v)) || 'E-mail must be valid'
                },
                user: {
                    email: '',
                    password: '',
                    remember: false,
                },
                errors: {
                    email: [],
                    password: [],
                    remember: [],
                },
                verify_block: window.verified,
                verify_error: window.v_error
            }
        },
        methods: {
            login() {
                let self = this;
                this.loading = true;
                let form = this.user.remember ? this.user : _.omit(this.user, ['remember']);
                axios.post('/login', form)
                    .then(response => {
                        console.log(response);
                        if(response.data.auth)
                            window.location.href=response.data.intended;
                        //else this.$store.commit('snackbars/showSnackbar',{ text: response.data.message, success: false});
                    })
                    .catch(error => {
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