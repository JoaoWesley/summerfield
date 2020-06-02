import axios from 'axios'

export const state = () => ({
  statusReport: {},
})

export const actions = {
  async fetchStatusReport({ commit }) {
    const statusReport = (await axios.get(`${process.env.API_URL}/word/status-report`)).data
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
