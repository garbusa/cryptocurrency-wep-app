const initialState = {
  keywords: [],
  allowed_keywords: []
}

export default function keywords (state = initialState, action) {
  let keywordList = state.keywords

  switch (action.type) {
    case 'FETCH_KEYWORDS':
		    return {...state, keywords: [...action.keywords]}

    case 'FETCH_ALLOWEDKEYWORD':
		    return {...state, allowed_keywords: [...action.allowed_keywords]}

    case 'ADD_KEYWORD':

    		return {...state, keywords: [...state.keywords, action.keyword], errors: undefined}

    case 'KEYWORD_EXISTS':
    		return {...state, errors: action.data}

    case 'DELETE_KEYWORD':

    // console.log(keywordList)
    		return {...state, keywords: keywordList.filter(keyword => keyword !== keywordList[action.index])}

    default:
      return state
  }
}
