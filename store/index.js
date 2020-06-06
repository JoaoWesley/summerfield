import * as apiService from '../services/apiService'

export const state = () => ({
  statusReport: {},
})

export const actions = {
  async fetchStatusReport({ commit }) {    
    const statusReport = await apiService.getWordsStatusReport()
    commit('setStatusReport', statusReport)
  },
}

export const mutations = {
  setStatusReport(state, statusReport) {
    state.statusReport = statusReport
  },
}

export const getters = {
  getStatusReport(state) {
    return state.statusReport
  },
}
