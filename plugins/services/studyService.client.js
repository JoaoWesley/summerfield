import * as wordService from './wordService.client'
import wordStatusType from '../../commons/wordStatusType'

export const buildStudyObject = (
  phraseSelected,
  wordPhraseTranslation,
  wordTapped,
  sectionTokens
) => {
  if (phraseSelected) {
    return {
      wordPhrase: phraseSelected,
      translation: wordPhraseTranslation
    }
  }

  return {
    wordPhrase: wordTapped.text,
    translation: wordPhraseTranslation,
    ...(wordTapped.status !== wordStatusType.LEARNING
      ? { wordContext: wordService.getWordContextFromSection(wordTapped, sectionTokens) }
      : {})
  }
}

export default ({ app }, inject) => {
  inject('studyService', { buildStudyObject })
}
