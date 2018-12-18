export const fetchMarkets = () => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'}

    return fetch('http://127.0.0.1:8000/api/prices/', {headers })
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
          let data = Object.values(res.data).sort().forEach((x, y) => x.rank - y.rank)
          return dispatch({type: 'FETCH_MARKETS', markets: data})
        }
      })
  }
}
