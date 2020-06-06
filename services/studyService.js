import * as wordService from './wordService'

export const buildStudyObject = (
  phraseSelected,
  wordPhraseTranslation,
  wordTapped,
  sectionTokens
) => {
  if (phraseSelected) {
    return {
      wordPhrase: phraseSelected,
      translation: wordPhraseTranslation,
    }
  }

  return {
    wordPhrase: wordTapped.text,
    translation: wordPhraseTranslation,
    wordContext: wordService.getWordContextFromSection(wordTapped, sectionTokens),
  }
}