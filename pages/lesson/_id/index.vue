<template>
  <v-card class="d-flex align-stretch">
    <LessonSections />
    <LessonSectionTranslation />
    <SnackbarWordSavedStudy />
    <DialogCreateTranslation />
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
