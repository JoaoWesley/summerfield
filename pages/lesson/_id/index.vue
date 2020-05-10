<template>
  <v-card  class="d-flex align-stretch" >
     <v-card  style="width: 68%; margin-right: 2%" raised shaped outlined>
      <v-window
        v-model="window"
        class="elevation-1 $window-controls-top"
        :vertical="false"
        :show-arrows="true"
        :reverse="false"
        style="height: 100%"
        @change="updateNewWordsToKnown(false, $event)"
      >
        <v-window-item
          v-for="(section, index1) in lesson.sections"
          :key="index1"        
          @mousedown="setMouseState(true)"
          @mouseup="setMouseState(false)"
          style="height: 100%"
        >
          <v-row>
            <v-col cols="1" sm="1" md="1" lg="1" />
            <v-col cols="10" sm="10" md="10" lg="10">
              <v-card flat>
                <v-card-text>
                  <v-row class="mb-4" align="center">
                    <v-avatar color="grey" class="mr-4" />
                    <strong class="title">{{ lesson.title }}</strong>
                    <v-spacer />
                    <!-- <v-btn icon>
                      <v-icon>mdi-play-circle</v-icon>
                    </v-btn> -->
                  </v-row>
                  <p>
                    <slot v-for="(token, index) in section.tokens">
                      <span
                        :key="token.text + index"
                        class="title font-weight-light"
                        style="color: black;"
                        :class="{
                          'new-word': token.status === 'NEW' && token.type === 'WORD',
                          'learning-word': token.status === 'LEARNING' && token.type === 'WORD',
                          token:
                            section.tokens[index - 1] &&
                            section.tokens[index - 1].status === 'KNOWN' &&
                            token.type === 'PUNCTUATION',
                        }"
                        @mouseover="setSelectionRangeStart($event)"
                        @click="translateWord(token, section.tokens)"
                      >
                        {{ token.text }}
                      </span>

                      <slot
                        v-if="
                          section.tokens[index + 1] &&
                          section.tokens[index + 1].type !== 'PUNCTUATION'
                        "
                      >
                        &nbsp;
                      </slot>
                    </slot>
                  </p>

                  <div v-if="lesson.sections.length - 1 === window && showFinnishButtom">
                    <v-card class="d-flex flex-row-reverse" flat tile>
                      <v-chip
                        class="ma-2"
                        color="indigo"
                        text-color="white"
                        :input-value="true"
                        label
                        @click="
                          updateNewWordsToKnown(true)
                          redirectToLessons()
                        "
                      >
                        FINALIZAR
                      </v-chip>
                    </v-card>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
     </v-card>

    <v-card style="width: 30%; min-height:87vh" raised outlined>
      <v-window
        v-model="window"
        class="elevation-1 $window-controls-top"
        :vertical="false"
        :reverse="false"        
        style="height: 100%"
      >
        <v-alert v-if="!wordTapped.text && !phraseSelected" type="info" style="height: 100%">
          1 - Clique em qualquer palavra para ver a tradução.<br /><br />
          2 - Clique em uma tradução para salvar a palavra para estudo.<br /><br />
          3 - Também é possível criar a sua própria tradução. no botão 'Criar tradução'.<br /><br />
          4 - Palavras em branco são palavras conhecidas.<br /><br />
          5 - Palavras em azul são palavras novas.<br /><br />
          6 - Palavras em amarelo são palavras sendo estudadas.<br /><br />
        </v-alert>

        <div style="height: 60%;">
          <v-row style="height: 10%; margin-bottom: 20px">
            <v-col cols="2">             
               <v-btn icon v-if="wordTapped.text || phraseSelected">
                <v-icon>mdi-play-circle</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="10" style="margin-top: 6px;">
              <span style="word-break: break-all;">
                {{ wordTapped.text ? wordTapped.text : phraseSelected }}
              </span>
            </v-col>
          </v-row>

          <div style="min-height:50%">
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

          <v-row class="text-center">
            <v-col v-if="wordAlreadyTranslated" cols="12">             
              <v-btn rounded color="primary" dark  @click="showOtherTranslations">
                Mostrar outras traduções
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <br />
        <div style="height: 40%;">
          <v-row v-if="wordTapped.text || phraseSelected" class="text-center">
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
          <br />
          <div v-if="wordTapped.text || phraseSelected" class="text-center">
            <v-btn rounded color="primary" dark @click="modalDialogCreateTranslation = true">
              Criar tradução
            </v-btn>
          </div>
        </div>
      </v-window>
    </v-card>

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

    <ConfirmModal ref="confirm" />
  </v-card>

