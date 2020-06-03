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
import { mapGetters } from 'vuex'

export default {  
  computed: {
    ...mapGetters({
      wordTapped: 'lesson/getWordTapped',
      phraseSelected: 'lesson/getPhraseSelected',
      sectionTokens: 'lesson/getSectionTokens',
      wordHasTranslation: 'lesson/getWordHasTranslation',
      studyItems: 'lesson/getStudyItems',
      modalDialogCreateTranslation: 'lesson/getModalDialogCreateTranslation',
    }),
    wordPhrase: function () {
      if (this.wordTapped && this.wordTapped.text) {
        return this.wordTapped.text
      }

      return this.phraseSelected
    },
     wordPhraseTranslation: {
       get() {
         return this.wordHasTranslation.translation
       },
       set(value) {         
        this.$store.dispatch('lesson/setWordHasTranslation', { translation: value })
       },
     }
  },  
  watch: {   
    phraseSelected: function () {
      const phraseAlreadyTranslated = this.studyItems.filter(
        (item) => this.wordPhrase.toLowerCase() === item.wordPhrase.toLowerCase()
      )
      if (phraseAlreadyTranslated.length > 0) {
        this.wordPhraseTranslation = phraseAlreadyTranslated.pop().translation
      }
    },
  },  

  methods: {
    async closeModal() {
      this.$store.dispatch('lesson/setModalDialogCreateTranslation', false)
    },

    async saveWordToStudy() {
      const study = this.$studyService.buildStudyObject(
        this.phraseSelected,
        this.wordPhraseTranslation,
        this.wordTapped,
        this.sectionTokens
      )      

      if (this.wordHasTranslation) {
        this.updateTranslation(study)
        return
      }

      await axios.post(`${process.env.API_URL}/study`, study)
      this.$eventBus.$emit('showSavedForStudySnackbarEvent')      
      this.$store.dispatch('lesson/addStudyItem', {
        wordPhrase: this.wordPhrase,
        translation: this.wordPhraseTranslation,
      })
      this.$store.dispatch('lesson/setWordPhraseTranslations', [this.wordPhraseTranslation])

      if (this.wordTapped.status != wordStatusType.LEARNING) {
        await this.updateWordStatus()
      }

      this.closeModal()
    },

    async updateTranslation(study) {
      await axios.put(`${process.env.API_URL}/study`, study)      
      this.$store.dispatch('lesson/addStudyItem', {
        wordPhrase: this.wordTapped.text,
        translation: this.wordPhraseTranslation,
      })
      this.$store.dispatch('lesson/setWordPhraseTranslations', [this.wordPhraseTranslation])
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
