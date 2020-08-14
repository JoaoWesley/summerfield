<template>
  <v-dialog v-model="dialogCreateLesson" width="1000px">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Criar lição
      </v-card-title>
      <v-container>
        <v-form ref="form">
          <v-row class="mx-2">
            <v-col class="align-center justify-space-between" cols="12" md="12">
              <v-row align="center" class="mr-0">
                <v-text-field
                  v-model="lesson.title"
                  placeholder="Título"
                  :rules="requiredFieldRule"
                />
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
                :rules="requiredFieldRule"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <v-file-input
                v-if="!lesson.hasTopics"
                placeholder="Adicione arquivo de áudio"
                show-size
                prepend-icon="mdi-book-music"
                @change="setFile($event)"
              />
            </v-col>
          </v-row>

          <v-checkbox
            v-if="lesson.index === undefined"
            v-model="lesson.shared"
            label="Compartilhar essa lição com outros usuários"
            color="primary"
            hide-details
          ></v-checkbox>
        </v-form>
        <v-alert v-if="error.message" type="error">
          {{ error.message }}
        </v-alert>
      </v-container>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="setDialogCreateLesson(false)">
          Fechar
        </v-btn>
        <v-btn text @click="saveLesson()">
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
import * as sectionsStorageService from '@/services/sectionsStorageService'

export default {
  data: () => ({
    lesson: { title: null, text: null, shared: false },
    requiredFieldRule: [(f) => !!f || 'Esté é um campo obrigatório'],
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
      if (this.lesson._id === undefined && this.lesson.index === undefined) {
        //Se não está editando seta imagem
        this.lesson.imageUrl =
          '/images/lesson/lesson-default-' + (Math.floor(Math.random() * 4) + 1) + '.png'
      }

      if (!this.$refs.form.validate()) {
        return false
      }

      if (this.lesson._id) {
        if (this.file) {
          await this.uploadFileToBucket(this.lesson)
        }
        await apiService.updateLesson(this.lesson)
        this.onEndingSavingLesson()
        return
      }

      if (this.lesson.index !== undefined) {
        // Se tem index é porque é um tópico
        if (this.file) {
          await this.uploadFileToBucket(this.lesson)
        }
        const { lessonId } = this.lesson
        await apiService.updateLessonTopic(lessonId, this.lesson)
        this.onEndingSavingLesson()
        return
      }

      this.lesson = await apiService.postLesson(this.lesson)
      if (this.file) {
        this.lesson = await this.uploadFileToBucket(this.lesson) // na verdade não preciso reotrnar pos já altera por referencia
      }
      this.$eventBus.$emit('lessonSaved', this.lesson)
      this.onEndingSavingLesson()
      this.lesson = {}
      //this.setDialogCreateLesson(false)
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

    getFileName(lesson) {
      const userId = jwt.decode(this.$cookiz.get('token')).id
      return (
        userId +
        '/' +
        (lesson._id || lesson.lessonId) +
        '/' +
        new Date().getTime() +
        '-' +
        this.file.name
      )
    },

    onEndingSavingLesson() {
      this.setDialogCreateLesson(false)

      const isTopic = this.lesson.index !== undefined
      if (isTopic) {
        sectionsStorageService.setLastUsedTopic(this.lesson.lessonId, this.lesson.index)
        location.href = `${process.env.BASE_URL}/lesson/${this.lesson.lessonId}/topic/${this.lesson.index}`
        return
      }
      localStorage.setItem('lastUsedLessonId', this.lesson._id)
      if (this.lesson.hasTopics) {
        location.href = `${process.env.BASE_URL}/lesson/${this.lesson._id}/topic`
        return
      }
      location.href = `${process.env.BASE_URL}/lesson/${this.lesson._id}`
    },
  },
}
</script>
