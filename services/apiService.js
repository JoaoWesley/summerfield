let axios
export function setClient(Axios) {
  axios = Axios
}

/**
 * Lesson endpoints
 */
export const getLessons = async (query) => {
  let lessons
  if (query.shared) {
    lessons = (await axios.get(`/lesson/?shared=true`)).data
  } else {
    lessons = (await axios.get(`/lesson/`)).data
  }
  return lessons
}
export const getLessonById = async (lessonId) => {
  const lesson = (await axios.get(`/lesson/${lessonId}`)).data
  return lesson
}
export const postLesson = async (lesson) => {
  return (await axios.post(`/lesson`, lesson)).data
}
export const updateLesson = (lesson) => {
  return axios.put(`/lesson/`, lesson)
}
export const deleteLessonById = (lessonId) => {
  return axios.delete(`/lesson/${lessonId}`)
}

/**
 * Lesson topic endpoints
 */
export const getLessonTopics = async (lessonId) => {
  return (await axios.get(`/lesson/${lessonId}/lesson-topics/`)).data
}
export const getLessonTopicByid = async ({ lessonId, topicId }) => {
  const lesson = (await axios.get(`/lesson/${lessonId}/lesson-topics?&topicId=${topicId}`)).data
    .topics
  return lesson
}
export const updateLessonTopic = (lessonId, lessonTopic) => {
  return axios.put(`/lesson/${lessonId}/lesson-topics`, lessonTopic)
}

/**
 * Study endpoints
 */
export const getStudyItems = async () => {
  const studyItems = (await axios.get(`/study/item`)).data.items
  return studyItems
}
export const updateStudyItem = (item) => {
  return axios.put(`/study/item`, item)
}
export const createStudyItem = (item) => {
  return axios.post(`/study/item`, item)
}
export const trimPhrase = async (phrase) => {
  return (await axios.get(`/study/trim-phrase/${phrase}`)).data.phrase
}
export const getStudyItemsToReview = async () => {
  return (await axios.get(`/study/review/`)).data
}
export const getStudyItemsToReviewByLessonId = async (lessonId) => {
  return (await axios.get(`/study/review/?lessonId=${lessonId}`)).data
}
export const evaluateStudyItem = async (item) => {
  return (await axios.post(`/study/evaluate/`, item)).data
}
export const getPopularTranslation = async (wordPhrase, lessonId, topicId, sectionId) => {
  return (
    await axios.get(
      `/study/popular-translation/?wordPhrase=${wordPhrase}&lessonId=${lessonId}&topicId=${topicId}&sectionId=${sectionId}`
    )
  ).data
}
export const createPopularTranslation = async (translation) => {
  return (await axios.post(`/study/popular-translation/`, translation)).data
}

export const getTranslation = async (text) => {
  return (await axios.get(`/study/translation/?text=${text}`)).data
}

/**
 * Word endpoints
 */
export const postWords = (words) => {
  return axios.post(`/word`, {
    words,
  })
}
export const updateWord = (word) => {
  return axios.put(`/word`, {
    word,
  })
}
export const getWordsStatusReport = async () => {
  return (await axios.get(`/word/status-report`)).data
}

/**
 * Auth endpoints
 */
export const login = async (user) => {
  return (await axios.post(`/auth/login`, user)).data
}

export const register = async (user) => {
  return (await axios.post(`/auth/register`, user)).data
}

export const logout = async () => {
  return (await axios.post(`/auth/logout`)).data
}

export const sendResetPasswordEmail = async (user) => {
  return (await axios.post(`/email/send-reset-password-email`, user)).data
}

export const resetPassword = async (user) => {
  return (await axios.put(`/auth/reset-password/`, user)).data
}

/**
 * Feedback endpoint
 */

export const postFeedback = async (feedback) => {
  return (await axios.post(`/feedback/`, feedback)).data
}
