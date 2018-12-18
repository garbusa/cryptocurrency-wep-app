import React, { Component } from 'react'
import {Link} from 'react-router-dom'

class NotFound extends Component {
  render () {
    return (
	  <div>
        This Page doesn't exists.
      	<Link to="/">Home</Link>
      </div>
    )
  }
}

export default NotFound


      