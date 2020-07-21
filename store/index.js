import * as apiService from '../services/apiService'
import authMiddleware from '../middleware/authMiddleware'

export const state = () => ({
  statusReport: { known: {} },
  dialogCreateLesson: false,
})

export const actions = {
  async fetchStatusReport({ commit }) {
    const statusReport = await apiService.getWordsStatusReport()
    commit('setStatusReport', statusReport)
  },
  setDialogCreateLesson({ commit }, newState) {
    commit('setDialogCreateLesson', newState)
  },

  async nuxtServerInit({ dispatch }, context) {
    if (context.route.path !== '/') {
      await authMiddleware(context)
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
