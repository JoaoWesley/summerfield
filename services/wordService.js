import textTokenSpacerType from '@/commons/textTokenSpacerType'

export const getWordContextFromSection = (word, sectionTokens) => {
  const NUMBER_WORDS = 5
  const END_OF_SECTIONS = sectionTokens.length - 1

  const wordIndexInSection = sectionTokens.reduce((singleValue, token, index) => {
    if (token.text === word.text && token.index === word.index) {
      singleValue = index
    }
    return singleValue
  })

  const startIndex = wordIndexInSection - NUMBER_WORDS >= 0 ? wordIndexInSection - NUMBER_WORDS : 0
  const endIndex =
    wordIndexInSection + NUMBER_WORDS > END_OF_SECTIONS
      ? END_OF_SECTIONS
      : wordIndexInSection + NUMBER_WORDS

  const contextRange = sectionTokens.slice(startIndex, endIndex + 1) //Mais 1 pois se não o slice pega -1
  const contextRangeWords = contextRange.map((token) => token.text)
  let wordContext = ''

  if (wordIndexInSection - NUMBER_WORDS > 0) {
    wordContext = '...'
  }

  contextRangeWords.forEach((word, index) => {
    const nextWord = contextRangeWords[index + 1]
    if (textTokenSpacerType.BR === word) {
      return
    }
    wordContext += word
    if (!nextWord) {
      return
    }
    if (nextWord.match(/[a-z]+/i) || nextWord.match(/[0-9]+/)) {
      wordContext += ' '
    }
  })

  if (endIndex < END_OF_SECTIONS) {
    wordContext += '...'
  }

  return wordContext
}