</template>

<script>
import axios from 'axios'

import wordStatusType from '@/commons/wordStatusType'
import WordTranslation from '@/components/lesson/word-translation'
import SnackbarWordSavedStudy from '@/components/lesson/snackbar-word-saved-study'
import DialogCreatetranslation from '@/components/lesson/dialog-create-translation'
import ConfirmModal from '@/components/confirm-modal'

export default {
  components: {
    WordTranslation,
    SnackbarWordSavedStudy,
    DialogCreatetranslation,
    ConfirmModal,
  },

  async asyncData({ params }) {
    if (process.server) {
      const lesson = (await axios.get(`${process.env.API_URL}/lesson/${params.id}`)).data
      let sections = []

      const getSections = (sections, tokens) => {
        if (tokens.length === 0) return
        sections.push({ tokens: tokens.splice(0, 100) })
        return getSections(sections, tokens)
      }

      getSections(sections, lesson.tokens)

      lesson.sections = sections

      const studyItems = (await axios.get(`${process.env.API_URL}/study/`)).data.items

      const statusReport = (await axios.get(`${process.env.API_URL}/word/status-report`)).data
      const wordsKnownCount = statusReport.known.count
      return {
        lesson,
        studyItems,
        wordsKnownCount,
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
    showFinnishButtom: false,
  }),
  watch: {
    mouseIsDown: async function () {
      if (!this.mouseIsDown && window.getSelection().toString()) {
        const phraseSelected = this.getPhraseSelected()
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

      //update all same words on section with the same status
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
    redirectToLessons() {
      location.href = location.href.replace(/lesson\/.*/g, 'lesson')
    },
    async updateNewWordsToKnown(end, $forward) {
      if (
        this.wordsKnownCount === 0 &&
        $forward === 1 &&
        !(await this.$refs.confirm.open(
          'Confirmar',
          'Ao mudar de seção todas as palavras em azul serão consideradas palavras conhecidas.',
          { color: 'red' }
        ))
      ) {
        const prevButton = document.querySelector('.v-window__prev button')
        prevButton.click()
        return
      }

      //Delay to show finalizar buttom
      if ($forward && this.lesson.sections.length - 1 === this.window) {
        setTimeout(() => {
          this.showFinnishButtom = true
        }, 200)
      } else {
        this.showFinnishButtom = false
      }

      let section
      if (!end) {
        section = this.lesson.sections[this.window - 1]
          ? this.lesson.sections[this.window - 1]
          : this.lesson.sections[this.window]
      } else {
        section = this.lesson.sections[this.window]
      }

      const wordsToChangedInSection = section.tokens.filter((token) => {
        if (token.type === 'WORD' && token.status === wordStatusType.NEW) {
          token.status = wordStatusType.KNOWN
          return token
        }
      })

      if (wordsToChangedInSection.length > 0) {
        await axios.post(`${process.env.API_URL}/word`, {
          words: wordsToChangedInSection,
        })
      }
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
      // se é status é NEW não existe palara no armazenada ainda
      if (this.wordTapped.status === wordStatusType.NEW) {
        this.wordTapped.status = wordStatusType.KNOWN
        await axios.post(`${process.env.API_URL}/word`, {
          words: [this.wordTapped],
        })
        this.$eventBus.$emit('wordStatusUpdated', {
          word: this.wordTapped.text,
          newStatus: wordStatusType.KNOWN,
        })
        return
      }
      this.wordTapped.status = wordStatusType.KNOWN

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
      if (!this.selectionRangeStart && !this.currentHoveredElement) {
        return null
      }

      var range = document.createRange()
      range.setStartBefore(this.selectionRangeStart)
      range.setEndAfter(this.currentHoveredElement.lastChild)
      var sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      return window.getSelection().toString()
    },
  },
}
</script>

<style scoped>
.space-right {
  margin-right: 4px !important;
}
.token {
  margin-left: -4px;
}
.new-word {
  background: rgb(175, 227, 241);
}
.learning-word {
  background: rgb(255, 229, 120);
}
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

::selection {
  /* background: none; */
  background: #318dff;
  border-color: green;
  border-radius: 2rem !important;
  outline: 8px ridge rgba(170, 50, 220, 0.6);
}
</style>
