<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title v-if="formState.login">
            Entrar
          </v-toolbar-title>
          <v-toolbar-title v-if="formState.register">
            Cadastrar
          </v-toolbar-title>
          <v-toolbar-title v-if="formState.resetPassword">
            Alterar senha
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon large target="_blank" v-on="on">
                <v-icon>mdi-code-tags</v-icon>
              </v-btn>
            </template>
            <span>Source</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="user.email"
              label="E-mail"
              name="email"
              prepend-icon="mdi-account"
              type="email"
              :rules="emailRules"
              required
            ></v-text-field>

            <v-text-field
              v-if="formState.register"
              id="name"
              v-model="user.name"
              label="Nome"
              name="name"
              prepend-icon="mdi-account"
              type="text"
              :rules="nameRules"
              required
            ></v-text-field>

            <v-text-field
              v-if="!formState.resetPassword"
              id="password"
              v-model="user.password"
              label="Senha"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              :rules="passwordRules"
              required
            ></v-text-field>

            <v-text-field
              v-if="formState.register"
              id="confirmPassword"
              v-model="user.confirmPassword"
              label="Confirmar senha"
              name="confirmPassword"
              prepend-icon="mdi-lock"
              type="password"
              :rules="passwordsMatchRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-row v-if="error.message" align="center" justify="center">
          <v-col cols="9" sm="9" md="9">
            <v-alert type="error">
              {{ error.message }}
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-if="success.message" align="center" justify="center">
          <v-col cols="9" sm="9" md="9">
            <v-alert type="success">
              {{ success.message }}
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-if="isLoading" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="primary"
            align="center"
            justify="center"
          ></v-progress-circular>
        </v-row>

        <v-card-actions>
          <!-- <span style="color: #879395;">Não tem conta?</span>
          &nbsp;-->
          <div v-if="!formState.register">
            <a href="#" style="text-decoration: none;" @click="setRegisterState">Não tenho conta</a>
          </div>
          <v-spacer v-if="!formState.register"></v-spacer>

          <div v-if="!formState.login">
            <a href="#" style="text-decoration: none;" @click="setLoginState">Entrar</a>
          </div>
          <v-spacer v-if="!formState.login"></v-spacer>

          <div v-if="!formState.resetPassword">
            <a href="#" style="text-decoration: none;" @click="setResetPasswordState">
              Esqueci a senha
            </a>
          </div>
          <v-spacer v-if="!formState.resetPassword"></v-spacer>

          <v-btn v-if="formState.login" color="primary" @click="login">
            Entrar
          </v-btn>
          <v-btn v-if="formState.register" color="primary" @click="register">
            Registrar
          </v-btn>
          <v-btn v-if="formState.resetPassword" color="primary" @click="sendResetPasswordEmail">
            Alterar senha
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import * as apiService from '@/services/apiService'
import responseCodeTypes from '@/commons/respondeCodeTypes'

export default {
  data: function () {
    return {
      emailRules: [
        (v) => !!v || 'E-mail é um campo obrigatório',
        (v) => /.+@.+\..+/.test(v) || 'O e-mail deve ser válido',
      ],
      nameRules: [
        (v) => !!v || 'Nome é um campo obrigatório',
        (v) => (v && v.length <= 35) || 'O nome deve ser menor que 35 caracteres',
      ],
      passwordRules: [
        (v) => !!v || 'Senha é um campo obrigatório',
        (v) => (v && v.length <= 35) || 'A senha deve ser menor que 35 caracteres',
      ],

      passwordsMatchRules: [
        (v) => !!v || 'Senha é um campo obrigatório',
        (v) => (v && v.length <= 35) || 'A senha deve ser menor que 35 caracteres',
        () => this.user.password === this.user.confirmPassword || 'As duas senhas não são iguais',
      ],

      user: {},
      formState: {
        register: false,
        login: true,
        resetPassword: false,
      },
      error: {
        message: null,
      },

      success: {
        message: null,
      },
      isLoading: false,
    }
  },

  methods: {
    async login() {
      if (!this.$refs.form.validate()) {
        return false
      }
      try {
        this.setIsLoading(true)
        await apiService.login(this.user)
        this.setSuccessMessage('Logado com sucesso!')
        this.setIsLoading(false)
        //location.href = '/lesson?shared=true'
      } catch (error) {
        this.setIsLoading(false)
        if (error.response.status === 401) {
          this.setErrorMessage('E-mail ou senha inválidos')
          return
        }
        if (error.response.data.code === responseCodeTypes.EMAIL_NOT_FOUND) {
          this.setErrorMessage('E-mail não encontrado')
          return
        }
        this.setErrorMessage('Erro ao logar')
      }
    },

    async register() {
      if (!this.$refs.form.validate()) {
        return false
      }

      try {
        this.setIsLoading(true)
        await apiService.register(this.user)
        this.setIsLoading(false)
        this.setSuccessMessage('Cadastrado com sucesso!')
        //this.setLoginState()
        location.href = '/lesson'
      } catch (error) {
        this.setIsLoading(false)
        this.success.message = ''
        if (
          error.response.status === 400 &&
          error.response.data.code === responseCodeTypes.EMAIL_ALREADY_EXISTS
        ) {
          this.error.message = 'E-mail informado já existente'
          return
        }
        this.setErrorMessage('Erro ao cadastrar')
      }
    },

    async sendResetPasswordEmail() {
      if (!this.$refs.form.validate()) {
        return false
      }
      try {
        this.setIsLoading(true)
        await apiService.sendResetPasswordEmail(this.user)
        this.setIsLoading(false)
        this.setSuccessMessage(
          'Foi enviado um e-mail para você com instruções para realizar a troca de senha'
        )
      } catch (error) {
        this.setIsLoading(false)
        if (error.response.data.code === responseCodeTypes.EMAIL_NOT_FOUND) {
          this.setErrorMessage('E-mail não encontrado')
          return
        }

        this.setErrorMessage('Erro ao enviar e-mail de alteração de senha')
      }
    },

    setRegisterState() {
      this.formState.register = true
      this.formState.login = false
      this.formState.resetPassword = false
    },

    setResetPasswordState() {
      this.formState.register = false
      this.formState.login = false
      this.formState.resetPassword = true
    },

    setLoginState() {
      this.formState.register = false
      this.formState.login = true
      this.formState.resetPassword = false
    },

    setSuccessMessage(message) {
      this.error.message = null
      this.success.message = message
    },

    setErrorMessage(message) {
      this.success.message = null
      this.error.message = message
    },

    setIsLoading(state) {
      this.isLoading = state
    },
  },
}
</script>
