const initialState = {
  news: []
}

export default function news (state = initialState, action) {
  switch (action.type) {
    case 'FETCH_NEWS':
        return {...state, news: [...action.news]}
    default:
      return state
  }
}
