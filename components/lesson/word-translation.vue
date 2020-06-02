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
      wordAlreadyTranslated: 'lesson/getWordAlreadyTranslated',
    }),
  },

  methods: {
    async saveWordToStudy() {
      const study = this.$studyService.buildStudyObject(
        this.phraseSelected,
        this.wordPhraseTranslation,
        this.wordTapped,
        this.sectionTokens
      )

      if (this.wordAlreadyTranslated && this.wordAlreadyTranslated.translation) {
        this.updateTranslation(study)
      } else {
        await axios.post(`${process.env.API_URL}/study`, study)
        this.$eventBus.$emit('wordSavedForStudyEvent', {
          wordPhrase: this.wordTapped.text,
          wordPhraseTranslation: this.wordPhraseTranslation,
        })
      }

      if (
        this.wordTapped.status === wordStatusType.LEARNING ||
        this.wordTapped.status === wordStatusType.KNOWN
      ) {
        await this.updateWordStatus()
        return
      }

      await this.saveWord()
    },

    async saveWord() {
      this.$store.dispatch('lesson/setWordTapped', {
        text: this.wordTapped.text,
        status: wordStatusType.LEARNING,
      })
      await axios.post(`${process.env.API_URL}/word`, {
        words: [this.wordTapped],
      })
      this.$eventBus.$emit('wordStatusUpdated', {
        word: this.wordTapped.text,
        newStatus: wordStatusType.LEARNING,
      })
    },

    async updateTranslation(study) {
      await axios.put(`${process.env.API_URL}/study`, study)
      this.$eventBus.$emit('wordSavedForStudyEvent', {
        wordPhrase: this.wordTapped.text,
        wordPhraseTranslation: this.wordPhraseTranslation,
      })
    },

    async updateWordStatus() {
      if (!this.wordTapped || !this.wordTapped.text) {
        return
      }

      this.$store.dispatch('lesson/setWordTapped', {
        text: this.wordTapped.text,
        status: wordStatusType.LEARNING,
      })

      await axios.put(`${process.env.API_URL}/word`, {
        word: this.wordTapped,
      })

      this.$eventBus.$emit('wordStatusUpdated', {
        word: this.wordTapped.text,
        newStatus: wordStatusType.LEARNING,
      })
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
