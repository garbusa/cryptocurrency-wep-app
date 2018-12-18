import React, { Component } from 'react'
import Header from './Header'
import Keyword from './Keyword'

import { connect } from 'react-redux';
import { keywords, auth, news } from '../actions';

import fav from '../fav.png'
import Footer from './Footer'

class News extends Component {

  state = {
    currentPage: 1,
    newsPerPage: 50,
  }

	componentDidMount(){
    this.setState({currentPage: 1})
		this.props.fetchKeywords().then(() => this.props.fetchNews().then(() => this.setState({currentPage: 1})));
    this.handleClick = this.handleClick.bind(this);   
	}

  handleClick = (e) => {
    this.setState({
      currentPage: Number(e.target.id)
    });
  }

  handleFirst = (e) => {
    this.setState({
      currentPage: 1
    })
  }

  handleLast(param, e) {
    this.setState({
      currentPage: param
    })
  }

  myCallback = (dataFromChild) => {
    this.setState({currentPage: dataFromChild});
  }


  render () {
    const { currentPage, newsPerPage } = this.state;
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = this.props.news.slice(indexOfFirstNews, indexOfLastNews);


    const renderNews = currentNews.map((news, index) => {
      return(
            <div className="col-md-4">
              <div className="newsbox mb-4 shadow">
                <div className="card-body">
                  <div className="datebox"><span className="news-date">{news.pubDate.replace("-", "/").replace("-", "/").split(" ")[0]}</span></div>
                  <div className="keywordbox"><img src={fav} alt=""/> {news.keywords.map((keyword) => <span className="keyword">{keyword}</span> )}</div>
                  <h6>{news.title}</h6>
                  <span className="news-description">{news.description}</span>
                  <hr />
                  <span className="news-publisher">- {news.publisher}</span><br />
                  <a href={news.url} alt="" target="_blank" className="darkblue-btn"><button className="darkblue-btn">Read More</button></a>
                </div>
              </div>
            </div>
        );
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(this.props.news.length / newsPerPage); i++) {
      pageNumbers.push(i);
    }

    // const renderPageNumbers = pageNumbers.map(number => {
    //   return (
    //     <button key={number} id={number} className="page-item page-link" onClick={this.handleClick}>{number}</button>
    //   );
    // });

    let threePages = [];

    if(pageNumbers.length <= 1){
       threePages = [currentPage];
    }
    else if(currentPage == 1) {
      threePages = [currentPage, currentPage+1];
    } else if(currentPage > 1 && currentPage < pageNumbers[pageNumbers.length-1]){
      threePages = [currentPage-1, currentPage, currentPage+1];
    } else {
      threePages = [currentPage-1, currentPage];
    }

    const renderThreePages = threePages.map(number => {
      if(currentPage > 0 && currentPage <= pageNumbers.length){
        if(number == currentPage) {
           return (
            <button key={number} id={number} className="page-item page-link-new currentPage" onClick={this.handleClick}>{number}</button>
          );
         } else {
           return (
            <button key={number} id={number} className="page-item page-link-new notcurrentPage" onClick={this.handleClick}>{number}</button>
          );
         }
       
      }
      
    });

    return (
      <div className='news-app'>
      <Header/>
      <Keyword callbackFromParent={this.myCallback}/>

      <div className="album py-5 bg-light">
        <div className="container">

          <nav aria-label="Page navigation example">
            <ul className="pagination">
          <button className="page-item page-link-new notcurrentPage page-link-left" onClick={this.handleFirst}>First</button>
          {renderThreePages}
          <button className="page-item page-link-new notcurrentPage page-link-right" onClick={this.handleLast.bind(this, pageNumbers[pageNumbers.length-1])}>Last</button>
            </ul>
          </nav>


          <div className="row">
            {renderNews}
          </div>

        </div>
      </div>
    <Footer/>
    </div>
    )
  }
}

const mapStateToProps = state => {
	let errors = [];
    if (state.keywords.errors) {
        errors = Object.keys(state.keywords.errors).map(field => {
            return {field, message: state.keywords.errors[field]};
        });
    }
    return {
    	news: state.news.news,
        keywords: state.keywords.keywords,
        user: state.auth.user,
        auth: state.auth,
        errors
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchKeywords: () => {
          return dispatch(keywords.fetchKeywords());
        },
        fetchNews: () => {
        	return dispatch(news.fetchNews());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(News); //
