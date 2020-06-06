import axios from 'axios'

/**
 * Lesson endpoints
 */
export const getLessonById = async (lessonId) => {
    const lesson = (await axios.get(`${process.env.API_URL}/lesson/${lessonId}`)).data
    return lesson;
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