let axios
export function setClient(Axios) {
  axios = Axios
}

/**
 * Lesson endpoints
 */
export const getLessons = async () => {
  const lessons = (await axios.get(`/lesson/`)).data
  const imgs = []
  imgs.push(
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1909&q=80'
  )
  imgs.push(
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
  )
  imgs.push(
    'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
  )
  imgs.push('https://images.freeimages.com/images/large-previews/8d3/learn-1241297.jpg')
  lessons.forEach((element) => {
    element.img = imgs[Math.floor(Math.random() * 4)]
  })
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
  // return {
  //   learning: {
  //     count: 0,
  //     words: [],
  //   },
  //   known: {
  //     count: 365,
  //     words: [
  //       {
  //         text: 'a',
  //         status: 'KNOWN',
  //       },
  //     ],
  //   },
  // }
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

export const sendResetPasswordEmail = async (user) => {
  return (await axios.post(`/email/send-reset-password-email`, user)).data
}

export const resetPassword = async (user) => {
  return (await axios.put(`/auth/reset-password/`, user)).data
}
