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
        :value="wordPhraseTranslation"
        @click="saveWordToStudy"
      >
      </v-textarea>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import wordStatusType from '@/commons/wordStatusType'
import { mapGetters } from 'vuex'
import * as studyService from '@/services/studyService'

export default {
  props: {
    wordPhraseTranslation: {
      type: String,
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
    }),
  },

  methods: {
    async saveWordToStudy() {
      const study = studyService.buildStudyObject(
        this.phraseSelected,
        this.wordPhraseTranslation,
        this.wordTapped,
        this.sectionTokens
      )         
      if (this.wordPhraseHasTranslation.translation) {
        await this.$store.dispatch('lesson/updateStudyItemTranslation', study)
        return
      }

      await this.$store.dispatch('lesson/createStudyItem', study)
    }   
  }
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
