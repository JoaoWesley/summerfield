export const storeSectionsState = ({ _id, index }, window) => {
  if (_id) {
    let sectionState = { _id, window }
    let lessonSectionsState = JSON.parse(localStorage.getItem('lessonsSectionsState'))
    if (lessonSectionsState) {
      lessonSectionsState = lessonSectionsState.filter((sectionState) => sectionState._id != _id) // Remove old state
      lessonSectionsState.push(sectionState)
    } else {
      lessonSectionsState = [sectionState]
    }
    localStorage.setItem('lessonsSectionsState', JSON.stringify(lessonSectionsState))
    return
  }

  let sectionState = { index, window }
  let topicSectionsState = JSON.parse(localStorage.getItem('topicsSectionsState'))
  if (topicSectionsState) {
    topicSectionsState = topicSectionsState.filter((sectionState) => sectionState._id != _id) // Remove old state
    topicSectionsState.push(sectionState)
  } else {
    topicSectionsState = [sectionState]
  }
  localStorage.setItem('topicsSectionsState', JSON.stringify(topicSectionsState))
}

export const getLessonSectionsState = ({ _id }) => {
  const lessonsSectionsState = JSON.parse(localStorage.getItem('lessonsSectionsState'))
  const sectionState = lessonsSectionsState.filter((sectionState) => sectionState._id === _id).pop()
  return sectionState
}

export const getTopicSectionsState = ({ index }) => {
  const topicsSectionsState = JSON.parse(localStorage.getItem('topicsSectionsState'))
  const sectionState = topicsSectionsState
    .filter((sectionState) => sectionState.index === index)
    .pop()
  return sectionState
}

export const setLastUsedTopic = (lessonId, index) => {  
  localStorage.setItem('lastUsedTopic', JSON.stringify({ lessonId, index }))
}

export const getLastUsedTopic = () => {
  return JSON.parse(localStorage.getItem('lastUsedTopic'))
}
