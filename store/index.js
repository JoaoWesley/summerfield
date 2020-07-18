import * as apiService from '../services/apiService'

export const state = () => ({
  statusReport: { known: {} },
  dialogCreateLesson: false,
})

export const actions = {
  async fetchStatusReport({ commit }) {
    const statusReport = await apiService.getWordsStatusReport()
    console.log('retorno do status report', statusReport)
    commit('setStatusReport', statusReport)
  },
  setDialogCreateLesson({ commit }, newState) {
    commit('setDialogCreateLesson', newState)
  },

  async nuxtServerInit({ dispatch }, { route }) {
    if (route.path !== '/') {
      await dispatch('fetchStatusReport')
    }
  },
}

export const mutations = {
  setStatusReport(state, statusReport) {
    state.statusReport = statusReport
  },
  setDialogCreateLesson(state, newState) {
    state.dialogCreateLesson = newState
  },
}

export const getters = {
  getStatusReport(state) {
    return state.statusReport
  },
  getDialogCreateLesson(state) {
    return state.dialogCreateLesson
  },
}
