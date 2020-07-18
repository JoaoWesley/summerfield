import * as apiService from '../services/apiService'

export const state = () => ({
  statusReport: {},
  dialogCreateLesson: false,
})

export const actions = {
  async fetchStatusReport ({ commit }) {
    const statusReport = await apiService.getWordsStatusReport()
    commit('setStatusReport', statusReport)
  },
  setDialogCreateLesson ({ commit }, newState) {
    commit('setDialogCreateLesson', newState)
  },

  async nuxtClientInit ({ dispatch }, { route }) {
    if (route.path !== '/') {
      await dispatch('fetchStatusReport')
    }
  },

  async nuxtServerInit ({ dispatch }, { route }) {
    // console.log('asas', process.server)
    // if (route.path !== '/') {
    //   await dispatch('fetchStatusReport')
    // }
  },
}

export const mutations = {
  setStatusReport (state, statusReport) {
    state.statusReport = statusReport
  },
  setDialogCreateLesson (state, newState) {
    state.dialogCreateLesson = newState
  },
}

export const getters = {
  getStatusReport (state) {
    return state.statusReport
  },
  getDialogCreateLesson (state) {
    return state.dialogCreateLesson
  },
}
