<template>
  <v-dialog v-model="showDialogImportEbook" width="40%">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Importar ebook
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            Importe seu ebook selecionando o arquivo abaixo, ou qualquer arquivo nos formatos PDF e DOCX. E será criado um lição automaticamente com o conteúdo do livro.

            <v-file-input v-model="teste" show-size @change="setFile($event)" />

            <div class="text-center">
              <v-dialog v-model="dialogImportLoading" hide-overlay persistent width="300">
                <v-card color="primary" dark>
                  <v-card-text>
                    Importando arquivo, aguarde por favor
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
            <v-alert v-if="error.message" type="error">
              {{ error.message }}
            </v-alert>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="closeImportingEbookModal">
          Cancelar
        </v-btn>
        <v-btn text :disabled="isSendingFile" @click="sendFile">
          Enviar
        </v-btn>
      </v-card-actions>
    </v-card>
    <ConfirmModal ref="confirm" />
  </v-dialog>
</template>

<script>
import axios from 'axios'
import ConfirmModal from '@/components/confirm-modal'
import allowedFileTypes from '@/commons/allowedFileTypes'

export default {
  components: {
    ConfirmModal,
  },
  props: {
    showDialogImportEbook: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    teste: null,
    dialogImportLoading: false,
    isSendingFile: false,
    error: {
      message: '',
      code: null,
    },
  }),

  methods: {
    setFile(file) {
      this.error = {}
      this.file = null
      if (file && !allowedFileTypes.includes(file.type)) {
        this.error.message = 'Formato do arquivo não é válido'
        return
      }
      this.file = file
    },
    async sendFile() {
      if (!this.file) {
        return
      }
      this.dialogImportLoading = true
      this.isSendingFile = true
      const data = new FormData()
      data.append('file', this.file)

      try {
        const result = await axios.post(`${process.env.API_URL}/lesson/import-lesson`, data, {
          // receive two    parameter endpoint url ,form data
          withCredentials: true,
        })

        const approvedOpenLesson = await this.$refs.confirm.open(
          'Documento importado!',
          'Deseja abrir lição criada?',
          { color: 'blue' }
        )

        if (approvedOpenLesson) {
          location.href = `${process.env.BASE_URL}/lesson/${result.data._id}/topic`
        }
      } catch (error) {
        this.error.message = 'Erro ao fazer o upload do arquivo'
        if (error.response.data.code === 'LIMIT_FILE_SIZE') {
          this.error.code = error.response.data.code
          this.error.message = 'Arquivo execedeu o tamanho máximo de 4MB'
        }
        this.dialogImportLoading = false
        this.isSendingFile = false
        return
      }

      this.dialogImportLoading = false
      this.isSendingFile = false
    },

    async closeImportingEbookModal() {
      this.$emit('closeModal')
    },
  },
}
</script>
