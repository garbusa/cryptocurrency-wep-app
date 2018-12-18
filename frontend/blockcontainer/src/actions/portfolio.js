export const addInvestment = (coin, quantity, buy_price) => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'}
    let {token} = getState().auth

    if (token) {
      headers['Authorization'] = `Token ${token}`
    }

    let body = JSON.stringify({coin, quantity, buy_price })

    return fetch('http://127.0.0.1:8000/api/coins/', {headers, body, method: 'POST' })
      .then(res => {
        if (res.status < 500) {
          return res.json().then(data => {
            return {status: res.status, data}
          })
        } else {
          console.log('Server Error!')
          throw res
        }
      })
      .then(res => {
        if (res.status === 201) {
          return dispatch({type: 'ADD_INVESTMENT', portfolio: res.data})
        } else if (res.status === 400) {
          return dispatch({type: 'COIN_EXISTS', data: res.data})
          // throw res.data
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: 'AUTHENTICATION_ERROR', data: res.data})
          throw res.data
        }
      })
  }
}

export const fetchPortfolio = () => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'}
    let {token} = getState().auth

    if (token) {
      headers['Authorization'] = `Token ${token}`
    }

    return fetch('http://127.0.0.1:8000/api/coins/', {headers })
      .then(res => {
        if (res.status < 500) {
          return res.json().then(data => {
            return {status: res.status, data}
          })
        } else {
          console.log('Server Error!')
          throw res
        }
      })
      .then(res => {
        if (res.status === 200) {
          dispatch({type: 'FETCH_PORTFOLIO', portfolio: res.data, portfolioLoaded: true})
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: 'AUTHENTICATION_ERROR', data: res.data})
          throw res.data
        }
      })
  }
}

export const fetchCoins = () => {
  return (dispatch, getState) => {
    let coins = getState().portfolio.portfolio.map(coin => coin.coin).join(',')
    console.log(coins)
    // console.log(coins)
    return fetch('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + coins + '&tsyms=USD')
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          return dispatch({type: 'FETCH_COINS', coinData: [result['RAW']], coinLoaded: true})
        }
      )
  }
}

export const deleteInvestment = index => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'}
    let {token} = getState().auth

    if (token) {
      headers['Authorization'] = `Token ${token}`
    }

    let coinId = getState().portfolio.portfolio[index].id

    return fetch(`http://127.0.0.1:8000/api/coins/${coinId}/`, {headers, method: 'DELETE'})
      .then(res => {
        if (res.status === 204) {
          return {status: res.status, data: {}}
        } else if (res.status < 500) {
          return res.json().then(data => {
            return {status: res.status, data}
          })
        } else {
          console.log('Server Error!')
          throw res
        }
      })
      .then(res => {
        if (res.status === 204) {
          return dispatch({type: 'DELETE_INVESTMENT', index})
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: 'AUTHENTICATION_ERROR', data: res.data})
          throw res.data
        }
      })
  }
}
