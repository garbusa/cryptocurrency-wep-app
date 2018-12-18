export const fetchNews = () => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'}
    // let {token} = getState().auth

    // if (token) {
    //   headers['Authorization'] = `Token ${token}`
    // }

    return fetch('http://127.0.0.1:8000/api/news/', {headers })
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
          let newsData = []
          let newsDataWithKeywords = []

          if (!getState().auth.isAuthenticated) {
            newsData = res.data.sort((x, y) => y.timestamp - x.timestamp)
          } else {
            if (getState().keywords.keywords.length > 0) {
              getState().keywords.keywords.map((keyword) => {
                newsData = res.data.filter(news => news.keywords.indexOf(keyword.keyword) > -1)
                newsData.map((news) => newsDataWithKeywords.push(news))
              })
              newsData = newsDataWithKeywords.filter((item, pos) => newsDataWithKeywords.indexOf(item) === pos).sort((x, y) => y.timestamp - x.timestamp)
            } else {
              newsData = res.data.sort((x, y) => y.timestamp - x.timestamp)
            }
          }

          return dispatch({type: 'FETCH_NEWS', news: newsData})
        }
      })
  }
}
