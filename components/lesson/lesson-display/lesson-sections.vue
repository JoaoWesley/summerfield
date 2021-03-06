<template>
  <v-card
    style="width: 68%; margin-right: 2%;"
    raised
    shaped
    outlined
    @contextmenu="show($event, lesson)"
  >
    <audio-player v-if="lesson.audioUrl">
      <source :src="lesson.audioUrl" />
    </audio-player>

    <v-menu
      v-if="menuItems.length > 0"
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list rounded>
        <v-list-item
          v-for="(menuItem, index) in menuItems"
          :key="index"
          @click="menuOptionSelected(menuItem)"
        >
          <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-window
      v-model="window"
      class="elevation-1 $window-controls-top"
      :vertical="false"
      :show-arrows="true"
      :reverse="false"
      style="height: 100%;"
      @change="
        updateNewWordsInSectionToKnown(false, $event)
        showEndOfSectionButtons = false
      "
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
                  <v-avatar color="grey" class="mr-4">
                    <img :src="lesson.imageUrl" alt="John" />
                  </v-avatar>
                  <strong class="title">{{ lesson.title }}</strong>
                  <v-spacer />
                </v-row>
                <p>
                  <slot v-for="(token, index) in section.tokens">
                    <span
                      v-if="index !== 0 || token.text !== '<br/><br/>'"
                      :key="token.text + index"
                      class="title font-weight-light"
                      style="color: black;"
                      :class="{
                        word: token.type === 'WORD',
                        'new-word': token.status === 'NEW' && token.type === 'WORD',
                        'learning-word': token.status === 'LEARNING' && token.type === 'WORD',
                        'token-spacing':
                          section.tokens[index - 1] &&
                          section.tokens[index - 1].status === 'KNOWN' &&
                          token.type === 'PUNCTUATION',
                      }"
                      @mouseover="setSelectionRangeStart($event)"
                      @click="translateWord(token, section.tokens)"
                      v-html="sanitizeTokenText(token)"
                    ></span>

                    <slot
                      v-if="
                        section.tokens[index + 1] &&
                        !notSpacebalePunctuations.includes(section.tokens[index].text) &&
                        section.tokens[index + 1].type !== 'PUNCTUATION'
                      "
                    >
                      &nbsp;
                    </slot>
                  </slot>
                </p>

                <div v-if="isLastSection && showEndOfSectionButtons">
                  <v-card class="d-flex flex-row-reverse" flat tile>
                    <v-chip
                      class="ma-2"
                      color="indigo"
                      text-color="white"
                      :input-value="true"
                      label
                      @click="
                        updateNewWordsInSectionToKnown(true, true)
                        redirectToLessons()
                      "
                    >
                      FINALIZAR
                    </v-chip>
                    <v-chip
                      v-if="!islastTopic && lesson.index != undefined && showEndOfSectionButtons"
                      class="ma-2"
                      color="indigo"
                      text-color="white"
                      :input-value="true"
                      label
                      @click="
                        updateNewWordsInSectionToKnown(true, true)
                        redirectToNextTopic()
                      "
                    >
                      PRÓXIMO
                    </v-chip>
                  </v-card>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
      </v-window-item>
    </v-window>
    <ConfirmModal ref="confirm" />
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as apiService from '@/services/apiService'
import * as sectionsStorageService from '@/services/sectionsStorageService'
import ConfirmModal from '@/components/confirm-modal'
import axios from 'axios'
import * as googleStorageApiService from '@/services/googleStorageApiService'
import { audioPlayer } from 'vue-md-player'
import 'vue-md-player/dist/vue-md-player.css'

