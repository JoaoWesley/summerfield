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
              v-model="wordPhraseTranslation"
              solo
              name="input-7-4"
              label="Insira sua tradução aqui."
              auto-grow
              outlined
              rounded
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
            saveWordToStudy()
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
import axios from 'axios'
import wordStatusType from '@/commons/wordStatusType'

export default {
  props: {
    modalDialogCreateTranslation: {
      type: Boolean,
      required: true,
    },
    wordTapped: {
      type: Object,
      required: true,
    },
    studyItems: {
      type: Array,
      required: true,
    },
    phraseSelected: {
      type: String,
      required: true,
    },
    sectionTokens: {
      type: Array,
      required: true,
    },
    wordAlreadyTranslated: {
      type: [String, Object],
      required: true,
    },
  },

  data: function () {
    return {
      wordPhraseTranslation: null,
    }
  },
  computed: {
    wordPhrase: function () {
      if (this.wordTapped && this.wordTapped.text) {
        return this.wordTapped.text
      }

      return this.phraseSelected
    },
  },
  watch: {
    wordTapped: function () {
      this.wordPhraseTranslation = null
      const wordAlreadyTranslated = this.studyItems.filter(
        (item) => this.wordPhrase.toLowerCase() === item.wordPhrase.toLowerCase()
      )
      if (wordAlreadyTranslated.length > 0) {
        this.wordPhraseTranslation = wordAlreadyTranslated.pop().translation
      }
    },

    phraseSelected: function () {
      const phraseAlreadyTranslated = this.studyItems.filter(
        (item) => this.wordPhrase.toLowerCase() === item.wordPhrase.toLowerCase()
      )
      if (phraseAlreadyTranslated.length > 0) {
        this.wordPhraseTranslation = phraseAlreadyTranslated.pop().translation
      }
    },
  },

  created() {
    if (process.client) {
      this.$eventBus.$on('wordSavedForStudyEvent', (message) => {
        this.wordPhraseTranslation = message.wordPhraseTranslation
      })
    }
  },

  methods: {
    async closeModal() {
      this.$emit('closeCreateTranslationModal')
    },

    async saveWordToStudy() {
      const study = this.$studyService.buildStudyObject(
        this.phraseSelected,
        this.wordPhraseTranslation,
        this.wordTapped,
        this.sectionTokens
      )

      console.log('this.wordAlreadyTranslated', this.wordAlreadyTranslated)
      if (this.wordAlreadyTranslated) {
        this.updateTranslation(study)
        return
      }

      await axios.post(`${process.env.API_URL}/study`, study)
      this.$eventBus.$emit('wordSavedForStudyEvent', {
        wordPhrase: this.wordPhrase,
        wordPhraseTranslation: this.wordPhraseTranslation,
      })

      if (this.wordTapped.status != wordStatusType.LEARNING) {
        await this.updateWordStatus()
      }

      this.closeModal()
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

      this.wordTapped.status = wordStatusType.LEARNING
      const wordObject = {
        words: [
          {
            text: this.wordTapped.text,
            status: wordStatusType.LEARNING,
          },
        ],
      }
      await axios.post(`${process.env.API_URL}/word`, wordObject)
    },
  },
}
</script>
