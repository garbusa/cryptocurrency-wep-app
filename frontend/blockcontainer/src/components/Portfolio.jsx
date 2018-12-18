import React, { Component } from 'react'
import Header from './Header'
import { connect } from 'react-redux';
import { auth } from '../actions';
import Popup from 'reactjs-popup';
import { portfolio } from '../actions'
import TradingViewWidget from 'react-tradingview-widget';
import fav from '../fav.png';
import Footer from './Footer'

class Portfolio extends Component {

  state = {
    coin: undefined,
    quantity: undefined,
    buy_price: undefined,
    isLoaded: undefined,
    submitLoaded: undefined,
  } 

	componentDidMount(){
		// this.props.fetchPortfolio();
  //   this.fetchCoins();
    this.props.fetchPortfolio().then(() => this.props.fetchCoins());
  
	}
  
  componentDidUpdate(prevProps) {
    if(this.props.auth.user !== prevProps.auth.user) {
      this.props.fetchCoins();
    }
  }

  // componentWillReceiveProps(){
  //   if(this.props.portfolioLoaded){
  //     this.props.fetchCoins();
  //   }
  // }

  submitInvestment = (e) => {
    e.preventDefault();
    this.props.addInvestment(this.state.coin.toUpperCase(), this.state.quantity, this.state.buy_price)
    .then(() => this.props.fetchPortfolio()
      .then(() => this.props.fetchCoins()));
    
  }

  totalCosts(){
        let costs = 0;
        this.props.portfolio.map((coin, id)  => {
          costs += parseFloat(coin.buy_price*coin.quantity);
        })
        return costs;
  }

  totalHoldings(){
    let holdings = 0;
    this.props.portfolio.map((coin, id)  => {
          this.props.coinData.map((data) => holdings += (data[coin.coin]["USD"]["PRICE"]*parseFloat(coin.quantity)));
    })
    return holdings;
  }

  totalProfit(){
    let costs = this.totalCosts();
    let holdings = this.totalHoldings();

    return holdings-costs;
  }

  getMostProfitable() {
    let best = -1000;
    let bestSymbol = "";
    this.props.portfolio.map((coin, id) => {
      this.props.coinData.map((data) => {
        if(parseFloat((data[coin.coin]["USD"]["PRICE"]*coin.quantity)-(coin.buy_price*coin.quantity)) >= best) {
          best = parseFloat((data[coin.coin]["USD"]["PRICE"]*coin.quantity)-(coin.buy_price*coin.quantity));
          bestSymbol = coin.coin;
        }
      });
   });
   return bestSymbol;
  }

   getBestChangeToday() {
    let best = -1000;
    let bestSymbol = "";
    this.props.portfolio.map((coin, id) => {
      this.props.coinData.map((data) => {
        if(data[coin.coin]["USD"]["CHANGEPCT24HOUR"] >= best) {
          best = data[coin.coin]["USD"]["CHANGEPCT24HOUR"];
          bestSymbol = coin.coin;
        }
      });
   });
    return bestSymbol;
  }

  getBestChangeTodayValue() {
    let best = -10000;
    let bestSymbol = "";
    this.props.portfolio.map((coin, id) => {
      this.props.coinData.map((data) => {
        if(data[coin.coin]["USD"]["CHANGEPCT24HOUR"] >= best) {
          best = data[coin.coin]["USD"]["CHANGEPCT24HOUR"];
          bestSymbol = coin.coin;
        }
      });
   });
    return best;
  }

  getWorstChangeToday() {
    let best = 100000;
    let bestSymbol = "";
    this.props.portfolio.map((coin, id) => {
      this.props.coinData.map((data) => {
        if(data[coin.coin]["USD"]["CHANGEPCT24HOUR"] < best) {
          best = data[coin.coin]["USD"]["CHANGEPCT24HOUR"];
          bestSymbol = coin.coin;
        }
      });
   });
    return bestSymbol;
  }


