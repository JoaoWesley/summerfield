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
import axios from 'axios'
import wordStatusType from '@/commons/wordStatusType'
import { mapGetters } from 'vuex'

export default {  
  data: () => ({
    wordPhraseTranslationProxy: null
  }), 
  computed: {
    ...mapGetters({
      wordTapped: 'lesson/getWordTapped',
      phraseSelected: 'lesson/getPhraseSelected',
      sectionTokens: 'lesson/getSectionTokens',
      wordPhraseHasTranslation: 'lesson/getWordPhraseHasTranslation',
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
        return (this.wordPhraseTranslationProxy === null) ? this.wordPhraseHasTranslation.translation :this.wordPhraseTranslationProxy
      },
      set(value) {
        this.wordPhraseTranslationProxy = value
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
      this.wordPhraseTranslation = null      
    },

    async saveWordPhraseToStudy() {
      const study = this.$studyService.buildStudyObject(
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
      this.closeModal()
    }
  }
}
</script>
