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
  wordPhraseHasTranslation: {},
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
  setWordPhraseHasTranslation({ commit }, wordPhraseHasTranslation) {
    commit('setWordPhraseHasTranslation', wordPhraseHasTranslation)
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
    dispatch('setWordPhraseHasTranslation', { translation: study.translation })
  },
  async createStudyItem({ dispatch, state }, study) {        
    await axios.post(`${process.env.API_URL}/study`, study)
    this.$eventBus.$emit('showSavedForStudySnackbarEvent')    
    dispatch('addStudyItem', study)
    dispatch('setWordPhraseTranslations', [study.translation])
    dispatch('updateWordTappedStatusToLearning')
    dispatch('setWordPhraseHasTranslation', { translation: study.translation })
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
  },
  async translateWordTapped({ dispatch, state }) {
    const wordTranslatedAlready = state.studyItems.filter(
      (item) => item.wordPhrase.toLowerCase() === state.wordTapped.text.toLowerCase()
    )

    if (wordTranslatedAlready.length > 0) {
      dispatch('setWordPhraseHasTranslation', 
        { translation: wordTranslatedAlready.pop().translation }
      )
      dispatch('setWordPhraseTranslations', [
        state.wordPhraseHasTranslation.translation,
      ])
      return
    }

    dispatch('setWordPhraseHasTranslation', {translation: ''})
    //chmar api que vai retornar traducão da palavra
    dispatch('setWordPhraseTranslations', ['Linguagem', 'Lingua', 'Idioma'])
  },
  async translatePhraseSelected( {dispatch, state}) {
    const phraseTranslatedAlready = state.studyItems.filter(
      (item) => item.wordPhrase.toLowerCase() === state.phraseSelected.toLowerCase()
    )

    if (phraseTranslatedAlready.length > 0) {        
      dispatch('setWordPhraseTranslations', [
        phraseTranslatedAlready.pop().translation,
      ])
      return
    }
    //chamar api que vai retornar traducão da frase
    dispatch('setWordPhraseTranslations', ['A traducão da frase'])
  },
  async updateWordTappedStatusToKnown( {dispatch, state} ) {
    if (state.wordTapped.status === wordStatusType.NEW) {
      await axios.post(`${process.env.API_URL}/word`, {
        words: [{text: state.wordTapped.text, status: wordStatusType.KNOWN}],
      })
    } else {
      // Palvra já existe atualiza mandando PUT
      await axios.put(`${process.env.API_URL}/word`, {
        word: {text: state.wordTapped.text, status: wordStatusType.KNOWN}
      })
    }

    dispatch('updateWordStatusInSection', {text: state.wordTapped.text, status: wordStatusType.KNOWN})
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
    //Atualiza status somente de palavras
    if(word.text) {
      state.sectionTokens.forEach((token) => {
        if (token.text.toLowerCase() === word.text.toLowerCase()) {
          token.status = word.status
        }
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
