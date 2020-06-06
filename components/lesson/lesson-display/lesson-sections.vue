<template>
  <v-card style="width: 68%; margin-right: 2%;" raised shaped outlined>
    <v-window
      v-model="window"
      class="elevation-1 $window-controls-top"
      :vertical="false"
      :show-arrows="true"
      :reverse="false"
      style="height: 100%;"
      @change="updateNewWordsToKnown(false, $event)"
    >
      <v-window-item
        v-for="(section, index1) in lesson.sections"
        :key="index1"
        style="height: 100%;"
        @mousedown="setMouseState(true)"
        @mouseup="setMouseState(false)"
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
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import wordStatusType from '@/commons/wordStatusType'

export default {
  data: () => ({
    showFinnishButtom: false,
    selectionRangeStart: null,
    currentHoveredElement: null,
    mouseIsDown: false,    
  }),
  computed: {
    ...mapGetters({
      lesson: 'lesson/getLesson',
      studyItems: 'lesson/getStudyItems',
      sectionTokens: 'lesson/getSectionTokens',
      wordPhraseHasTranslation: 'lesson/getWordPhraseHasTranslation',
    }),
    wordsKnownCount() {
      return this.$store.getters['getStatusReport'].known.count
    },
    window: {
      set(value) {
        this.$store.dispatch('lesson/setWindow', value)
      },
      get() {
        return this.$store.getters['lesson/getWindow']
      },
    },
  },

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

  methods: {
    redirectToLessons() {
      location.href = `${process.env.BASE_URL}/lesson`
    },
    async updateNewWordsToKnown(end, $forward) {
      //se tá clicando na seta para voltar não faz nada
      if ($forward === 0) {
        return
      }

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

      const wordsChangedInSection = section.tokens.filter((token) => {
        if (token.type === 'WORD' && token.status === wordStatusType.NEW) {
          token.status = wordStatusType.KNOWN
          return token
        }
      })

      if (wordsChangedInSection.length > 0) {
        await axios.post(`${process.env.API_URL}/word`, {
          words: wordsChangedInSection,
        })
      }
    },

    async translateWord(token, sectionTokens) {      
      this.$store.dispatch('lesson/setPhraseSelected', '')
      this.$store.dispatch('lesson/setWordTapped', token)    
      this.$store.dispatch('lesson/setSectionTokens', sectionTokens)
      await this.$store.dispatch('lesson/translateWordTapped')     
    },

    async translatePhrase(phrase) {
      this.$store.dispatch('lesson/setWordTapped', {})
      this.$store.dispatch('lesson/setPhraseSelected', phrase)
      await this.$store.dispatch('lesson/translatePhraseSelected')     
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
    setMouseState(state) {
      this.mouseIsDown = state
    },    

    async trimPhrase(phrase) {
      const trimmedPhrase = (
        await axios.post(`${process.env.API_URL}/study/trim-phrase`, {
          phrase: phrase,
        })
      ).data.phrase

      return trimmedPhrase
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
::selection {
  /* background: none; */
  background: #318dff;
  border-color: green;
  border-radius: 2rem !important;
  outline: 8px ridge rgba(170, 50, 220, 0.6);
}
</style>
