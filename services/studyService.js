import * as wordService from './wordService'
import * as apiService from './apiService'

export const buildStudyObject = (
  lessonId,
  phraseSelected,
  wordPhraseTranslation,
  wordTapped,
  sectionTokens
) => {
  if (phraseSelected) {
    return {
      lessonId,
      wordPhrase: phraseSelected,
      translation: wordPhraseTranslation.text,
    }
  }

  return {
    lessonId,
    wordPhrase: wordTapped.text,
    translation: wordPhraseTranslation.text,
    wordContext: wordService.getWordContextFromSection(wordTapped, sectionTokens),
  }
}

export const getTranslation = async (text) => {
  let translations = await apiService.getTranslation(text)
  translations = translations.map((translation) => {
    return {
      text: translation.translatedText,
    }
  })
  return translations
}
