const initialState = {
  portfolio: []
}

export default function portfolio (state = initialState, action) {
  let coinList = state.portfolio

  switch (action.type) {
    case 'FETCH_PORTFOLIO':
      return {...state, portfolio: [...action.portfolio], portfolioLoaded: action.portfolioLoaded}

    case 'ADD_INVESTMENT':
      return {...state, portfolio: [...state.portfolio, action.portfolio], errors: undefined, coinLoaded: false}

    case 'COIN_EXISTS':
      return {...state, errors: action.data}

    case 'FETCH_COINS':
      return {...state, coinData: [...action.coinData], coinLoaded: action.coinLoaded}

    case 'DELETE_INVESTMENT':
      return {...state, portfolio: coinList.filter(coin => coin !== coinList[action.index])}

    default:
      return state
  }
}
