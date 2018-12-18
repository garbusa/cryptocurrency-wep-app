import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header'
import Footer from './Footer'

import Popup from "reactjs-popup";
import TradingViewWidget from 'react-tradingview-widget';




//import { markets } from '../actions';

class Market extends Component {

	constructor(props){
		super(props);
		this.state = {
			errors : null,
			isLoaded: false,
			markets: null
		}
	}

	componentDidMount() {
		setInterval(this.fetchMarkets(), 1000);
	}

	fetchMarkets(){
	    fetch("http://127.0.0.1:8000/api/prices/")
	      .then(res => res.json())
	      .then(
	        (result) => {
	          console.log(result.data)
	          this.setState({
	          	isLoaded: true,
	          	markets: result.data,
	          })
	        },
	        (error) => {
	          this.setState({
	            isLoaded: true,
	            error
	          });
	        }
	      )
  	}
	
	render() {
		let {errors, isLoaded, markets} = this.state

		// Format to USD
		Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
			places = !isNaN(places = Math.abs(places)) ? places : 2;
			symbol = symbol !== undefined ? symbol : "$";
			thousand = thousand || ",";
			decimal = decimal || ".";
			var number = this, 
			    negative = number < 0 ? "-" : "",
			    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
			    j = (j = i.length) > 3 ? j % 3 : 0;
			return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
		};

		if (!isLoaded) {
     		return <div><Header /> Loading...</div>;
   		 } else {
			return (
				<div className="coin-section">
				<Header />
				<h1 className="top100">Top 100 Coins</h1>
				 <table className="table coin-table table-striped">
				  <thead className="thread-blue">
				    <tr>
				      <th scope="col">Rank</th>
				      <th scope="col">Coin</th>
				      <th scope="col">Symbol</th>
				      <th scope="col">Price</th>
				      <th scope="col">Market Cap</th>
				      <th scope="col">Total Supply</th>
				      <th scope="col">24h Change</th>
				    </tr>
				   </thead>
				<tbody>
				{Object.values(markets).sort((x,y) => x.rank-y.rank).map((coin) => <tr> <th scope="row">{coin.rank}</th> <td>{coin.name}</td> <td><Popup trigger={<a href="#">{coin.symbol}</a>} modal contentStyle={{ minWidth: "350px",maxWidth: "990px" }} closeOnDocumentClick > <div className="height500"><TradingViewWidget autosize symbol={coin.symbol+"USD"}/></div> </Popup></td> <td>{coin.quotes.USD.price.formatMoney(4)}</td> <td>{coin.quotes.USD.market_cap.formatMoney(0)}</td> <td>{coin.total_supply.formatMoney(0, '')} {coin.symbol}</td> <td>{coin.quotes.USD.percent_change_24h < 0 ? <span className="negative-24h">{coin.quotes.USD.percent_change_24h}%</span> : <span className="positive-24h">{coin.quotes.USD.percent_change_24h}%</span>}</td> </tr> )} </tbody> </table>
				<Footer/>
				</div>
			)
		}

}
}


export default Market; //