  getWorstChangeTodayValue() {
    let worst = 10000;
    let worstSymbol = "";
    this.props.portfolio.map((coin, id) => {
      this.props.coinData.map((data) => {
        if(data[coin.coin]["USD"]["CHANGEPCT24HOUR"] <= worst) {
          worst = data[coin.coin]["USD"]["CHANGEPCT24HOUR"];
          worstSymbol = coin.coin;
        }
      });
   });
    return worst;
  }


  // fetchCoins(){
    
  //   let coins = this.props.portfolio.map(coin => coin.coin).join(",");
  //   console.log(coins);
  //   //console.log(coins)
  //   fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms="+coins+"&tsyms=USD")
  //       .then(res => res.json())
  //       .then(
  //         (result) => {
  //           console.log(result["RAW"])
  //           this.setState({
  //             isLoaded: true,
  //             coindata: result["RAW"],
  //           })
  //         },
  //         (error) => {
  //           this.setState({
  //             isLoaded: true,
  //             error
  //           });
  //         }
  //       )

  // }



  render() {

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

    let coinSymbol = this.state.coin;   
    let submitLoaded = this.state.submitLoaded



    if(this.props.auth.isAuthenticated && this.props.coinLoaded) {
      return (
          <div className="portfolio-app"> 
            <Header/>
            <div className="portfolio-form">
            <div className="portfolio-div-top shadow-sm">
            <img src={fav} alt=""/> <span className="overview">Overview</span>
              <div className="row">
                <div className="col-md-6 mt-2">
                Costs: {this.totalCosts().formatMoney(4)}<br />
                Profit/Loss: {this.totalProfit().formatMoney(4)}<br />
                Best Change Today: {this.props.portfolio && this.getBestChangeToday()} ({this.getBestChangeTodayValue() == -10000 ? 'emtpy' : parseFloat(this.getBestChangeTodayValue()).formatMoney(4, "")+"%"})<br />
                </div>

                <div className="col-md-6 mt-2">
                Holdings: {this.totalHoldings().formatMoney(4)}<br />
                Most Profitable: {this.getMostProfitable()}<br />
                Worst Change Today: {this.getWorstChangeToday()} ({this.getWorstChangeTodayValue() == 10000 ? 'emtpy' : parseFloat(this.getWorstChangeTodayValue()).formatMoney(4, "")+"%"})<br />
                </div>
              </div>

            </div>
            </div>

            <div className="investment">
            <Popup 
                trigger={<button className="blue-btn">Add Investment</button>} 
                modal
                contentStyle={{ maxWidth: "450px", maxHeight: "400px" }} closeOnDocumentClick >
                <div className="addinvestment">
                <img src={fav} alt=""/> <span className="overview">Enter Details e.g. XRP</span>
                 <form onSubmit={this.submitInvestment}>
                  {this.props.errors.length > 0 && (
                            this.props.errors.map(error => (
                                <span key={error.field}>{error.message}</span>
                            )) 
                  )} <br/>
                  <input className="my-1 width-90"  type="text" id="coin" onChange={e => this.setState({coin: e.target.value})} placeholder="Enter coin..." required/><br />
                  <input className="my-1 width-90" type="text" id="quantity" onChange={e => this.setState({quantity: e.target.value})} placeholder="Enter quantity..."required/> {coinSymbol}<br />
                  <input className="my-1 width-90" type="text" id="buy_price" onChange={e => this.setState({buy_price: e.target.value})} placeholder="Enter buy price..."required/> $<br />
                  <input className="blue-btn blue-btn-100 my-2" type="submit" value="Add to Portfolio"/><br />
                 </form>
                </div>
              </Popup>
            </div>

          <div className="container">
            <div className="row">
            {this.props.portfolio.map((coin, id)  => {
                return (
                  <div className="col-md-6 my-2" >
                    <div className="portfolio-div shadow" key={`coin_${coin.id}`}>
                    <img src={fav} alt=""/> <span className="overview">{coin.coin}</span><br />
                    <div class="mt-2"><TradingViewWidget autosize symbol={coin.coin+"USD"} height="150px" width="450px" enable_publishing="false" hide_top_toolbar="true" hide_legend="true" save_image="false"/></div>
                    <div className="row">
                      <div className="col-md-6">   
                        Price: {this.props.coinData.map((data) => data[coin.coin]["USD"]["PRICE"].formatMoney(4))}<br />
                        Quantity: {coin.quantity} {coin.coin}<br />
                        Buy Price: {parseFloat(coin.buy_price).formatMoney(4)}<br />
                      </div>
                      <div className="col-md-6">  
                        Costs: {parseFloat(coin.buy_price*coin.quantity).formatMoney(4)}<br />
                        Profit: {this.props.coinData.map((data) => parseFloat((data[coin.coin]["USD"]["PRICE"]*coin.quantity)-(coin.buy_price*coin.quantity)).formatMoney(4))}<br />
                        Percentage Profit: {this.props.coinData.map((data) => parseFloat((data[coin.coin]["USD"]["PRICE"]*coin.quantity-coin.buy_price*coin.quantity)/(coin.buy_price*coin.quantity)*100).formatMoney(5, "") )} %<br />
                     </div>
                     </div>
                      
                      <div className="row mt-2">
                      <div className="col-md-6 my-2">
                      <button className="blue-btn blue-btn-100" onClick={(e) => {
                        this.props.deleteInvestment(id).then(() => this.props.fetchCoins());    
                      }}>Delete</button>
                      </div>
                      <div className="col-md-6 my-2">
                      <Popup 
                        trigger={<button className="blue-btn blue-btn-100">Advanced</button>} 
                        modal
                        contentStyle={{ minWidth: "350px",maxWidth: "990px"}} closeOnDocumentClick >
                        <div className="height400"><TradingViewWidget autosize symbol={coin.coin+"USD"}/></div>
                        <div className="my-2"><img src={fav} alt=""/> <span className="overview">Advanced Data</span></div>
                        <div className="row">
                        <div className="col-6">
                         Vol. 24h: {this.props.coinData.map((data) => data[coin.coin]["USD"]["VOLUME24HOURTO"].formatMoney(4))}<br />
                         High 24h: {this.props.coinData.map((data) => data[coin.coin]["USD"]["HIGH24HOUR"].formatMoney(4))}<br />
                         Low 24h: {this.props.coinData.map((data) => data[coin.coin]["USD"]["LOW24HOUR"].formatMoney(4))}<br />
                        </div>
                        <div className="col-6">
                         Change %: {this.props.coinData.map((data) => data[coin.coin]["USD"]["CHANGEPCT24HOUR"].formatMoney(5, ""))} %<br />
                         Market Cap: {this.props.coinData.map((data) => data[coin.coin]["USD"]["MKTCAP"].formatMoney(4))}<br />
                         Last Exchange: {this.props.coinData.map((data) => data[coin.coin]["USD"]["LASTMARKET"])}<br />
                        </div></div>
                      </Popup>
                       </div>
                      </div>
                      </div>
                  </div>
                  )
              })}
            </div>
          </div>
          <Footer />
          </div>

        )
    } else if(!this.props.auth.isLoading) {
      return (
        <div className="portfolio-app"> 
            <Header/>
            <div className="pleaselogin"> Please log in to manage your assets. </div>
            <Footer />
        </div>  
      ) 
    }
  }
}

const mapStateToProps = state => {
	let errors = [];
    if (state.portfolio.errors) {
        errors = Object.keys(state.portfolio.errors).map(field => {
            return {field, message: state.portfolio.errors[field]};
        });
    }
    return {
      user: state.auth.user,
      auth: state.auth,
      portfolio: state.portfolio.portfolio,
      portfolioLoaded: state.portfolio.portfolioLoaded,
      coin_symbol: state.coin,
      coinData: state.portfolio.coinData,
      coinLoaded: state.portfolio.coinLoaded,
      errors
      // errors
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addInvestment: (coin, quantity, buy_price) => {
          return dispatch(portfolio.addInvestment(coin, quantity, buy_price));
        },
        deleteInvestment: (coin) => {
          return dispatch(portfolio.deleteInvestment(coin));
        },
        fetchPortfolio: () => {
          return dispatch(portfolio.fetchPortfolio());
        },
        fetchCoins: () => {
          return dispatch(portfolio.fetchCoins());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio); //
