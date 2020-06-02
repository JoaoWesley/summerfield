<template>
  <v-dialog v-model="showDialogImportEbook" width="40%">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Importar ebook
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            Importe seu ebook selecionando o arquivo abaixo, ou qualquer arquivo nos formatos
            'Inserir formatos'. E será criado um lição automaticamente com o conteúdo do livro.

            <v-file-input show-size @change="setFile($event)" />

            <div class="text-center">
              <v-dialog v-model="dialog" hide-overlay persistent width="300">
                <v-card color="primary" dark>
                  <v-card-text>
                    Importando arquivo, aguarde por favor
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="closeModal">
          Cancelar
        </v-btn>
        <v-btn text @click="sendFile">
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
    dialog: false,
  }),

  methods: {
    setFile(file) {
      this.file = file
    },
    async sendFile() {
      if (this.file) {
        this.dialog = true
        const data = new FormData()
        data.append('file', this.file)

        const result = await axios.post(`${process.env.API_URL}/lesson/import-lesson`, data, {
          // receive two    parameter endpoint url ,form data
        })

        this.dialog = false

        const approvedOpenLesson = await this.$refs.confirm.open(
          'Documento importado!',
          'Deseja abrir lição criada?',
          { color: 'blue' }
        )

        if (approvedOpenLesson) {
          location.href = `${process.env.BASE_URL}/lesson/${result.data._id}/topic`
        }
      }
    },

    async closeModal() {
      this.$emit('closeModal')
    },
  },
}
</script>
