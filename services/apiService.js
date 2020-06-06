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
export const updateStudyItem = async (study) => {
    await axios.put(`${process.env.API_URL}/study`, study)
}
export const createStudyItem = async (study) => {
    await axios.post(`${process.env.API_URL}/study`, study)
}
export const trimPhrase = async (phrase) => {
    return (await axios.post(`${process.env.API_URL}/study/trim-phrase`, {phrase: phrase,})).data.phrase    
}

/**
 * Word endpoints
 */
export const postWords = async (words) => {
    await axios.post(`${process.env.API_URL}/word`, {
        words,
    })
}
export const updateWord = async (word) => {
    await axios.put(`${process.env.API_URL}/word`, {
        word,
    })
}