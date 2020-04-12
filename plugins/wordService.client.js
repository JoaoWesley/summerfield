import axios from 'axios'

export const saveWordToStudy = async (wordPhrase, translation) => {
  await axios.post(`${process.env.API_URL}/study`, { wordPhrase, translation })
}
export default ({ app }, inject) => {
  inject('wordService', { saveWordToStudy })
}
