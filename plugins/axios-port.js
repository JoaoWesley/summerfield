import { setClient } from '~/services/apiService'

export default ({ app }) => {
  setClient(
    app.$axios.create({
      withCredentials: true,
      baseURL: process.env.API_URL,
    })
  )
}
