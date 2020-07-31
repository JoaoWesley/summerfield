<template>
  <v-dialog v-model="dialogCreateLesson" width="1000px">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Criar lição
      </v-card-title>
      <v-container>
        <v-row class="mx-2">
          <v-col class="align-center justify-space-between" cols="12" md="12">
            <v-row align="center" class="mr-0">
              <v-text-field v-model="lesson.title" placeholder="Título" />
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="12">
            <v-textarea
              v-if="!lesson.hasTopics"
              v-model="lesson.text"
              solo
              name="input-7-4"
              label="Insira o texto aqui."
              auto-grow
              outlined
              rounded
              class="normal-text-area"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="12">
            <v-file-input
              placeholder="Adicione arquivo de áudio"
              show-size
              prepend-icon="mdi-book-music"
              @change="setFile($event)"
            />
          </v-col>
        </v-row>

        <v-checkbox
          v-model="lesson.shared"
          label="Compartilhar essa lição com outros usuários"
          color="primary"
          hide-details
        ></v-checkbox>

        <v-alert v-if="error.message" type="error">
          {{ error.message }}
        </v-alert>
      </v-container>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="setDialogCreateLesson(false)">
          Fechar
        </v-btn>
        <v-btn
          text
          @click="
            setDialogCreateLesson(false)
            saveLesson()
          "
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import * as apiService from '@/services/apiService'
import * as googleStorageApiService from '@/services/googleStorageApiService'
import jwt from 'jsonwebtoken'

export default {
  data: () => ({
    lesson: { title: null, text: null, shared: false },
    file: null,
    error: {
      message: '',
      code: null,
    },
    checkboxShareLesson: false,
  }),
  computed: {
    dialogCreateLesson: {
      get() {
        return this.$store.getters.getDialogCreateLesson
      },
      set(value) {
        this.setDialogCreateLesson(value)
      },
    },
  },
  created() {
    if (process.client) {
      this.$eventBus.$on('editLesson', (lesson) => {
        this.lesson = lesson
        this.setDialogCreateLesson(true)
      })
    }
  },
  methods: {
    ...mapActions({
      setDialogCreateLesson: 'setDialogCreateLesson',
    }),

    async saveLesson() {
      if (!this.lesson.title || !this.lesson.text) {
        return
      }

      if (this.lesson._id) {
        if (this.file) {
          await this.uploadFileToBucket(this.lesson)
        }
        await apiService.updateLesson(this.lesson)
        return
      }

      if (this.lesson.hasTopics) {
        const { lessonId } = this.lesson
        delete this.lesson.lessonId
        await apiService.updateLessonTopic(lessonId, this.lesson)
        return
      }

      let lessonCreated = await apiService.postLesson(this.lesson)
      if (this.file) {
        lessonCreated = await this.uploadFileToBucket(lessonCreated) // na verdade não preciso reotrnar pos já altera por referencia
      }
      this.$eventBus.$emit('lessonSaved', lessonCreated)
      this.lesson = {}
    },
    async uploadFileToBucket(lesson) {
      try {
        const bucketObject = await googleStorageApiService.postObjectOnLessonAudioBucket(
          this.getFileName(lesson),
          this.file
        )
        lesson.audioUrl = bucketObject.data.mediaLink
        apiService.updateLesson(lesson)
        return lesson
      } catch (error) {
        console.log('error', error)
      }
    },

    setFile(file) {
      this.error = {}
      this.file = null
      if (file && file.type !== 'audio/mpeg') {
        this.error.message = 'Formato do arquivo não é válido'
        return
      }
      if (file.size / 1024 / 1024 > 20) {
        // Se maior que 20 Megas
        this.error.message = 'Arquivo não pode ser maior que 20 megas'
      }

      this.file = file
    },

    getFileName(lessonCreated) {
      const userId = jwt.decode(this.$cookiz.get('token')).id
      return userId + '/' + lessonCreated._id + '/' + new Date().getTime() + '-' + this.file.name
    },
  },
}
</script>
