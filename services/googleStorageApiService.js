import axios from 'axios'

export const getStorageOauthToken = () => {
    return axios.post('https://accounts.google.com/o/oauth2/token', {
        client_secret: process.env.GOOGLE_STORAGE_API_CLIENT_SECRET,
        grant_type: process.env.GOOGLE_STORAGE_API_GRANT_TYPE,
        refresh_token: process.env.GOOGLE_STORAGE_API_REFRESH_TOKEN,
        client_id: process.env.GOOGLE_STORAGE_API_CLIENT_ID

    })
}

export const postObjectOnLessonAudioBucket = async (fileName, file) => {
    const authData = await getStorageOauthToken()
    return axios.post(
        `https://storage.googleapis.com/upload/storage/v1/b/${process.env.GOOGLE_STORAGE_LESSON_AUDIO_BUCKET}/o?uploadType=media&name=${fileName}`,
        file,
        {
            headers: {
                //'Content-Type': ``,
                Authorization: `Bearer ${authData.data.access_token}`,
            },
        }
    )
}

export const deleteObjectOnLessonAudioBucket = async (objectUrl) => {
    objectUrl = objectUrl.replace(/\/download/, '')
    objectUrl = objectUrl.replace(/\?.{1,}/, '')

    const authData = await getStorageOauthToken()
    return axios.delete(
        objectUrl,
        {
            headers: {
                //'Content-Type': ``,
                Authorization: `Bearer ${authData.data.access_token}`,
            },
        }
    )
}