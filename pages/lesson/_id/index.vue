<template>
  <v-card class="d-flex align-stretch">
    <LessonSections />
    <LessonSectionTranslation />
    <SnackbarWordSavedStudy />
    <DialogCreateTranslation />
    <ConfirmModal ref="confirm" />
  </v-card>
</template>

<script>
import LessonSectionTranslation from '@/components/lesson/lesson-display/lesson-section-translation'
import LessonSections from '@/components/lesson/lesson-display/lesson-sections'
import SnackbarWordSavedStudy from '@/components/lesson/snackbar-word-saved-study'
import DialogCreateTranslation from '@/components/lesson/dialog-create-translation'
import ConfirmModal from '@/components/confirm-modal'

export default {
  components: {
    LessonSections,
    SnackbarWordSavedStudy,
    DialogCreateTranslation,
    ConfirmModal,
    LessonSectionTranslation,
  },

  async asyncData({ params, store }) {
    if (process.server) {
      await store.dispatch('lesson/fetchLesson', params.id)
      await store.dispatch('lesson/fetchStudyItems')
      await store.dispatch('fetchStatusReport')
    }
  },
  created() {
    if (process.client) {
      this.$eventBus.$on('wordSavedForStudyEvent', (message) => {
        this.$store.dispatch('lesson/addStudyItem', {
          wordPhrase: message.wordPhrase,
          translation: message.wordPhraseTranslation,
        })
        this.$store.dispatch('lesson/setWordPhraseTranslations', [message.wordPhraseTranslation])
      })

      //update all same words on section with the same status
      this.$eventBus.$on('wordStatusUpdated', (message) => {
        this.$store.dispatch('lesson/updateWordStatusInSection', message)
      })
    }
  },
}
</script>

<!--<style scoped> -->
<style>
span {
  cursor: pointer;
  border-radius: 5px;
}
span.title {
  font-size: 1.6em !important;
  line-height: 1.6em;
}
span:hover {
  opacity: 0.8;
}
</style>
