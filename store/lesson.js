import axios from 'axios'
import wordStatusType from '@/commons/wordStatusType'

export const state = () => ({
  lesson: {},
  studyItems: [],
  sectionTokens: [],
  wordTapped: {},
  wordPhraseTranslations: [],
  phraseSelected: '',
  modalDialogCreateTranslation: false,
  wordHasTranslation: {},
  window: 0,
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
  setWordHasTranslation({ commit }, wordHasTranslation) {
    commit('setWordHasTranslation', wordHasTranslation)
  },
  setWindow({ commit }, window) {
    commit('setWindow', window)
  },
  setModalDialogCreateTranslation({ commit }, modalDialogCreateTranslation) {
    commit('setModalDialogCreateTranslation', modalDialogCreateTranslation)
  },
  // 
  async updateStudyItemTranslation( { dispatch }, study) {
    await axios.put(`${process.env.API_URL}/study`, study)
    dispatch('addStudyItem', study)     
    dispatch('setWordPhraseTranslations', [study.translation])    
    dispatch('updateWordTappedStatusToLearning')
  },
  async createStudyItem({ dispatch }, study) {        
    await axios.post(`${process.env.API_URL}/study`, study)
    this.$eventBus.$emit('showSavedForStudySnackbarEvent')    
    dispatch('addStudyItem', study)
    dispatch('setWordPhraseTranslations', [study.translation])
    dispatch('updateWordTappedStatusToLearning')
  },
  async updateWordTappedStatusToLearning({ dispatch, state }) {    
    //If word tapped is new create it 
    if(state.wordTapped.status === wordStatusType.NEW) {      
      dispatch('updateWordStatusInSection', { text: state.wordTapped.text, status: wordStatusType.LEARNING })
      await axios.post(`${process.env.API_URL}/word`, {
        words: [state.wordTapped],
      })
      return;
    }    
    //If word tapped exists update it status
    dispatch('updateWordStatusInSection', { text: state.wordTapped.text, status: wordStatusType.LEARNING }) 
    await axios.put(`${process.env.API_URL}/word`, {
      word:state.wordTapped,
    })
  }
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
  updateWordStatusInSection(state, word) {
    state.sectionTokens.forEach((token) => {
      if (token.text.toLowerCase() === word.text.toLowerCase()) {
        token.status = word.status
      }
    })
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
  setWordHasTranslation(state, wordHasTranslation) {
    state.wordHasTranslation = wordHasTranslation
  },
  setWindow(state, window) {
    state.window = window
  },
  setModalDialogCreateTranslation(state, modalDialogCreateTranslation) {
    state.modalDialogCreateTranslation = modalDialogCreateTranslation
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
  getWordHasTranslation(state) {
    return state.wordHasTranslation
  },
  getWindow(state) {
    return state.window
  },
  getModalDialogCreateTranslation(state) {
    return state.modalDialogCreateTranslation
  },
}