export default {
  components: {
    ConfirmModal,
    audioPlayer,
  },
  data: () => ({
    showFinnishButtom: false,
    selectionRangeStart: null,
    currentHoveredElement: null,
    mouseIsDown: false,
    notSpacebalePunctuations: ['<br/><br/>', '"', '“', "'"],
    lastWindowBeforeChange: 0,
    showEndOfSectionButtons: false,

    rounded: true,
    lessonClicked: null,
    showMenu: false,
    x: 0,
    y: 0,
  }),
  computed: {
    ...mapGetters({
      lesson: 'lesson/getLesson',
      lessonTopics: 'lesson/getLessonTopics',
      studyItems: 'lesson/getStudyItems',
      sectionTokens: 'lesson/getSectionTokens',
      wordPhraseHasTranslation: 'lesson/getWordPhraseHasTranslation',
      getWindow: 'lesson/getWindow',
      getStatusReport: 'getStatusReport',
      lessonId: 'lesson/getLessonId',
    }),
    menuItems: function () {
      if (this.$route.query.shared) {
        if (this.lesson.index !== undefined) {
          //Se é topico
          return []
        }
        return [{ title: 'Revisar', id: 'review' }]
      }

      if (this.lesson.index !== undefined) {
        // Se é topico
        return [
          { title: 'Editar', id: 'edit' },
          { title: 'Deletar', id: 'delete' },
        ]
      }

      return [
        { title: 'Editar', id: 'edit' },
        { title: 'Deletar', id: 'delete' },
        { title: 'Revisar', id: 'review' },
      ]
    },
    wordsKnownCount() {
      return this.getStatusReport.known.count
    },
    window: {
      set(value) {
        this.setWindow({ window: value, topicLessonId: this.lessonId })
      },
      get() {
        return this.getWindow
      },
    },
    islastTopic() {
      if (this.lesson.index !== undefined) {
        if (this.lessonTopics[this.lessonTopics.length - 1].index === this.lesson.index) {
          this.showEndOfSectionsButtons()
          return true
        }
      }
      return false
    },
    isLastSection() {
      if (this.lesson.sections.length - 1 === this.window) {
        this.showEndOfSectionsButtons()
        return true
      }
      return false
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

  mounted() {
    if (this.lesson._id && localStorage.getItem('lessonsSectionsState')) {
      const sectionState = sectionsStorageService.getLessonSectionsState(this.lesson)
      if (sectionState) {
        this.setWindow({ window: sectionState.window })
      }
    } else if (this.lesson.index !== undefined && localStorage.getItem('topicsSectionsState')) {
      const sectionState = sectionsStorageService.getTopicSectionsState(this.lesson, this.lessonId)
      if (sectionState) {
        this.setWindow({ window: sectionState.window })
      }
    }
    this.lastWindowBeforeChange = this.window
  },

  methods: {
    ...mapActions({
      changeAllNewWordsInSectionToKnown: 'lesson/changeAllNewWordsInSectionToKnown',
      setWindow: 'lesson/setWindow',
      setPhraseSelected: 'lesson/setPhraseSelected',
      setWordTapped: 'lesson/setWordTapped',
      setSectionTokens: 'lesson/setSectionTokens',
      translateWordTapped: 'lesson/translateWordTapped',
      translatePhraseSelected: 'lesson/translatePhraseSelected',
      fetchStatusReport: 'fetchStatusReport',
    }),
    redirectToLessons() {
      const isTopic = this.lesson.index !== undefined
      if (isTopic) {
        location.href = `${process.env.BASE_URL}/lesson/${this.lessonId}/topic`
        return
      }
      location.href = `${process.env.BASE_URL}/lesson`
    },

    redirectToNextTopic() {
      const isTopic = this.lesson.index !== undefined
      if (isTopic) {
        const nextTopic = this.lessonTopics.find((topic) => topic.index > this.lesson.index)
        if (nextTopic) {
          location.href = `${process.env.BASE_URL}/lesson/${this.lessonId}/topic/${nextTopic.index}`
          sectionsStorageService.setLastUsedTopic(this.lessonId, nextTopic.index)
        }
        return
      }
    },

    async updateNewWordsInSectionToKnown(endOfSection) {
      const movingForward = this.window > this.lastWindowBeforeChange
      const finishOrNextTopicButtonPressed = this.window === this.lastWindowBeforeChange
      if (!movingForward && !finishOrNextTopicButtonPressed) {
        return
      }

      if (
        this.wordsKnownCount === 0 && //Se é usuário é novo não tem nenhuma palavra salva
        movingForward && // se está movendo para frente na seção
        !(await this.$refs.confirm.open(
          // se não confirmar mudança volta para section anterior
          'Confirmar',
          'Ao mudar de seção todas as palavras em azul serão consideradas palavras conhecidas.',
          { color: 'red' }
        ))
      ) {
        const prevButton = document.querySelector('.v-window__prev button')
        prevButton.click()
        return
      }

      const getCurrentSection = () => {
        if (!endOfSection) {
          return this.lesson.sections[this.window - 1]
        } else {
          return this.lesson.sections[this.window]
        }
      }
      const section = getCurrentSection()
      await this.changeAllNewWordsInSectionToKnown(section.tokens)
      this.fetchStatusReport()
      this.lastWindowBeforeChange = this.window
    },

    async translateWord(token, sectionTokens) {
      if (token.type !== 'WORD') {
        return
      }
      this.setPhraseSelected('')
      this.setWordTapped(token)
      this.setSectionTokens(sectionTokens)
      await this.translateWordTapped()
    },

    async translatePhrase(phrase) {
      this.setWordTapped({})
      this.setPhraseSelected(phrase)
      await this.translatePhraseSelected()
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
      const trimmedPhrase = await apiService.trimPhrase(phrase)
      return trimmedPhrase
    },

    sanitizeTokenText(token) {
      return this.$sanitize(token.text)
    },

    showEndOfSectionsButtons() {
      setTimeout(() => {
        this.showEndOfSectionButtons = true
      }, 160)
    },

    show(e, lesson) {
      lesson.lessonId = this.lessonId
      this.lessonClicked = lesson
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    },

    async menuOptionSelected(menuItem) {
      if (menuItem.id === 'edit') {
        this.$eventBus.$emit('editLesson', { ...this.lessonClicked })
      }

      if (menuItem.id === 'delete') {
        if (this.lessonClicked.audioUrl) {
          googleStorageApiService.deleteObjectOnLessonAudioBucket(this.lessonClicked.audioUrl)
        }

        if (this.lesson.index !== undefined) {
          await axios.delete(
            `${process.env.API_URL}/lesson/${this.lessonId}/lesson-topics?topicId=${this.lessonClicked.index}`,
            { withCredentials: true }
          )
          location.href = `${process.env.BASE_URL}/lesson/${this.lessonId}/topic`
          return
        }
        await apiService.deleteLessonById(this.lessonClicked._id)
        location.href = `${process.env.BASE_URL}/lesson?lessonId=${this.lessonClicked._id}`
      }

      if (menuItem.id === 'review') {
        location.href = `${process.env.BASE_URL}/review?lessonId=${this.lessonClicked._id}`
      }
    },
  },
}
</script>
<style scoped>
.space-right {
  margin-right: 4px !important;
}
.token-spacing {
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
