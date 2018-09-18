import React, { Component } from 'react';
import Ticker from './Ticker'
import axios from 'axios';

class TickerList extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	tickers: ['one','two', 'three']
	    };
	}
	
	componentDidMount(){
		var that = this;
		axios.get('/portfolio').then(function (res){
			var temp = [];
			for (var i = res.data.tickers.length - 1; i >= 0; i--) {
				temp[i] = res.data.tickers[i].ticker;
			}
	    	//return(Object.values(res.data.tickers));
	    	that.setState({
	    		tickers: temp
	    	});
		}).catch(function(err){
			console.log(err);
		});
	}

	render() { 
		//const tickers = this.getTickers();
		//console.log(tickers);
		//console.log(this.getTickers());
		return(
			<div>
		        {
		          this.state.tickers.map((ticker) => <Ticker key={ticker} tickerText={ticker} />)
		        }
			</div>
		);
	}
}

export default TickerList;