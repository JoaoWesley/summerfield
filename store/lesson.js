import wordStatusType from '@/commons/wordStatusType'
import * as apiService from '@/services/apiService'
import * as sectionsStorageService from '@/services/sectionsStorageService'

export const state = () => ({
  lesson: {},
  lessonTopics: [],
  studyItems: [],
  sectionTokens: [],
  wordTapped: {},
  wordPhraseTranslations: [],
  phraseSelected: '',
  modalDialogCreateTranslation: false,
  wordPhraseHasTranslation: {},
  window: 0,
})

export const actions = {
  async fetchLesson({ commit }, lessonId) {
    const lesson = await apiService.getLessonById(lessonId)
    let sections = []
    let sectionMaxLength = 100 //Default size
    const sectionStart = 0
    let sectionEnd = sectionMaxLength
    let spacerValue = 7 // Definindo quantos tokens vale cada <br/><br/>

    const getSections = (sections, tokens) => {
      if (tokens.length === 0) return
      let sectionLenghtWithSpacer
      sectionEnd = sectionMaxLength
      do {
        const sectionTokens = tokens.slice(sectionStart, sectionEnd)
        const numberOfSpacer = sectionTokens.filter((token) => token.text === '<br/><br/>')
        let spacersLength = numberOfSpacer.length * spacerValue
        sectionLenghtWithSpacer = spacersLength + sectionTokens.length
        sectionEnd--
      } while (sectionLenghtWithSpacer > sectionMaxLength)

      sections.push({ tokens: tokens.splice(sectionStart, sectionEnd) })
      return getSections(sections, tokens)
    }
    getSections(sections, lesson.tokens)
    lesson.sections = sections
    commit('setLesson', lesson)
  },

  async fetchLessonTopics({ commit }, lessonId) {
    const topics = await apiService.getLessonTopics(lessonId)
    const imgs = []
    imgs.push(
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1909&q=80'
    )
    imgs.push(
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
    )
    imgs.push(
      'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
    )
    imgs.push('https://images.freeimages.com/images/large-previews/8d3/learn-1241297.jpg')

    topics.forEach((element) => {
      element.img = imgs[Math.floor(Math.random() * 4)]
    })
    commit('setLessonTopics', topics)
  },

  async fetchLessonTopic({ commit }, { lessonId, topicId }) {
    const lesson = await apiService.getLessonTopicByid({ lessonId, topicId })
    let sections = []
    let sectionMaxLength = 100 //Default size
    const sectionStart = 0
    let sectionEnd = sectionMaxLength
    let spacerValue = 7 // Definindo quantos tokens vale cada <br/><br/>

    const getSections = (sections, tokens) => {
      if (tokens.length === 0) return
      let sectionLenghtWithSpacer
      sectionEnd = sectionMaxLength
      do {
        const sectionTokens = tokens.slice(sectionStart, sectionEnd)
        const numberOfSpacer = sectionTokens.filter((token) => token.text === '<br/><br/>')
        let spacersLength = numberOfSpacer.length * spacerValue
        sectionLenghtWithSpacer = spacersLength + sectionTokens.length
        sectionEnd--
      } while (sectionLenghtWithSpacer > sectionMaxLength)

      sections.push({ tokens: tokens.splice(sectionStart, sectionEnd) })
      return getSections(sections, tokens)
    }
    getSections(sections, lesson.tokens)
    lesson.sections = sections
    commit('setLesson', lesson)
  },

  async fetchStudyItems({ commit }) {
    const studyItems = await apiService.getStudyItems()
    commit('setStudyItems', studyItems)
  },
  setSectionTokens({ commit }, sectionTokens) {
    commit('setSectionTokens', sectionTokens)
  },
  //Isso deve mudar para atualizar todas as sections
  updateWordStatusInSection({ commit }, word) {
    commit('updateWordStatusInSection', word)
  },
  addStudyItem({ commit }, studyItem) {
    commit('addStudyItem', studyItem)
  },
  setWordTapped({ commit }, wordTapped) {
    commit('setWordTapped', wordTapped)
  },
  setWordPhraseTranslations({ commit }, wordPhraseTranslation) {
    commit('setWordPhraseTranslations', wordPhraseTranslation)
  },
  setPhraseSelected({ commit }, phraseSelected) {
    commit('setPhraseSelected', phraseSelected)
  },
  setWordPhraseHasTranslation({ commit }, wordPhraseHasTranslation) {
    commit('setWordPhraseHasTranslation', wordPhraseHasTranslation)
  },
  setWindow({ commit }, window) {
    commit('setWindow', window)
  },
  setModalDialogCreateTranslation({ commit }, newState) {
    commit('setModalDialogCreateTranslation', newState)
  },
  //
  async updateStudyItemTranslation({ dispatch }, study) {
    await apiService.updateStudyItem(study)
    dispatch('addStudyItem', study)
    dispatch('setWordPhraseTranslations', [study.translation])
    dispatch('updateWordTappedStatusToLearning')
    dispatch('setWordPhraseHasTranslation', { translation: study.translation })
  },
  async createStudyItem({ dispatch }, study) {
    await apiService.createStudyItem(study)
    this.$eventBus.$emit('showSavedForStudySnackbarEvent')
    dispatch('addStudyItem', study)
    dispatch('setWordPhraseTranslations', [study.translation])
    dispatch('updateWordTappedStatusToLearning')
    dispatch('setWordPhraseHasTranslation', { translation: study.translation })
  },
  async updateWordTappedStatusToLearning({ dispatch, state }) {
    //If word tapped is new create it
    if (state.wordTapped.status === wordStatusType.NEW) {
      dispatch('updateWordStatusInSection', {
        text: state.wordTapped.text,
        status: wordStatusType.LEARNING,
      })
      await apiService.postWords([state.wordTapped])
      return
    }
    //If word tapped exists update it status
    dispatch('updateWordStatusInSection', {
      text: state.wordTapped.text,
      status: wordStatusType.LEARNING,
    })
    await apiService.updateWord(state.wordTapped)
  },
  async translateWordTapped({ dispatch, state }) {
    const wordTranslatedAlready = state.studyItems.filter(
      (item) => item.wordPhrase.toLowerCase() === state.wordTapped.text.toLowerCase()
    )

    if (wordTranslatedAlready.length > 0) {
      dispatch('setWordPhraseHasTranslation', {
        translation: wordTranslatedAlready.pop().translation,
      })
      dispatch('setWordPhraseTranslations', [state.wordPhraseHasTranslation.translation])
      return
    }

    dispatch('setWordPhraseHasTranslation', { translation: '' })
    //chamar api que vai retornar traducão da palavra
    dispatch('setWordPhraseTranslations', ['Linguagem', 'Lingua', 'Idioma'])
  },
  async translatePhraseSelected({ dispatch, state }) {
    const phraseTranslatedAlready = state.studyItems.filter(
      (item) => item.wordPhrase.toLowerCase() === state.phraseSelected.toLowerCase()
    )

    if (phraseTranslatedAlready.length > 0) {
      dispatch('setWordPhraseTranslations', [phraseTranslatedAlready.pop().translation])
      return
    }
    //chamar api que vai retornar traducão da frase
    dispatch('setWordPhraseTranslations', ['A traducão da frase'])
  },
  async updateWordTappedStatusToKnown({ dispatch, state }) {
    if (state.wordTapped.status === wordStatusType.NEW) {
      await apiService.postWords([{ text: state.wordTapped.text, status: wordStatusType.KNOWN }])
    } else {
      await apiService.updateWord({ text: state.wordTapped.text, status: wordStatusType.KNOWN })
    }

    dispatch('updateWordStatusInSection', {
      text: state.wordTapped.text,
      status: wordStatusType.KNOWN,
    })
  },
  async showOtherTranslations({ dispatch, state }) {
    //chamar api para buscar outras traduções.
    dispatch('setWordPhraseTranslations', [
      ...state.wordPhraseTranslations,
      'Another Translation',
      'Mais uma Translation',
    ])
  },
  async changeAllNewWordsInSectionToKnown({ commit }, sectionTokens) {
    commit('setSectionTokens', sectionTokens)
    commit('changeAllNewWordsInSectionToKnown')
  },
}

