import * as apiService from '../services/apiService'

export const state = () => ({
  statusReport: {},
  dialogCreateLesson: false
})

export const actions = {
  async fetchStatusReport({ commit }) {    
    const statusReport = await apiService.getWordsStatusReport()
    commit('setStatusReport', statusReport)
  },
  setDialogCreateLesson({ commit }, newState) {
    commit('setDialogCreateLesson', newState)
  },
}

export const mutations = {
  setStatusReport(state, statusReport) {
    state.statusReport = statusReport
  },
  setDialogCreateLesson(state, newState) {
    state.dialogCreateLesson = newState
    console.log('abrindo modal', state.dialogCreateLesson)
  }
}

export const getters = {
  getStatusReport(state) {
    return state.statusReport
  },
  getDialogCreateLesson(state) {
    return state.dialogCreateLesson
  },
}
