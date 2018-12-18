import React, { Component } from 'react';

import { connect } from 'react-redux'

import logo from '../logo_block.png'
import logo_light from '../logo_light.png'
import facebook from '../facebook.png'
import twitter from '../twitter.png'
import telegram from '../telegram.png'
import {auth, news } from "../actions";
import blockApp from "../reducers";



import {Link} from 'react-router-dom'

class Footer extends Component {

  render () {
    return (
	   <div className="footer d-flex flex-column flex-md-row px-5 border-bottom">
      <div className="footerinside mx-auto">
      <img src={logo_light} alt="" height="50px" /><br />
      <nav className="my-4">
        <Link className="mx-2 text-light" to="/">News</Link>
        <Link className="mx-2 text-light" to="/markets">Markets</Link>
        <Link className="mx-2 text-light" to="/portfolio">Portfolio</Link>
      </nav>
      <div className="my-4">Copyright blockcontainer.io - All rights reserved. <Link className="mx-2 text-light" to="/imprint">Imprint</Link> | <Link className="mx-2 text-light" to="/policy">Privacy Policy</Link> | <Link className="mx-2 text-light" to="/terms">Terms of Use</Link></div>
      <div className="my-4">
        <a href="https://facebook.com/theblockcontainer" alt="" target="_blank"><img src={facebook} alt="" className="mx-2"/></a>
        <a href="https://twitter.com/blockcontainer" alt="" target="_blank"><img src={twitter} alt="" className="mx-2"/></a>
        <a href="#" alt="" target="_blank"><img src={telegram} alt="" className="mx-2"/></a>
      </div>
      </div>
    </div>
    )
  }
}



export default Footer;