export const mutations = {
  setLesson(state, lesson) {
    state.lesson = lesson
  },
  setLessonTopics(state, lessonTopics) {
    state.lessonTopics = lessonTopics
  },
  setStudyItems(state, studyItems) {
    state.studyItems = studyItems
  },
  setSectionTokens(state, sectionTokens) {
    state.sectionTokens = sectionTokens
  },
  updateWordStatusInSection(state, word) {
    //Atualiza status somente de palavras
    if (word.text) {
      state.lesson.sections.forEach((section) => {
        section.tokens.forEach((token) => {
          if (token.text.toLowerCase() === word.text.toLowerCase()) {
            token.status = word.status
          }
        })
      })
    }
  },
  //Esse código só funciona porque adiciona no final do array aí quando filtra do outro lado pega a ultima tradução adicionada
  addStudyItem(state, studyItem) {
    state.studyItems.push(studyItem)
  },
  setWordTapped(state, wordTapped) {
    state.wordTapped = wordTapped
  },
  setWordPhraseTranslations(state, wordPhraseTranslation) {
    state.wordPhraseTranslations = wordPhraseTranslation
  },
  setPhraseSelected(state, phraseSelected) {
    state.phraseSelected = phraseSelected
  },
  setWordPhraseHasTranslation(state, wordPhraseHasTranslation) {
    state.wordPhraseHasTranslation = wordPhraseHasTranslation
  },
  setWindow(state, window) {
    state.window = window
    sectionsStorageService.storeSectionsState(state.lesson, window)
  },
  setModalDialogCreateTranslation(state, newState) {
    state.modalDialogCreateTranslation = newState
  },
  async changeAllNewWordsInSectionToKnown(state) {
    let wordsChangedInSection = state.sectionTokens.filter((token) => {
      if (token.type === 'WORD' && token.status === wordStatusType.NEW) {
        token.status = wordStatusType.KNOWN
        return token
      }
    })

    if (wordsChangedInSection.length > 0) {
      await apiService.postWords(wordsChangedInSection)
    }
  },
}

export const getters = {
  getLesson(state) {
    return state.lesson
  },
  getLessonTopics(state) {
    return state.lessonTopics
  },
  getStudyItems(state) {
    return state.studyItems
  },
  getSectionTokens(state) {
    return state.sectionTokens
  },
  getWordTapped(state) {
    return state.wordTapped
  },
  getWordPhraseTranslations(state) {
    return state.wordPhraseTranslations
  },
  getPhraseSelected(state) {
    return state.phraseSelected
  },
  getWordPhraseHasTranslation(state) {
    return state.wordPhraseHasTranslation
  },
  getWindow(state) {
    return state.window
  },
  getModalDialogCreateTranslation(state) {
    return state.modalDialogCreateTranslation
  },
}
