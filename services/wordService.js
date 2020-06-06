import axios from 'axios'

export const saveWordToStudy = async (wordPhrase, translation) => {
  await axios.post(`${process.env.API_URL}/study`, { wordPhrase, translation })
}

export const getWordContextFromSection = (word, sectionTokens) => {
  const startIndex = word.index - 5 >= 0 ? word.index - 5 : 0
  const endIndex =
    word.index + 5 > sectionTokens[sectionTokens.length - 1].index
      ? sectionTokens[sectionTokens.length - 1].index
      : word.index + 7

  const contextRange = sectionTokens.slice(startIndex, endIndex)
  const contextRangeWords = contextRange.map((token) => token.text)
  let wordContext = ''

  if (word.index - 5 > 0) {
    wordContext = '...'
  }

  contextRangeWords.forEach((word, index) => {
    const nextWord = contextRangeWords[index + 1]
    if (!nextWord) {
      return
    }
    wordContext += word
    if (nextWord.match(/[a-z]+/) || nextWord.match(/[0-9]+/)) {
      wordContext += ' '
    }
  })

  if (endIndex < sectionTokens[sectionTokens.length - 1].index) {
    wordContext += '...'
  }

  return wordContext
}