import React, { Component } from 'react';

import { connect } from 'react-redux'

import logo from '../logo_block.png'
import group from '../group.png'
import {auth, news } from "../actions";
import blockApp from "../reducers";

import CookieConsent from "react-cookie-consent";



import {Link} from 'react-router-dom'

class Header extends Component {

  render () {


    let button;
    if(this.props.auth.isAuthenticated) {
      button = <button className="blue-btn my-2" onClick={this.props.logout}>Logout</button>
    } else {
      button = <Link to="/login"><button className="blue-btn my-2">Login</button></Link>
      this.props.fetchNews();
    }

    return (
	   <div className="header d-flex flex-column flex-md-row align-items-center px-5 bg-white border-bottom shadow-sm">
      <CookieConsent
            location="top"
            buttonText="Accept"
            style={{ background: "#2B373B" }}
            buttonStyle={{ backgroundColor: "#3ab4bd", color: "#4e503b", fontSize: "13px" }}
            expires={150}
        >
            This website uses cookies to enhance the user experience.{" "}
    </CookieConsent>
      <h5 className="my-0 mr-md-auto font-weight-normal ml-2"><img src={logo} height="70px" className="logo"/></h5>
      <nav className="my-2 my-md-1 mr-md-5 navmenu">
        <Link className="p-4 text-dark navtext" to="/">News</Link>
        <Link className="p-4 text-dark navtext" to="/markets">Markets</Link>
        <Link className="p-4 text-dark navtext" to="/portfolio">Portfolio</Link>
      </nav>
      {button}
    </div>
    )
  }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
          dispatch(auth.logout());
        },
        fetchNews: () => {
          dispatch(news.fetchNews());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
