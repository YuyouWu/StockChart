import React, { Component } from 'react';
import Ticker from './Ticker'
//import AddTickers from './AddTickers'
import axios from 'axios';

//Class for rendering list of tickers
class TickerList extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	tickers: ['Loading']
	    };
	}
	
	componentDidMount(){
		var that = this;
		//API to get the list of tickers
		axios.get('/portfolio').then(function (res){
			var temp = [];
			for (var i = res.data.tickers.length - 1; i >= 0; i--) {
				temp[i] = res.data.tickers[i].ticker;
			}
	    	that.setState({
	    		tickers: temp
	    	});
		}).catch(function(err){
			console.log(err);
		});
	}

	handleAddTicker = (e) => {
		var that = this;
		var temp = [];
	    const ticker = e.target.elements.ticker.value.trim();

	    temp = that.state.tickers;
		temp.push(ticker);

		var tickerObj = {
			"ticker": ticker
		}
		//API to post new ticker
		axios.post('/portfolio/add', tickerObj).then(function (res){
		}).catch(function(err){
			console.log(err);
		});
	}


	render() { 
		return(
			<div>
				<br />
		        <form onSubmit={this.handleAddTicker}>
		          <input type="text" name="ticker" />
		          <button>Add Ticker</button>
		        </form>
		        {
		          this.state.tickers.map((ticker) => <Ticker key={ticker} tickerText={ticker} />)
		        }
			</div>
		);
	}
}

export default TickerList;