import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { keywords, auth, news} from '../actions';

class Keyword extends Component {


	// componentdidmount => fetchKeywords
    componentDidMount() {
    	//if(!this.props.keywords.length > 0){
    		this.props.fetchKeywords().then(() => this.props.fetchAllowedKeywords().then(() => this.props.fetchNews().then(() => this.props.callbackFromParent(1))));
       		// this.props.fetchAllowedKeywords();
       		// this.props.fetchNews();
    	//}
        
    }

	// state
	state = {
		keyword: "bitcoin",
	}

	// submitkeyword
	submitKeyword = (e) => {
		e.preventDefault();
		this.props.addKeyword(this.state.keyword).then(() => this.props.fetchKeywords().then(() => this.props.fetchNews().then(() => this.props.callbackFromParent(1))));
		// this.props.fetchKeywords();
		// this.props.fetchNews();
		
	}

	//delete


	render() {
		if(this.props.auth.isAuthenticated) {
			return (
					<div className="keyword-section"> 
					Welcome {this.props.user.username}, select a keyword:
						<div className="keyword-form">
						{this.props.errors.length > 0 && (
                            this.props.errors.map(error => (
                                <span key={error.field}>{error.message}</span>
                            )) 
                   		 )}

						<form onSubmit={this.submitKeyword}>
							<select class="selectmenu" onChange={(e) => this.setState({keyword: e.target.value})}>
								{this.props.allowed_keywords.map((keyword) => (
									<option value={keyword.allowed_keyword}>{keyword.allowed_keyword}</option>
								))}
							</select> <br />
							<input className="blue-btn" type="submit" value="Add Keyword"/>
						</form>
						</div>
						<div>
		                {this.props.keywords.map((keyword, id) => (
		                    <button onClick={(e) => {
		                    	e.preventDefault();
		                    	if(window.confirm("Do you really want to delete this keyword?")){
		                    		this.props.deleteKeyword(id).then(() => this.props.fetchKeywords().then(() => this.props.fetchNews().then(() => this.props.callbackFromParent(1))));       		
		                    	}
		                    }} key={`keyword_${keyword.id}`} className="darkblue-btn darkblue-width">{keyword.keyword}</button>
		                ))} 
		                </div>
					</div>

				)
		} else if(!this.props.auth.isLoading) {
			return <div className="pleaselogin"> Please login to customize your news feed. </div>
		}

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
        keywords: state.keywords.keywords,
    	allowed_keywords: state.keywords.allowed_keywords,
        user: state.auth.user,
        auth: state.auth,
       
        errors,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchKeywords: () => {
            return dispatch(keywords.fetchKeywords());
        },
        fetchAllowedKeywords: () => {
            return dispatch(keywords.fetchAllowedKeywords());
        },
        addKeyword: (keyword) => {
        	return dispatch(keywords.addKeyword(keyword));
        },
        deleteKeyword: (id) => {
        	return dispatch(keywords.deleteKeyword(id));
        },
        fetchNews: () => {
        	return dispatch(news.fetchNews());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Keyword); //