<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Alterar senha</v-toolbar-title>

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
              id="newPassword"
              label="Nova senha"
              name="newPassword"
              prepend-icon="mdi-lock"
              type="password"
              v-model="user.newPassword"
              :rules="passwordRules"
              required
            ></v-text-field>

            <v-text-field
              id="confirmPassword"
              label="Confirmar nova senha"
              name="confirmPassword"
              prepend-icon="mdi-lock"
              type="password"
              v-model="user.confirmPassword"
              :rules="passwordsMatchRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-row align="center" justify="center" v-if="success.message">
          <v-col cols="9" sm="9" md="9">
            <v-alert type="success">{{success.message}}</v-alert>
          </v-col>
        </v-row>

        <v-row align="center" justify="center" v-if="error.message">
          <v-col cols="9" sm="9" md="9">
            <v-alert type="error">{{error.message}}</v-alert>
          </v-col>
        </v-row>

        <v-row align="center" justify="center" v-if="isLoading">
          <v-progress-circular indeterminate color="primary" align="center" justify="center"></v-progress-circular>
        </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="resetPassword">Alterar senha</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import * as apiService from '@/services/apiService'

export default {  
    props: {
        userId: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    },

    data: function (){
      return {
        user: { },
        passwordRules: [
            v => !!v || 'Senha é um campo obrigratório',
            v => (v && v.length <= 35) || 'A senha deve ser menor que 35 caracteres',
            v => (v && !!v.match(/^(?=.*\d).{4,20}$/)) || 'A senha deve ter no mínimo 4 caracteres, no máximo 20 e pelo menos um digito númerico',            
        ],
        passwordsMatchRules: [
          v => !!v || 'Senha é um campo obrigatório',
          v => (v && v.length <= 35) || 'A senha deve ser menor que 35 caracteres',
          v => (this.user.newPassword === this.user.confirmPassword) || 'As duas senhas não são iguais',                
          v => (v && !!v.match(/^(?=.*\d).{4,20}$/)) || 'A senha deve ter no mínimo 4 caracteres, no máximo 20 e pelo menos um digito númerico',            
        ],
        success: {
            message: null
        },
        error: {
          message: null
        },
        isLoading: false
      }
    },
    methods: {
        async resetPassword () {          
            if(!this.$refs.form.validate()) {
              return false
            }

            //Build object
            this.user.password = this.user.newPassword
            this.user.userId = this.userId
            this.user.token = this.token
            try {                
                this.setIsLoading(true)
                await apiService.resetPassword(this.user)
                this.setIsLoading(false)
                this.setSuccessMessage('Senha alterado com sucesso!')
                this.$emit('showLoginForm')
            } catch(error) {
              this.setErrorMessage('Erro ao alterar senha, solicite novamente um e-mail de alteração')
            }
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
        }
    },
}
</script>