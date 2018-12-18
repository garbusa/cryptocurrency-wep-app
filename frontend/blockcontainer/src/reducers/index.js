import { combineReducers } from 'redux'
import keywords from './keywords'
import auth from './auth'
import news from './news'
import markets from './markets'
import portfolio from './portfolio'

const blockApp = combineReducers({
  keywords, auth, news, markets, portfolio
})

const rootReducer = (state, action) => {
  if (action.type === 'AUTHENTICATION_ERROR') {
    state = undefined
  }
  return blockApp(state, action)
}

export default rootReducer
