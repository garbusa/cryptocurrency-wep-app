export const fetchKeywords = () => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'}
    let {token} = getState().auth

    if (token) {
      headers['Authorization'] = `Token ${token}`
    }

    return fetch('http://127.0.0.1:8000/api/keywords/', {headers })
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
          return dispatch({type: 'FETCH_KEYWORDS', keywords: res.data})
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: 'AUTHENTICATION_ERROR', data: res.data})
          throw res.data
        }
      })
  }
}

export const fetchAllowedKeywords = () => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'}
    let {token} = getState().auth

    if (token) {
      headers['Authorization'] = `Token ${token}`
    }

    return fetch('http://127.0.0.1:8000/api/allowedkeywords/', {headers })
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
          return dispatch({type: 'FETCH_ALLOWEDKEYWORD', allowed_keywords: res.data})
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: 'AUTHENTICATION_ERROR', data: res.data})
          throw res.data
        }
      })
  }
}

export const addKeyword = keyword => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'}
    let {token} = getState().auth

    if (token) {
      headers['Authorization'] = `Token ${token}`
    }

    let body = JSON.stringify({keyword })

    return fetch('http://127.0.0.1:8000/api/keywords/', {headers, body, method: 'POST' })
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
          return dispatch({type: 'ADD_KEYWORD', keyword: res.data})
        } else if (res.status === 400) {
          return dispatch({type: 'KEYWORD_EXISTS', data: res.data})
          throw res.data
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: 'AUTHENTICATION_ERROR', data: res.data})
          throw res.data
        }
      })
  }
}

export const deleteKeyword = index => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'}
    let {token} = getState().auth

    if (token) {
      headers['Authorization'] = `Token ${token}`
    }

    let keywordId = getState().keywords.keywords[index].id

    return fetch(`http://127.0.0.1:8000/api/keywords/${keywordId}/`, {headers, method: 'DELETE'})
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
          return dispatch({type: 'DELETE_KEYWORD', index})
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: 'AUTHENTICATION_ERROR', data: res.data})
          throw res.data
        }
      })
  }
}
