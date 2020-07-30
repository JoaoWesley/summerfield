<template>
     <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title >
            Feedback
          </v-toolbar-title>          

          <v-spacer></v-spacer>        
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-textarea              
              id="name"
              v-model="feedback.text"              
              placeholder="Insira aqui sua sugestão melhoria ou reporte de algum problema"
              name="text"
              prepend-icon="mdi-message-alert"
              type="text"              
              required
            ></v-textarea>

            <v-radio-group v-model="feedback.category" :mandatory="false">
                <v-radio label="Melhoria" value="improvement"></v-radio>
                <v-radio label="Problema" value="problem"></v-radio>
            </v-radio-group>
          </v-form>
        </v-card-text>
        <v-row v-if="error.message" align="center" justify="center">
          <v-col cols="7" sm="7" md="7">
            <v-alert type="error">
              {{ error.message }}
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-if="success.message" align="center" justify="center">
          <v-col cols="7" sm="7" md="7">
            <v-alert type="success">
              {{ success.message }}
            </v-alert>
          </v-col>
        </v-row>       

        <v-card-actions>    
          <v-spacer ></v-spacer>
          <v-btn color="primary" @click="sendFeedBack">
            Enviar feedback
          </v-btn>          
        </v-card-actions>
      </v-card>
</template>

<script>
import * as apiService from '@/services/apiService'
export default {
    data () {
      return {
        error: { message: null},
        success: {message: null},
        feedback: {text: '', category: 'improvement'}
      }
    },
    methods: {
        async sendFeedBack() {
            if(this.feedback.text && this.feedback.category) {
                try {
                    await apiService.postFeedback(this.feedback)
                    this.setSuccessMessage('Feedback enviado com sucesso!')
                } catch(error) {
                    this.setErrorMessage('erro ao enviar feedback')                    
                }
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
    }
}
</script>