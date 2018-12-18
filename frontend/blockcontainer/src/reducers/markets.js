const initialState = {
  markets: []
}

export default function keywords (state = initialState, action) {
  switch (action.type) {
    case 'FETCH_MARKETS':
		    return {...state, markets: [...action.markets]}

    default:
      return state
  }
}
