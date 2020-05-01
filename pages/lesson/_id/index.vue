<template>
  <v-row align="center">
    <v-col cols="11" sm="12" md="9" lg="9">
      <v-window
        v-model="window"
        class="elevation-1 $window-controls-top"
        :vertical="false"
        :show-arrows="true"
        :reverse="false"
        style="min-height: 35vw;"
      >
        <v-window-item
          v-for="(section, index1) in lesson.sections"
          :key="index1"
          @mousedown="setMouseState(true)"
          @mouseup="setMouseState(false)"
        >
          <v-row align="center">
            <v-col cols="1" sm="1" md="1" lg="1" />
            <v-col cols="10" sm="10" md="10" lg="10">
              <v-card flat style="min-height: 35vw;">
                <v-card-text>
                  <v-row class="mb-4" align="center">
                    <v-avatar color="grey" class="mr-4" />
                    <strong class="title">{{ lesson.title }}</strong>
                    <v-spacer />
                    <!-- <v-btn icon>
                      <v-icon>mdi-play-circle</v-icon>
                    </v-btn> -->
                  </v-row>
                  <p style="">
                    <slot v-for="(token, index) in section.tokens">
                      <span
                        :key="token.text + index"
                        class="title font-weight-light"
                        style="color: black; padding-bottom: -30px;"
                        :style="
                          !checkIfTokenIsPunctuation(token)
                            ? { 'margin-right': '0' }
                            : { 'margin-left': '0', 'margin-right': '0px' }
                        "
                        :class="{
                          'new-word': token.status === 'NEW' && token.type === 'WORD',
                          'learning-word': token.status === 'LEARNING' && token.type === 'WORD',
                        }"
                        @mouseover="setSelectionRangeStart($event)"
                        @click="translateWord(token, section.tokens)"
                        >{{ token.text }}
                      </span>

                      <slot v-if="!checkIfTokenIsPunctuation(section.tokens[index + 1])">
                        &nbsp;
                      </slot>
                    </slot>
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-col>

    <v-row>
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-window
          v-model="window"
          class="elevation-1 $window-controls-top"
          :vertical="false"
          :reverse="false"
          style="min-height: 36.65vw;"
        >
          <v-btn icon>
            <v-icon>mdi-play</v-icon>
          </v-btn>

          {{ wordTapped.text ? wordTapped.text : phraseSelected }}

          <div style="min-height: 15vw;">
            <WordTranslation
              v-for="(wordPhraseTranslation, index) in wordPhraseTranslations"
              :key="wordPhraseTranslation + index"
              :word-phrase-translation="wordPhraseTranslation"
              :word-tapped="wordTapped"
              :section-tokens="sectionTokens"
              :phrase-selected="phraseSelected"
              :word-already-translated="wordAlreadyTranslated"
            />
          </div>

          <v-row v-if="wordAlreadyTranslated" class="text-center">
            <v-col cols="12">
              <v-chip
                class="ma-2 text-center"
                color="indigo"
                text-color="white"
                :input-value="true"
                label
                style="width: 80%;"
                @click="showOtherTranslations"
              >
                MOSTRAR OUTRAS TRADUÇÕES
              </v-chip>
            </v-col>
          </v-row>
          <br />
          <v-row class="text-center">
            <v-col cols="12">
              <v-chip
                class="ma-2 text-center"
                color="teal"
                text-color="white"
                :input-value="true"
                filter
                @click="updateWordStatusToKnown"
              >
                Já sei essa palavra
              </v-chip>
            </v-col>
          </v-row>

          <div class="text-center">
            <v-btn rounded color="primary" dark @click="modalDialogCreateTranslation = true">
              Criar tradução
            </v-btn>
          </div>
        </v-window>
      </v-col>
    </v-row>

    <SnackbarWordSavedStudy />

    <DialogCreatetranslation
      :modal-dialog-create-translation="modalDialogCreateTranslation"
      :word-tapped="wordTapped"
      :study-items="studyItems"
      :phrase-selected="phraseSelected"
      :section-tokens="sectionTokens"
      :word-already-translated="wordAlreadyTranslated"
      @closeCreateTranslationModal="modalDialogCreateTranslation = false"
    />
  </v-row>
</template>

<script>
import axios from 'axios'

import wordStatusType from '@/commons/wordStatusType'
import WordTranslation from '@/components/lesson/word-translation'
import SnackbarWordSavedStudy from '@/components/lesson/snackbar-word-saved-study'
import DialogCreatetranslation from '@/components/lesson/dialog-create-translation'

