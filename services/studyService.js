import * as wordService from './wordService'

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
      translation: wordPhraseTranslation,
    }
  }

  return {
    lessonId,
    wordPhrase: wordTapped.text,
    translation: wordPhraseTranslation,
    wordContext: wordService.getWordContextFromSection(wordTapped, sectionTokens),
  }
}
