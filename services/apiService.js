import axios from 'axios'

/**
 * Lesson endpoints
 */
export const getLessons = async () => {
    const lessons = (await axios.get(`${process.env.API_URL}/lesson/`)).data
    return lessons
}
export const getLessonById = async (lessonId) => {
    const lesson = (await axios.get(`${process.env.API_URL}/lesson/${lessonId}`)).data
    return lesson;
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
 * Study endpoints
 */
export const getStudyItems = async () => {
    const studyItems = (await axios.get(`${process.env.API_URL}/study/`)).data.items
    return studyItems;
}
export const updateStudyItem = (study) => {
    return axios.put(`${process.env.API_URL}/study`, study)
}
export const createStudyItem = (study) => {
    return axios.post(`${process.env.API_URL}/study`, study)
}
export const trimPhrase = async (phrase) => {
    return (await axios.get(`${process.env.API_URL}/study/trim-phrase/${phrase}`)).data.phrase
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