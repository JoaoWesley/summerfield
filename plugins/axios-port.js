import { setClient } from '~/services/apiService'

export default ({ app }) => {
  setClient(
    app.$axios.create({
      withCredentials: true,
      //baseURL: API_SERVER,
    })
  )
}
