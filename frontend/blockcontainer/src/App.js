import React, { Component } from 'react'

import {Switch, Route, BrowserRouter, Redirect, Link} from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import {auth} from './actions'
import rootReducer from './reducers'

import News from './components/News'
import NotFound from './components/NotFound'
import Login from './components/Login'
import Register from './components/Register'
import Market from './components/Market'
import Portfolio from './components/Portfolio'
import Imprint from './components/Imprint'
import Policy from './components/Policy'
import Terms from './components/Terms'

let store = createStore(rootReducer, applyMiddleware(thunk))

class RootContainerComponent extends Component {
  componentDidMount () {
    this.props.loadUser()
  }

  render () {
    if (this.props.auth.isLoading) {
      return <p>Loading..</p>
    } else {
      return (
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={News} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/markets' component={Market} />
            <Route exact path='/portfolio' component={Portfolio} />
            <Route exact path='/imprint' component={Imprint} />
            <Route exact path='/policy' component={Policy} />
            <Route exact path='/terms' component={Terms} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUser: () => {
      return dispatch(auth.loadUser())
    }
  }
}

let RootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent)

export default class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}