export default {
  components: {
    WordTranslation,
    SnackbarWordSavedStudy,
    DialogCreatetranslation,
  },

  async asyncData({ params }) {
    if (process.server) {
      const lesson = (await axios.get(`${process.env.API_URL}/lesson/${params.id}`)).data
      let sections = []

      const getSections = (sections, tokens) => {
        if (tokens.length === 0) return
        sections.push({ tokens: tokens.splice(0, 107) })
        return getSections(sections, tokens)
      }

      getSections(sections, lesson.tokens)

      lesson.sections = sections

      const studyItems = (await axios.get(`${process.env.API_URL}/study/`)).data.items
      return {
        lesson,
        studyItems,
      }
    }
  },
  data: () => ({
    window: 0,
    wordPhraseTranslations: [],
    sectionTokens: [],
    wordTapped: {},
    phraseSelected: '',
    modalDialogCreateTranslation: false,
    mouseIsDown: false,
    wordAlreadyTranslated: '',
    selectionRangeStart: null,
    currentHoveredElement: null,
  }),
  watch: {
    mouseIsDown: async function () {
      if (!this.mouseIsDown && window.getSelection().toString()) {
        const phraseSelected = this.getPhraseSelected()
        console.log('mouse is not down', window.getSelection().toString())
        if (phraseSelected) {
          await this.translatePhrase(await this.trimPhrase(phraseSelected))
        }
        this.selectionRangeStart = null
      }
    },
  },

  created() {
    if (process.client) {
      this.$eventBus.$on('wordSavedForStudyEvent', (message) => {
        this.studyItems.push(message)
        this.wordPhraseTranslations = [message.wordPhraseTranslation]
      })

      this.$eventBus.$on('wordStatusUpdated', (message) => {
        this.sectionTokens.forEach((token) => {
          if (token.text.toLowerCase() === message.word.toLowerCase()) {
            token.status = message.newStatus
          }
        })
      })
    }
  },

  methods: {
    checkIfTokenIsPunctuation(token) {
      if (!token) {
        return false
      }

      return !token.text.match(/[a-z]+/) && !token.text.match(/[0-9]+/)
    },

    async translateWord(token, sectionTokens) {
      this.phraseSelected = ''
      this.wordTapped = token
      this.sectionTokens = sectionTokens

      const wordTranslatedAlready = this.studyItems.filter(
        (item) => item.wordPhrase.toLowerCase() === token.text.toLowerCase()
      )
      if (wordTranslatedAlready.length > 0) {
        this.wordAlreadyTranslated = wordTranslatedAlready.pop()
        this.wordPhraseTranslations = []
        this.wordPhraseTranslations.push(this.wordAlreadyTranslated.translation)
        return
      }

      this.wordAlreadyTranslated = ''

      //chmar api que vai retornar traducão da palavra
      this.wordPhraseTranslations = ['Linguagem', 'Lingua', 'Idioma']
    },

    async translatePhrase(phrase) {
      this.wordTapped = {}
      this.phraseSelected = phrase

      const phraseTranslatedAlready = this.studyItems.filter(
        (item) => item.wordPhrase.toLowerCase() === phrase.toLowerCase()
      )

      if (phraseTranslatedAlready.length > 0) {
        this.wordPhraseTranslations = []
        this.wordPhraseTranslations.push(phraseTranslatedAlready.pop().translation)
        return
      }
      //chamar api que vai retornar traducão da palavra
      this.wordPhraseTranslations = ['A traducão da frase']
    },

    async updateWordStatusToKnown() {
      this.wordTapped.status = wordStatusType.KNOWN

      console.log('chamou', this.wordTapped)

      await axios.put(`${process.env.API_URL}/word`, {
        word: this.wordTapped,
      })
      this.$eventBus.$emit('wordStatusUpdated', {
        word: this.wordTapped.text,
        newStatus: wordStatusType.KNOWN,
      })
    },

    async trimPhrase(phrase) {
      const trimmedPhrase = (
        await axios.post(`${process.env.API_URL}/study/trim-phrase`, {
          phrase: phrase,
        })
      ).data.phrase

      return trimmedPhrase
    },

    setMouseState(state) {
      this.mouseIsDown = state
    },

    showOtherTranslations() {
      //chamar api de traducao.
      this.wordPhraseTranslations.push('Another Translation')
      this.wordPhraseTranslations.push('Mais uma Translation')
      this.wordAlreadyTranslated = ''
    },

    setSelectionRangeStart($event) {
      if (this.mouseIsDown && !this.selectionRangeStart) {
        this.selectionRangeStart = $event.target
      }

      if (this.mouseIsDown) {
        this.currentHoveredElement = $event.target
      }
    },

    getPhraseSelected() {
      console.log('chamar aqui shajkhkjahkjsha')
      console.log('start', this.selectionRangeStart)
      // console.log('currentHoveredElement', this.currentHoveredElement);
      if (!this.selectionRangeStart && !this.currentHoveredElement) {
        return null
      }

      var range = document.createRange()
      range.setStartBefore(this.selectionRangeStart)
      range.setEndAfter(this.currentHoveredElement.lastChild)
      var sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      console.log('phrase selected', window.getSelection().toString())
      return window.getSelection().toString()
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
  /* display: inline-block !important;      */
  /* user-select: all !important; */
  /* margin-bottom: 10px !important; */
  border-radius: 5px;
}
span:hover {
  opacity: 0.8;
}

::selection {
  /* background: none; */
  background: #318dff;
  border-color: green;
  border-radius: 2rem !important;
  outline: 8px ridge rgba(170, 50, 220, 0.6);
}
</style>
