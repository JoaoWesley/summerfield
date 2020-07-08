<template>
  <v-row>
    <v-col cols="12">
      <v-textarea
        rows="1"
        auto-grow
        dense
        readonly
        outlined
        rounded
        success
        solo
        persistent-hint
        :value="wordPhraseTranslation.text"
        :hint="
          wordPhraseTranslation.isPopularTranslation
            ? `Utilizada ${wordPhraseTranslation.popularTranslationOcurrences} vezes por outros usuários`
            : ''
        "
        :background-color="wordPhraseTranslation.isPopularTranslation ? 'amber' : ''"
        :title="
          wordPhraseTranslation.isPopularTranslation
            ? 'Tradução mais utilizada por outros usuários'
            : ''
        "
        @click="saveWordToStudy"
      >
      </v-textarea>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as studyService from '@/services/studyService'
import * as apiService from '@/services/apiService'

export default {
  props: {
    wordPhraseTranslation: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      wordTapped: 'lesson/getWordTapped',
      wordPhraseTranslations: 'lesson/getWordPhraseTranslations',
      phraseSelected: 'lesson/getPhraseSelected',
      sectionTokens: 'lesson/getSectionTokens',
      wordPhraseHasTranslation: 'lesson/getWordPhraseHasTranslation',
      lessonId: 'lesson/getLessonId',
      lesson: 'lesson/getLesson',
      window: 'lesson/getWindow',
    }),
  },

  methods: {
    ...mapActions({
      updateStudyItemTranslation: 'lesson/updateStudyItemTranslation',
      createStudyItem: 'lesson/createStudyItem',
      setWordPhraseHasTranslation: 'lesson/setWordPhraseHasTranslation',
    }),
    async saveWordToStudy() {
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
      apiService.createPopularTranslation(translation)
      this.setWordPhraseHasTranslation({})
    },
  },
}
</script>

<style scoped>
.new-word {
  background: rgb(175, 227, 241);
}
.learning-word {
  background: rgb(255, 229, 120);
}
span {
  cursor: pointer;
  display: inline-block !important;
}
span:hover {
  opacity: 0.8;
}

fieldset {
  cursor: pointer !important;
}
</style>
