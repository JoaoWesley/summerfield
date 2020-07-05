import axios from 'axios'

/**
 * Lesson endpoints
 */
export const getLessons = async () => {
  const lessons = (await axios.get(`${process.env.API_URL}/lesson/`)).data
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
  const lesson = (await axios.get(`${process.env.API_URL}/lesson/${lessonId}`)).data
  return lesson
}
export const postLesson = async (lesson) => {
  return (await axios.post(`${process.env.API_URL}/lesson`, lesson)).data
}
export const updateLesson = (lesson) => {
  return axios.put(`${process.env.API_URL}/lesson/`, lesson)
}
export const deleteLessonById = (lessonId) => {
  return axios.delete(`${process.env.API_URL}/lesson/${lessonId}`)
}

/**
 * Lesson topic endpoints
 */
export const getLessonTopics = async (lessonId) => {
  return (await axios.get(`${process.env.API_URL}/lesson/${lessonId}/lesson-topics/`)).data
}
export const getLessonTopicByid = async ({ lessonId, topicId }) => {
  const lesson = (
    await axios.get(`${process.env.API_URL}/lesson/${lessonId}/lesson-topics?&topicId=${topicId}`)
  ).data.topics
  return lesson
}
export const updateLessonTopic = (lessonId, lessonTopic) => {
  return axios.put(`${process.env.API_URL}/lesson/${lessonId}/lesson-topics`, lessonTopic)
}

/**
 * Study endpoints
 */
export const getStudyItems = async () => {
  const studyItems = (await axios.get(`${process.env.API_URL}/study/item`)).data.items
  return studyItems
}
export const updateStudyItem = (item) => {
  return axios.put(`${process.env.API_URL}/study/item`, item)
}
export const createStudyItem = (item) => {
  return axios.post(`${process.env.API_URL}/study/item`, item)
}
export const trimPhrase = async (phrase) => {
  return (await axios.get(`${process.env.API_URL}/study/trim-phrase/${phrase}`)).data.phrase
}
export const getStudyItemsToReview = async () => {  
  return (await axios.get(`${process.env.API_URL}/study/review/`)).data
}
export const getStudyItemsToReviewByLessonId = async (lessonId) => {
  return (await axios.get(`${process.env.API_URL}/study/review/?lessonId=${lessonId}`)).data    
}
export const evaluateStudyItem = async(item) => {
  return (await axios.post(`${process.env.API_URL}/study/evaluate/`, item)).data    
}

/**
 * Word endpoints
 */
export const postWords = (words) => {
  return axios.post(`${process.env.API_URL}/word`, {
    words,
  })
}
export const updateWord = (word) => {
  return axios.put(`${process.env.API_URL}/word`, {
    word,
  })
}
export const getWordsStatusReport = async () => {
  return (await axios.get(`${process.env.API_URL}/word/status-report`)).data
}
