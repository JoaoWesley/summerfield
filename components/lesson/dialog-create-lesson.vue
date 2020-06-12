<template>
     <v-dialog v-model="dialogCreateLesson" width="800px">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Criar lição
        </v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-text-field v-model="lesson.title" placeholder="Título" />
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <v-textarea
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
import { mapGetters, mapActions } from 'vuex'
import * as apiService from '@/services/apiService'

export default {    
    data: () => ({
        lesson: {},
    }),
    created() {
        if (process.client) {
            this.$eventBus.$on('editLesson', (lesson) => {
                this.lesson = lesson
                this.setDialogCreateLesson(true)
            })
        }
    },
    computed: {        

        ...mapGetters({
            dialogCreateLesson: 'getDialogCreateLesson'
        })
    },
    methods: {
        ...mapActions({
            setDialogCreateLesson: 'setDialogCreateLesson'
        }),

        async saveLesson() {
            if (!this.lesson.title || !this.lesson.text) {
                return
            }

            if (this.lesson._id) {      
              await apiService.updateLesson(this.lesson)
                return
            }            

            if(this.lesson.lessonId) {//Se tem lessonId é porque é tópico                         
              const { lessonId } = this.lesson
              delete this.lesson.lessonId              
              await apiService.updateLessonTopic(lessonId, this.lesson)
              return
            }

            const lessonCreated = await apiService.postLesson(this.lesson)
            this.$eventBus.$emit('lessonSaved', lessonCreated)
            this.lesson = {}
        },    
    }
}
</script>