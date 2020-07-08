<template>
  <v-dialog v-model="modalDialogCreateTranslation" width="800px">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Criar tradução
      </v-card-title>
      <v-container>
        <v-chip
          class="ma-2"
          color="indigo"
          text-color="white"
          :input-value="true"
          label
          style="min-width: 17%; justify-content: center;"
        >
          {{ wordPhrase }}
        </v-chip>

        <v-row>
          <v-col cols="12" md="12">
            <v-textarea
              v-model="wordPhraseTranslation.text"
              solo
              name="input-7-4"
              label="Insira sua tradução aqui."
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
        <v-btn text color="primary" @click="closeModal">
          Fechar
        </v-btn>
        <v-btn
          text
          @click="
            saveWordPhraseToStudy()
            closeModal()
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
import * as studyService from '@/services/studyService'
import * as apiService from '@/services/apiService'

export default {
  data: () => ({
    wordPhraseTranslationProxy: {},
  }),
  computed: {
    ...mapGetters({
      wordTapped: 'lesson/getWordTapped',
      phraseSelected: 'lesson/getPhraseSelected',
      sectionTokens: 'lesson/getSectionTokens',
      wordPhraseHasTranslation: 'lesson/getWordPhraseHasTranslation',
      studyItems: 'lesson/getStudyItems',
      modalDialogCreateTranslation: 'lesson/getModalDialogCreateTranslation',
      lessonId: 'lesson/getLessonId',
      lesson: 'lesson/getLesson',
      window: 'lesson/getWindow',
    }),
    wordPhrase: function () {
      if (this.wordTapped && this.wordTapped.text) {
        return this.wordTapped.text
      }

      return this.phraseSelected
    },
    wordPhraseTranslation: {
      get() {
        return !this.wordPhraseTranslationProxy.text
          ? { text: this.wordPhraseHasTranslation.translation }
          : this.wordPhraseTranslationProxy
      },
      set(value) {
        this.wordPhraseTranslationProxy.text = value
      },
    },
  },
  watch: {
    phraseSelected: function () {
      const phraseAlreadyTranslated = this.studyItems.filter(
        (item) => this.wordPhrase.toLowerCase() === item.wordPhrase.toLowerCase()
      )
      if (phraseAlreadyTranslated.length > 0) {
        this.wordPhraseTranslation.text = phraseAlreadyTranslated.pop().translation
      }
    },
  },

  methods: {
    ...mapActions({
      setModalDialogCreateTranslation: 'lesson/setModalDialogCreateTranslation',
      updateStudyItemTranslation: 'lesson/updateStudyItemTranslation',
      createStudyItem: 'lesson/createStudyItem',
      setWordPhraseHasTranslation: 'lesson/setWordPhraseHasTranslation',
    }),
    async closeModal() {
      this.setModalDialogCreateTranslation(false)
      this.wordPhraseTranslation = null
    },

    async saveWordPhraseToStudy() {
      const study = studyService.buildStudyObject(
        this.lessonId,
        this.phraseSelected,
        this.wordPhraseTranslation,
        this.wordTapped,
        this.sectionTokens
      )
      if (this.wordPhraseHasTranslation.translation) {
        await this.updateStudyItemTranslation(study)
        return
      }

      await this.createStudyItem(study)

      const translation = {
        wordPhrase: this.wordTapped.text || this.phraseSelected,
        translation: this.wordPhraseTranslation.text,
        context: { lessonId: this.lessonId, topicId: this.lesson.index, sectionId: this.window },
      }
      await apiService.createPopularTranslation(translation)

      this.setWordPhraseHasTranslation({})
      this.closeModal()
    },
  },
}
</script>
