import axios from 'axios'

export const state = () => ({
  lesson: {},
  studyItems: [],
  sectionTokens: [],
  wordTapped: {},
  wordPhraseTranslations: [],
  phraseSelected: '',
  // modalDialogCreateTranslation: false,
  wordAlreadyTranslated: {},
})

export const actions = {
  async fetchLesson({ commit }, lessonId) {
    const lesson = (await axios.get(`${process.env.API_URL}/lesson/${lessonId}`)).data
    let sections = []

    const getSections = (sections, tokens) => {
      if (tokens.length === 0) return
      sections.push({ tokens: tokens.splice(0, 100) })
      return getSections(sections, tokens)
    }

    getSections(sections, lesson.tokens)
    lesson.sections = sections
    commit('setLesson', lesson)
  },
  async fetchStudyItems({ commit }) {
    const studyItems = (await axios.get(`${process.env.API_URL}/study/`)).data.items
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
  setWordAlreadyTranslated({ commit }, wordAlreadyTranslated) {
    commit('setWordAlreadyTranslated', wordAlreadyTranslated)
  },
}

export const mutations = {
  setLesson(state, lesson) {
    state.lesson = lesson
  },
  setStudyItems(state, studyItems) {
    state.studyItems = studyItems
  },
  setSectionTokens(state, sectionTokens) {
    state.sectionTokens = sectionTokens
  },
  updateWordStatusInSection(state, message) {
    state.sectionTokens.forEach((token) => {
      if (token.text.toLowerCase() === message.word.toLowerCase()) {
        token.status = message.newStatus
      }
    })
  },
  addStudyItem(state, studyItem) {
    state.studyItems.push(studyItem)
    //state.sectionTokens = sectionTokens;
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
  setWordAlreadyTranslated(state, wordAlreadyTranslated) {
    state.wordAlreadyTranslated = wordAlreadyTranslated
  },
}

export const getters = {
  getLesson(state) {
    return state.lesson
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
  getWordAlreadyTranslated(state) {
    return state.wordAlreadyTranslated
  },
}
